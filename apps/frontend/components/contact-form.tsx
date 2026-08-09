"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";

type Labels = { name: string; email: string; phone: string; company: string; message: string; consent: string; submit: string; sending: string; success: string; error: string };
type User = { name: string; email: string };

export function ContactForm({ labels, locale, source = "site" }: { labels: Labels; locale: Locale; source?: string }) {
  const [state, setState] = useState<"loading" | "idle" | "sending" | "success" | "error">("loading");
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(12);
  const ru = locale === "ru";
  const hy = locale === "hy";

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => { if (response.ok) setUser(await response.json()); })
      .catch(() => undefined)
      .finally(() => setState("idle"));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement));
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, name: user?.name ?? payload.name, email: user?.email ?? payload.email, source }),
      });
      if (!response.ok) { setState("error"); return; }
      formElement.reset();
      setProgress(12);
      setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "loading") return <div className="contact-form form-loading">•••</div>;

  return (
    <form className="contact-form contact-form-guest" onSubmit={submit} onInput={(event) => {
      const data = new FormData(event.currentTarget);
      const keys = user ? ["phone", "company", "message"] : ["name", "email", "phone", "company", "message"];
      const completed = keys.filter((key) => String(data.get(key) || "").trim()).length;
      setProgress(Math.round(12 + (completed / keys.length) * 88));
    }}>
      <div className="form-top"><span>{ru ? "Бесплатная консультация" : hy ? "Անվճար խորհրդատվություն" : "Free consultation"}</span><strong>{progress}%</strong></div>
      <div className="form-progress"><i style={{ width: `${progress}%` }} /></div>
      {user ? <div className="form-identity"><strong>{user.name}</strong><span>{user.email}</span></div> : (
        <div className="form-grid">
          <label><span>{labels.name}</span><input name="name" required minLength={2} maxLength={120} autoComplete="name" /></label>
          <label><span>{labels.email}</span><input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
        </div>
      )}
      <div className="form-grid">
        <label><span>{labels.phone}</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+7" /></label>
        <label><span>{labels.company}</span><input name="company" autoComplete="organization" maxLength={160} /></label>
      </div>
      <label className="form-message"><span>{labels.message}</span><textarea name="message" required minLength={10} maxLength={4000} rows={4} placeholder={ru ? "Коротко опишите задачу и желаемый результат" : hy ? "Հակիրճ նկարագրեք խնդիրը և ցանկալի արդյունքը" : "Briefly describe the task and desired result"} /></label>
      <div className="form-submit"><small>{labels.consent}</small><button className="button" type="submit" disabled={state === "sending"}>{state === "sending" ? labels.sending : labels.submit}</button></div>
      <p className={`form-status ${state}`} aria-live="polite">{state === "success" ? labels.success : state === "error" ? labels.error : ""}</p>
    </form>
  );
}
