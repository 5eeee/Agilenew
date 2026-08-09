"""Leads microservice — contact / brief form submissions."""
from __future__ import annotations

import json
import logging
import base64
import hashlib
import hmac
import os
import re
import smtplib
import sqlite3
import sys
import time
from contextlib import contextmanager
from datetime import datetime, timezone
from email.message import EmailMessage
from pathlib import Path
from typing import Iterator, Optional

from fastapi import BackgroundTasks, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "packages"))

from shared import settings  # noqa: E402

STORE = Path(__file__).resolve().parent / "data" / "leads.jsonl"
DATABASE = Path(__file__).resolve().parent / "data" / "accounts.db"
STORE.parent.mkdir(parents=True, exist_ok=True)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
logger = logging.getLogger("agile.leads")

app = FastAPI(title="Agile Leads Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)


class LeadIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: str = Field(..., min_length=3, max_length=160)
    phone: Optional[str] = Field(default=None, max_length=40)
    company: Optional[str] = Field(default=None, max_length=160)
    message: str = Field(..., min_length=1, max_length=4000)
    source: str = Field(default="site", max_length=80)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not EMAIL_RE.match(value):
            raise ValueError("invalid email")
        return value


class AccountIn(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str = Field(..., min_length=3, max_length=160)
    password: str = Field(..., min_length=8, max_length=200)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if not EMAIL_RE.match(value):
            raise ValueError("invalid email")
        return value


class LoginIn(BaseModel):
    email: str
    password: str


class StatusIn(BaseModel):
    status: str = Field(pattern="^(new|in_progress|completed|cancelled)$")


@contextmanager
def db() -> Iterator[sqlite3.Connection]:
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    connection.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT NOT NULL)")
    try:
        yield connection
        connection.commit()
    finally:
        connection.close()


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
    return f"{base64.urlsafe_b64encode(salt).decode()}.{base64.urlsafe_b64encode(digest).decode()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt_encoded, digest_encoded = stored.split(".", 1)
        salt = base64.urlsafe_b64decode(salt_encoded)
        expected = base64.urlsafe_b64decode(digest_encoded)
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
        return hmac.compare_digest(actual, expected)
    except (ValueError, TypeError):
        return False


def make_token(user_id: int) -> str:
    payload = f"{user_id}:{int(time.time()) + 60 * 60 * 24 * 30}"
    signature = hmac.new(settings.auth_secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    return base64.urlsafe_b64encode(f"{payload}:{signature}".encode()).decode()


def authenticated_user(authorization: str) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(401, "authentication required")
    try:
        decoded = base64.urlsafe_b64decode(authorization[7:].encode()).decode()
        user_id, expires, signature = decoded.split(":", 2)
        payload = f"{user_id}:{expires}"
        expected = hmac.new(settings.auth_secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
        if int(expires) < int(time.time()) or not hmac.compare_digest(signature, expected):
            raise ValueError
    except (ValueError, TypeError, UnicodeDecodeError):
        raise HTTPException(401, "invalid session") from None
    with db() as connection:
        row = connection.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", (int(user_id),)).fetchone()
    if not row:
        raise HTTPException(401, "account not found")
    return dict(row)


@app.post("/api/v1/auth/register")
def register(payload: AccountIn):
    created_at = datetime.now(timezone.utc).isoformat()
    try:
        with db() as connection:
            cursor = connection.execute("INSERT INTO users(name,email,password_hash,created_at) VALUES(?,?,?,?)", (payload.name.strip(), payload.email, hash_password(payload.password), created_at))
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(409, "account already exists") from None
    return {"token": make_token(int(user_id)), "user": {"id": user_id, "name": payload.name.strip(), "email": payload.email}}


@app.post("/api/v1/auth/login")
def login(payload: LoginIn):
    with db() as connection:
        row = connection.execute("SELECT id,name,email,password_hash FROM users WHERE email = ?", (payload.email.strip().lower(),)).fetchone()
    if not row or not verify_password(payload.password, row["password_hash"]):
        raise HTTPException(401, "invalid email or password")
    return {"token": make_token(row["id"]), "user": {"id": row["id"], "name": row["name"], "email": row["email"]}}


@app.get("/api/v1/auth/me")
def me(authorization: str = Header(default="")):
    return authenticated_user(authorization)


@app.get("/api/v1/auth/orders")
def orders(authorization: str = Header(default="")):
    user = authenticated_user(authorization)
    if not STORE.exists():
        return []
    records = [json.loads(line) for line in STORE.read_text(encoding="utf-8").splitlines() if line.strip()]
    return [{**item, "status": item.get("status", "new")} for item in reversed(records) if item.get("user_id") == user["id"]]


@app.get("/health")
def health():
    return {"status": "ok", "service": "leads"}


def send_email_notification(record: dict, raise_on_error: bool = False) -> bool:
    if not settings.smtp_host or not settings.email_to:
        logger.info("Email notification skipped: SMTP is not configured", extra={"lead_id": record.get("id")})
        return False
    message = EmailMessage()
    message["Subject"] = f"Новая заявка Agile Business — {record['name']}"
    message["From"] = settings.email_from or settings.smtp_user
    message["To"] = settings.email_to
    message.set_content(
        "\n".join(
            [
                f"Имя: {record['name']}",
                f"Email: {record['email']}",
                f"Телефон: {record.get('phone') or '—'}",
                f"Компания: {record.get('company') or '—'}",
                f"Источник: {record.get('source') or 'site'}",
                "",
                record["message"],
            ]
        )
    )
    try:
        if settings.smtp_secure:
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
                if settings.smtp_user:
                    smtp.login(settings.smtp_user, settings.smtp_pass)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
                smtp.starttls()
                if settings.smtp_user:
                    smtp.login(settings.smtp_user, settings.smtp_pass)
                smtp.send_message(message)
        logger.info("Email notification sent", extra={"lead_id": record.get("id"), "recipient": settings.email_to})
        return True
    except Exception:
        logger.exception("Email notification failed", extra={"lead_id": record.get("id"), "smtp_host": settings.smtp_host})
        if raise_on_error:
            raise
        return False


def require_admin(authorization: str) -> None:
    expected = f"Bearer {settings.leads_read_token}" if settings.leads_read_token else ""
    if not expected or authorization != expected:
        raise HTTPException(403, "admin access is restricted")


@app.get("/api/v1/leads/email/status")
def email_status(authorization: str = Header(default="")):
    require_admin(authorization)
    configured = bool(settings.smtp_host and settings.smtp_user and settings.smtp_pass and settings.email_to)
    return {
        "configured": configured,
        "status": "ready" if configured else "not_configured",
        "host": settings.smtp_host or None,
        "port": settings.smtp_port,
        "secure": settings.smtp_secure,
        "from": settings.email_from or settings.smtp_user or None,
        "to": settings.email_to or None,
    }


@app.post("/api/v1/leads/email/test")
def test_email(authorization: str = Header(default="")):
    require_admin(authorization)
    if not (settings.smtp_host and settings.smtp_user and settings.smtp_pass and settings.email_to):
        raise HTTPException(503, "SMTP is not fully configured")
    record = {
        "id": f"test-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
        "name": "SMTP test",
        "email": settings.email_to,
        "phone": "",
        "company": "Agile Business",
        "source": "admin-email-test",
        "message": "Тестовое письмо. Почтовый контур Agile Business работает.",
    }
    try:
        send_email_notification(record, raise_on_error=True)
    except Exception as exc:
        raise HTTPException(502, f"SMTP delivery failed: {type(exc).__name__}") from None
    return {"ok": True, "recipient": settings.email_to}


@app.post("/api/v1/leads")
def create_lead(payload: LeadIn, background_tasks: BackgroundTasks, authorization: str = Header(default="")):
    user = authenticated_user(authorization)
    record = {
        "id": datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f"),
        "created_at": datetime.now(timezone.utc).isoformat(),
        **payload.model_dump(),
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "status": "new",
    }
    with STORE.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False) + "\n")
    background_tasks.add_task(send_email_notification, record)
    return {"ok": True, "id": record["id"]}


@app.get("/api/v1/leads")
def list_leads(limit: int = 50, authorization: str = Header(default="")):
    require_admin(authorization)
    if not STORE.exists():
        return []
    lines = STORE.read_text(encoding="utf-8").strip().splitlines()
    items = [json.loads(line) for line in lines if line.strip()]
    return list(reversed(items[-max(1, min(limit, 200)) :]))


@app.patch("/api/v1/leads/{lead_id}/status")
def update_lead_status(lead_id: str, payload: StatusIn, authorization: str = Header(default="")):
    require_admin(authorization)
    if not STORE.exists():
        raise HTTPException(404, "lead not found")
    items = [json.loads(line) for line in STORE.read_text(encoding="utf-8").splitlines() if line.strip()]
    found = False
    for item in items:
        if item.get("id") == lead_id:
            item["status"] = payload.status
            found = True
            break
    if not found:
        raise HTTPException(404, "lead not found")
    temporary = STORE.with_suffix(".tmp")
    temporary.write_text("".join(json.dumps(item, ensure_ascii=False) + "\n" for item in items), encoding="utf-8")
    temporary.replace(STORE)
    return {"ok": True, "id": lead_id, "status": payload.status}


def main():
    import uvicorn

    uvicorn.run(app, host=settings.leads_host, port=settings.leads_port)


if __name__ == "__main__":
    main()
