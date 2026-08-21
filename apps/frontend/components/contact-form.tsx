"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";
import { useRegionalContacts } from "@/components/use-regional-contacts";

type Labels = { name: string; email: string; phone: string; company: string; message: string; consent: string; submit: string; sending: string; success: string; error: string };
type User = { name: string; email: string };

const phoneCountries = {
  ru: { flag: "🇷🇺", code: "+7", digits: 10 },
  ka: { flag: "🇬🇪", code: "+995", digits: 9 },
  hy: { flag: "🇦🇲", code: "+374", digits: 8 },
  bg: { flag: "🇧🇬", code: "+359", digits: 9 },
  en: { flag: "🇬🇧", code: "+44", digits: 10 },
} as const;

type PhoneCountry = keyof typeof phoneCountries;

function formatPhone(country: PhoneCountry, raw: string) {
  const config = phoneCountries[country];
  let digits = raw.replace(/\D/g, "");
  const codeDigits = config.code.slice(1);
  if (digits.startsWith(codeDigits)) digits = digits.slice(codeDigits.length);
  digits = digits.slice(0, config.digits);
  if (country === "ru") return `${config.code}${digits ? ` (${digits.slice(0, 3)}` : ""}${digits.length >= 3 ? ")" : ""}${digits.length > 3 ? ` ${digits.slice(3, 6)}` : ""}${digits.length > 6 ? `-${digits.slice(6, 8)}` : ""}${digits.length > 8 ? `-${digits.slice(8, 10)}` : ""}`;
  if (country === "hy") return `${config.code}${digits ? ` ${digits.slice(0, 2)}` : ""}${digits.length > 2 ? ` ${digits.slice(2, 5)}` : ""}${digits.length > 5 ? ` ${digits.slice(5, 8)}` : ""}`;
  if (country === "ka") return `${config.code}${digits ? ` ${digits.slice(0, 3)}` : ""}${digits.length > 3 ? ` ${digits.slice(3, 5)}` : ""}${digits.length > 5 ? ` ${digits.slice(5, 7)}` : ""}${digits.length > 7 ? ` ${digits.slice(7, 9)}` : ""}`;
  if (country === "bg") return `${config.code}${digits ? ` ${digits.slice(0, 2)}` : ""}${digits.length > 2 ? ` ${digits.slice(2, 5)}` : ""}${digits.length > 5 ? ` ${digits.slice(5, 9)}` : ""}`;
  return `${config.code}${digits ? ` ${digits.slice(0, 4)}` : ""}${digits.length > 4 ? ` ${digits.slice(4, 10)}` : ""}`;
}

export function ContactForm({ labels, locale, source = "site" }: { labels: Labels; locale: Locale; source?: string }) {
  const contacts = useRegionalContacts();
  const [state, setState] = useState<"loading" | "idle" | "sending" | "success" | "error">("loading");
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState(12);
  const [phoneCountry, setPhoneCountry] = useState<PhoneCountry>(locale);
  const [phone, setPhone] = useState<string>(phoneCountries[locale].code);
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
      setPhone(phoneCountries[phoneCountry].code);
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
        <label><span>{labels.phone}</span><div className="phone-field"><select aria-label={ru ? "Код страны" : "Country code"} value={phoneCountry} onChange={(event) => { const country = event.target.value as PhoneCountry; setPhoneCountry(country); setPhone(phoneCountries[country].code); }}>{(Object.keys(phoneCountries) as PhoneCountry[]).map((country) => <option key={country} value={country}>{phoneCountries[country].flag} {phoneCountries[country].code}</option>)}</select><input name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(event) => setPhone(formatPhone(phoneCountry, event.target.value))} pattern="^\+[0-9][0-9 ()-]{7,24}$" maxLength={26} /></div></label>
        <label><span>{labels.company}</span><input name="company" autoComplete="organization" minLength={2} maxLength={200} /></label>
      </div>
      <label className="form-message"><span>{labels.message}</span><textarea name="message" required minLength={10} maxLength={3000} rows={4} placeholder={ru ? "Коротко опишите задачу и желаемый результат" : hy ? "Հակիրճ նկարագրեք խնդիրը և ցանկալի արդյունքը" : "Briefly describe the task and desired result"} /></label>
      <div className="form-submit"><label className="form-consent"><input type="checkbox" required /><span>{labels.consent} <Link href={`/${locale}/privacy`}>{ru ? "Открыть политику" : hy ? "Դիտել քաղաքականությունը" : "View policy"}</Link></span></label><button className="button" type="submit" disabled={state === "sending"}>{state === "sending" ? labels.sending : labels.submit}</button></div>
      <p className={`form-status ${state}`} aria-live="polite">{state === "success" ? (ru ? "Спасибо. Заявка принята — в ближайшее время с вами свяжется специалист." : labels.success) : state === "error" ? labels.error.replace("info@agile-business-pro.com", contacts.email) : ""}</p>
    </form>
  );
}
