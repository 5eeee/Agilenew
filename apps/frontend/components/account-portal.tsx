"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getAccountCopy } from "@/lib/account-copy";
import { AccountDashboard, type AccountOrder, type AccountService, type AccountUser } from "@/components/account-dashboard";

type AuthView = "login" | "register" | "forgot" | "reset";

export function AccountPortal({ locale, services, resetToken }: { locale: Locale; services: AccountService[]; resetToken?: string }) {
  const copy = getAccountCopy(locale);
  const [user, setUser] = useState<AccountUser | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [draftIds, setDraftIds] = useState<string[]>([]);
  const [view, setView] = useState<AuthView>(resetToken ? "reset" : "login");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const loadAccount = useCallback(async () => {
    try {
      const me = await fetch("/api/auth/me", { cache: "no-store" });
      if (!me.ok) { setUser(null); return; }
      setUser(await me.json());
      const response = await fetch("/api/auth/orders", { cache: "no-store" });
      if (response.ok) setOrders(await response.json());
    } catch {
      setStatus(copy.error);
    } finally {
      setLoading(false);
    }
  }, [copy.error]);

  useEffect(() => {
    queueMicrotask(() => void loadAccount());
  }, [loadAccount]);
  useEffect(() => {
    const sync = () => {
      try {
        const saved = JSON.parse(window.localStorage.getItem("agile-service-cart-v1") ?? "[]");
        setDraftIds(Array.isArray(saved) ? saved.filter((value): value is string => typeof value === "string") : []);
      } catch { setDraftIds([]); }
    };
    sync();
    window.addEventListener("agile-cart-change", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("agile-cart-change", sync); window.removeEventListener("storage", sync); };
  }, []);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/auth/${view}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
    if (!response?.ok) { setStatus(copy.error); return; }
    setLoading(true);
    await loadAccount();
  }

  async function requestRecovery(email: string) {
    await fetch("/api/auth/password/request", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, locale }) }).catch(() => null);
  }

  async function recover(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const email = String(new FormData(event.currentTarget).get("email") || "");
    await requestRecovery(email);
    setStatus(copy.resetSent);
  }

  async function reset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const password = String(new FormData(event.currentTarget).get("password") || "");
    const response = await fetch("/api/auth/password/reset", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: resetToken, password }) }).catch(() => null);
    if (!response?.ok) { setStatus(copy.error); return; }
    window.history.replaceState(null, "", `/${locale}/account`);
    setView("login");
    setStatus(copy.resetSuccess);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
    setView("login");
  }

  if (loading) return <div className="account-loading" aria-live="polite"><span /><span /><span /></div>;
  if (user && view !== "reset") return <AccountDashboard user={user} orders={orders} services={services} draftIds={draftIds} locale={locale} copy={copy} onUserChange={setUser} onOrdersChange={setOrders} onDraftsChange={setDraftIds} onLogout={logout} onRequestRecovery={() => requestRecovery(user.email)} />;

  const formTitle = view === "forgot" ? copy.recovery : view === "reset" ? copy.reset : copy.title;
  const formText = view === "forgot" ? copy.recoveryText : view === "reset" ? copy.resetText : copy.clientSpace;
  return <section className="account-auth client-account-auth">
    <header className="account-auth-head"><div><span>{copy.clientSpace}</span><h1>{formTitle}</h1><p>{formText}</p></div><Link className="account-cart-link" href={`/${locale}/cart`}>{copy.cart}<span>↗</span></Link></header>
    {view === "login" || view === "register" ? <div className="account-tabs" role="tablist"><button type="button" role="tab" aria-selected={view === "login"} className={view === "login" ? "active" : ""} onClick={() => { setView("login"); setStatus(""); }}>{copy.login}</button><button type="button" role="tab" aria-selected={view === "register"} className={view === "register" ? "active" : ""} onClick={() => { setView("register"); setStatus(""); }}>{copy.register}</button></div> : null}
    {view === "login" || view === "register" ? <form onSubmit={authenticate}>{view === "register" ? <label><span>{copy.name}</span><input name="name" required minLength={2} autoComplete="name" /></label> : null}<label><span>{copy.email}</span><input name="email" type="email" required autoComplete="email" /></label><label><span>{copy.password}</span><input name="password" type="password" required minLength={8} autoComplete={view === "login" ? "current-password" : "new-password"} /></label><button className="button" type="submit">{view === "login" ? copy.login : copy.register}<span>↗</span></button>{view === "login" ? <button className="account-auth-text-button" type="button" onClick={() => { setView("forgot"); setStatus(""); }}>{copy.forgot}</button> : null}<p role="status">{status}</p></form> : null}
    {view === "forgot" ? <form onSubmit={recover}><label><span>{copy.email}</span><input name="email" type="email" required autoComplete="email" /></label><button className="button" type="submit">{copy.sendLink}<span>↗</span></button><button className="account-auth-text-button" type="button" onClick={() => setView("login")}>{copy.backToLogin}</button><p role="status">{status}</p></form> : null}
    {view === "reset" ? <form onSubmit={reset}><label><span>{copy.newPassword}</span><input name="password" type="password" required minLength={8} autoComplete="new-password" /></label><button className="button" type="submit">{copy.reset}<span>↗</span></button><button className="account-auth-text-button" type="button" onClick={() => setView("login")}>{copy.backToLogin}</button><p role="status">{status}</p></form> : null}
  </section>;
}
