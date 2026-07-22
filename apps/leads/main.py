"""Leads microservice — contact / brief form submissions."""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "packages"))

from shared import settings  # noqa: E402

STORE = Path(__file__).resolve().parent / "data" / "leads.jsonl"
STORE.parent.mkdir(parents=True, exist_ok=True)

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

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


@app.get("/health")
def health():
    return {"status": "ok", "service": "leads"}


@app.post("/api/v1/leads")
def create_lead(payload: LeadIn):
    record = {
        "id": datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S%f"),
        "created_at": datetime.now(timezone.utc).isoformat(),
        **payload.model_dump(),
    }
    with STORE.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(record, ensure_ascii=False) + "\n")
    return {"ok": True, "id": record["id"]}


@app.get("/api/v1/leads")
def list_leads(limit: int = 50):
    if not STORE.exists():
        return []
    lines = STORE.read_text(encoding="utf-8").strip().splitlines()
    items = [json.loads(line) for line in lines if line.strip()]
    return list(reversed(items[-max(1, min(limit, 200)) :]))


def main():
    import uvicorn

    uvicorn.run(app, host=settings.leads_host, port=settings.leads_port)


if __name__ == "__main__":
    main()
