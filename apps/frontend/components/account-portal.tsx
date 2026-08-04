"use client";

import { FormEvent, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ProductWorkspace } from "@/components/product-workspace";

type User = { id: string; name: string; email: string };
type Order = { id: string; created_at: string; message: string; source?: string; status: string };

export function AccountPortal({ locale }: { locale: Locale }) {
  const ru = locale === "ru";
  const hy = locale === "hy";
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const labels = ru ? { title: "Личный кабинет", login: "Войти", register: "Регистрация", name: "Имя", email: "Почта", password: "Пароль", orders: "Ваши заказы и заявки", empty: "Пока нет заказов. После отправки заявки она появится здесь.", logout: "Выйти", error: "Проверьте данные и попробуйте снова.", statuses: { new: "Новая заявка", in_progress: "В работе", completed: "Завершено", cancelled: "Отменено" } } : hy ? { title: "Անձնական հաշիվ", login: "Մուտք", register: "Գրանցում", name: "Անուն", email: "Էլ. փոստ", password: "Գաղտնաբառ", orders: "Ձեր պատվերներն ու հայտերը", empty: "Դեռ պատվերներ չկան։ Հայտն ուղարկելուց հետո այն կհայտնվի այստեղ։", logout: "Դուրս գալ", error: "Ստուգեք տվյալները և կրկին փորձեք։", statuses: { new: "Նոր հայտ", in_progress: "Ընթացքի մեջ", completed: "Ավարտված", cancelled: "Չեղարկված" } } : { title: "Client account", login: "Sign in", register: "Register", name: "Name", email: "Email", password: "Password", orders: "Your orders and requests", empty: "No orders yet. Submitted requests will appear here.", logout: "Sign out", error: "Check your details and try again.", statuses: { new: "New request", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" } };

  async function loadAccount() {
    try {
      const me = await fetch("/api/auth/me", { cache: "no-store" });
      if (!me.ok) return;
      setUser(await me.json());
      const orderResponse = await fetch("/api/auth/orders", { cache: "no-store" });
      if (orderResponse.ok) setOrders(await orderResponse.json());
    } catch {
      setStatus(labels.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetch("/api/auth/me", { cache: "no-store" }).then(async me => { if (!me.ok) { setLoading(false); return; } setUser(await me.json()); const orderResponse = await fetch("/api/auth/orders", { cache: "no-store" }); if (orderResponse.ok) setOrders(await orderResponse.json()); setLoading(false); }).catch(() => setLoading(false)); }, []);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) { setStatus(labels.error); return; }
      setLoading(true);
      await loadAccount();
    } catch {
      setStatus(labels.error);
    }
  }

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setUser(null); setOrders([]); }

  if (loading) return <div className="account-loading" aria-live="polite">•••</div>;
  if (!user) return <section className="account-auth"><h1>{labels.title}</h1><div className="account-tabs" role="tablist"><button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>{labels.login}</button><button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>{labels.register}</button></div><form onSubmit={authenticate}>{mode === "register" ? <label><span>{labels.name}</span><input name="name" required minLength={2} autoComplete="name" /></label> : null}<label><span>{labels.email}</span><input name="email" type="email" required autoComplete="email" /></label><label><span>{labels.password}</span><input name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label><button className="button" type="submit">{mode === "login" ? labels.login : labels.register}</button><p role="status">{status}</p></form></section>;
  return <section className="account-dashboard"><header><div><span>{labels.title}</span><h1>{user.name}</h1><a href={`mailto:${user.email}`}>{user.email}</a></div><button type="button" onClick={logout}>{labels.logout}</button></header><ProductWorkspace userId={user.id}/><div className="orders-head"><h2>{labels.orders}</h2><strong>{orders.length}</strong></div><div className="orders-list">{orders.length ? orders.map(order => <article key={order.id}><span>{labels.statuses[order.status as keyof typeof labels.statuses] || labels.statuses.new}</span><time>{new Date(order.created_at).toLocaleDateString(locale === "ru" ? "ru-RU" : locale === "hy" ? "hy-AM" : "en-US")}</time><h3>{order.message}</h3><small>№ {order.id}</small></article>) : <p>{labels.empty}</p>}</div></section>;
}
