"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { ProductWorkspace } from "@/components/product-workspace";

type User = { id: string; name: string; email: string };
type PaymentStatus = "PENDING" | "PAID" | "REFUNDED";
type Order = { id: string; created_at: string; updated_at: string; name: string; total: number; currency: string; status: string; payment_status: PaymentStatus; items: { id: string; title: string; price: number }[] };

const ORDER_STAGES = ["NEW", "DISCOVERY", "PLANNING", "DESIGN", "DEVELOPMENT", "QA", "LAUNCH", "COMPLETED"] as const;

export function AccountPortal({ locale }: { locale: Locale }) {
  const ru = locale === "ru";
  const hy = locale === "hy";
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const labels = ru ? {
    title: "Личный кабинет", login: "Войти", register: "Регистрация", name: "Имя", email: "Почта", password: "Пароль", orders: "Проекты и заказы", emptyTitle: "Пока нет заказов", emptyText: "Соберите первый проект в каталоге услуг.", choose: "Выбрать услуги", cart: "Корзина услуг", logout: "Выйти", error: "Проверьте данные и попробуйте снова.", from: "Состав проекта", paymentPending: "Статус проекта появится после подтверждения оплаты.", paymentRefunded: "Оплата возвращена", stages: { NEW: "Заявка", DISCOVERY: "Погружение", PLANNING: "Планирование", DESIGN: "Дизайн", DEVELOPMENT: "Разработка", QA: "Проверка", LAUNCH: "Запуск", SUPPORT: "Поддержка", COMPLETED: "Готово", CANCELLED: "Отменён" }
  } : hy ? {
    title: "Անձնական հաշիվ", login: "Մուտք", register: "Գրանցում", name: "Անուն", email: "Էլ. փոստ", password: "Գաղտնաբառ", orders: "Նախագծեր և պատվերներ", emptyTitle: "Պատվերներ դեռ չկան", emptyText: "Կազմեք առաջին նախագիծը ծառայությունների կատալոգում։", choose: "Ընտրել ծառայություններ", cart: "Ծառայությունների զամբյուղ", logout: "Դուրս գալ", error: "Ստուգեք տվյալները և կրկին փորձեք։", from: "Նախագծի կազմ", paymentPending: "Նախագծի կարգավիճակը կհայտնվի վճարումը հաստատելուց հետո։", paymentRefunded: "Վճարումը վերադարձվել է", stages: { NEW: "Հայտ", DISCOVERY: "Ուսումնասիրում", PLANNING: "Պլանավորում", DESIGN: "Դիզայն", DEVELOPMENT: "Մշակում", QA: "Ստուգում", LAUNCH: "Մեկնարկ", SUPPORT: "Աջակցություն", COMPLETED: "Պատրաստ է", CANCELLED: "Չեղարկված" }
  } : {
    title: "Client account", login: "Sign in", register: "Register", name: "Name", email: "Email", password: "Password", orders: "Projects and orders", emptyTitle: "No orders yet", emptyText: "Build your first project in the service catalogue.", choose: "Choose services", cart: "Service cart", logout: "Sign out", error: "Check your details and try again.", from: "Project scope", paymentPending: "Project status will appear after payment is confirmed.", paymentRefunded: "Payment refunded", stages: { NEW: "Request", DISCOVERY: "Discovery", PLANNING: "Planning", DESIGN: "Design", DEVELOPMENT: "Development", QA: "QA", LAUNCH: "Launch", SUPPORT: "Support", COMPLETED: "Complete", CANCELLED: "Cancelled" }
  };

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
  if (!user) return <section className="account-auth"><div className="account-auth-head"><h1>{labels.title}</h1><Link className="account-cart-link" href={`/${locale}/cart`}>{labels.cart}<span>↗</span></Link></div><div className="account-tabs" role="tablist"><button type="button" role="tab" aria-selected={mode === "login"} className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>{labels.login}</button><button type="button" role="tab" aria-selected={mode === "register"} className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>{labels.register}</button></div><form onSubmit={authenticate}>{mode === "register" ? <label><span>{labels.name}</span><input name="name" required minLength={2} autoComplete="name" /></label> : null}<label><span>{labels.email}</span><input name="email" type="email" required autoComplete="email" /></label><label><span>{labels.password}</span><input name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label><button className="button" type="submit">{mode === "login" ? labels.login : labels.register}</button><p role="status">{status}</p></form></section>;
  return <section className="account-dashboard"><header><div><span>{labels.title}</span><h1>{user.name}</h1><a href={`mailto:${user.email}`}>{user.email}</a></div><div className="account-header-actions"><Link className="account-cart-link" href={`/${locale}/cart`}>{labels.cart}<span>↗</span></Link><button type="button" onClick={logout}>{labels.logout}</button></div></header><div className="orders-head"><h2>{labels.orders}</h2><strong>{orders.length}</strong></div><div className="orders-list service-order-list">{orders.length ? orders.map(order => {
    const normalizedStatus = order.status === "SUPPORT" ? "LAUNCH" : order.status;
    const activeStage = ORDER_STAGES.indexOf(normalizedStatus as typeof ORDER_STAGES[number]);
    const cancelled = order.status === "CANCELLED";
    const paid = order.payment_status === "PAID";
    const orderState = paid ? labels.stages[order.status as keyof typeof labels.stages] || labels.stages.NEW : order.payment_status === "REFUNDED" ? labels.paymentRefunded : labels.paymentPending;
    return <article className={`service-order-card ${cancelled ? "cancelled" : ""}`} key={order.id}><header><div><span>{orderState}</span><time>{new Date(order.created_at).toLocaleDateString(locale === "ru" ? "ru-RU" : locale === "hy" ? "hy-AM" : "en-US")}</time></div><strong>{new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", { style: "currency", currency: order.currency, maximumFractionDigits: 0 }).format(order.total)}</strong></header><h3>{order.name}</h3><div className="service-order-items"><span>{labels.from}</span>{order.items.map(item => <i key={item.id}>{item.title}</i>)}</div>{paid ? <ol className="order-progress">{ORDER_STAGES.map((stage, index) => <li className={index < activeStage ? "done" : index === activeStage ? "active" : ""} key={stage}><i /><span>{labels.stages[stage]}</span></li>)}</ol> : <div className={`order-payment-state ${order.payment_status.toLowerCase()}`}><strong>{orderState}</strong></div>}<small>№ {order.id}</small></article>;
  }) : <div className="orders-empty-card"><span>0</span><strong>{labels.emptyTitle}</strong><p>{labels.emptyText}</p><Link href={`/${locale}/services`}>{labels.choose}<i>↗</i></Link></div>}</div><ProductWorkspace userId={user.id}/></section>;
}
