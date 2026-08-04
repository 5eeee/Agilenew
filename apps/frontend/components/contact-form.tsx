"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";

type Labels = { name: string; email: string; phone: string; company: string; message: string; consent: string; submit: string; sending: string; success: string; error: string };
type User = { name: string; email: string };

export function ContactForm({ labels, locale, source = "site" }: { labels: Labels; locale: Locale; source?: string }) {
  const [state, setState] = useState<"loading" | "guest" | "idle" | "sending" | "success" | "error">("loading");
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(50);
  const ru = locale === "ru";
  const hy = locale === "hy";

  useEffect(() => { fetch("/api/auth/me", { cache: "no-store" }).then(async response => { if (response.ok) { setUser(await response.json()); setState("idle"); } else setState("guest"); }).catch(() => setState("guest")); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("sending");
    const formElement = event.currentTarget;
    const payload = Object.fromEntries(new FormData(formElement));
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, name: user?.name, email: user?.email, message: ru ? "Запрос на консультацию" : hy ? "Խորհրդատվության հայտ" : "Consultation request", source }) });
      if (response.status === 401) { setState("guest"); return; }
      if (!response.ok) { setState("error"); return; }
      formElement.reset(); setProgress(50); setState("success");
    } catch {
      setState("error");
    }
  }

  if (state === "loading") return <div className="contact-form form-loading">•••</div>;
  if (state === "guest") return <div className="contact-form auth-required"><span>01 / ACCOUNT</span><h2>{ru ? "Сначала создайте учётную запись" : hy ? "Սկզբում ստեղծեք հաշիվ" : "Create an account first"}</h2><p>{ru ? "После регистрации вы сможете отправить заявку и отслеживать её в личном кабинете." : hy ? "Գրանցումից հետո կարող եք ուղարկել հայտ և հետևել դրան անձնական հաշվում։" : "After registering you can submit and track requests in your account."}</p><Link className="button" href={`/${locale}/account`}>{ru ? "Войти или зарегистрироваться" : hy ? "Մուտք կամ գրանցում" : "Sign in or register"}</Link></div>;

  return <form className="contact-form" onSubmit={submit} onInput={event => { const data = new FormData(event.currentTarget); setProgress(50 + (["phone", "company"].filter(key => String(data.get(key) || "").trim()).length * 25)); }}><div className="form-top"><span>{ru ? "Заявка" : hy ? "Հայտ" : "Request"}</span><strong>{progress}%</strong></div><div className="form-progress"><i style={{ width: `${progress}%` }} /></div><div className="form-identity"><strong>{user?.name}</strong><span>{user?.email}</span></div><div className="form-grid"><label><span>{labels.phone}</span><input name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="+7" /></label><label><span>{labels.company}</span><input name="company" autoComplete="organization" maxLength={160} placeholder="Agile Business" /></label></div><div className="form-submit"><small>{labels.consent}</small><button className="button" type="submit" disabled={state === "sending"}>{state === "sending" ? labels.sending : labels.submit}</button></div><p className={`form-status ${state}`} aria-live="polite">{state === "success" ? labels.success : state === "error" ? labels.error : ""}</p></form>;
}
