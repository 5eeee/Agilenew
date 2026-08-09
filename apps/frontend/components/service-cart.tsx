"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { CatalogService } from "@/lib/service-catalog";

const STORAGE_KEY = "agile-service-cart-v1";
const copy = {
  ru: { eyebrow: "Ваш проект", title: "Корзина услуг", text: "Соберите услуги в один проект. После сохранения команда уточнит зависимости, этапы и итоговую смету.", empty: "Корзина пока пустая", emptyText: "Выберите готовые услуги в каталоге или рассчитайте индивидуальный проект.", catalogue: "Перейти к услугам", estimate: "Рассчитать проект", total: "Предварительный бюджет", clear: "Очистить", remove: "Удалить", checkout: "Сохранить проект", login: "Войдите, чтобы сохранить заказ и отслеживать его этапы в личном кабинете.", account: "Войти или зарегистрироваться", success: "Проект сохранён. Команда свяжется с вами для уточнения состава.", open: "Открыть личный кабинет", note: "Оплата сейчас не списывается. Финальная стоимость фиксируется после короткой диагностики.", error: "Не удалось сохранить проект. Попробуйте ещё раз." },
  en: { eyebrow: "Your project", title: "Service cart", text: "Combine services into one project. We will clarify dependencies, stages and the final estimate.", empty: "Your cart is empty", emptyText: "Choose services from the catalogue or estimate a custom project.", catalogue: "Browse services", estimate: "Estimate a project", total: "Preliminary budget", clear: "Clear", remove: "Remove", checkout: "Save project", login: "Sign in to save the order and track its stages.", account: "Sign in or register", success: "Project saved. The team will contact you to clarify the scope.", open: "Open account", note: "No payment is taken now. The final price is confirmed after discovery.", error: "Could not save the project. Please try again." },
  ka: { eyebrow: "თქვენი პროექტი", title: "სერვისების კალათა", text: "გააერთიანეთ სერვისები ერთ პროექტში. გუნდი დააზუსტებს ეტაპებსა და საბოლოო ბიუჯეტს.", empty: "კალათა ცარიელია", emptyText: "აირჩიეთ სერვისები ან გამოთვალეთ ინდივიდუალური პროექტი.", catalogue: "სერვისებზე გადასვლა", estimate: "პროექტის შეფასება", total: "წინასწარი ბიუჯეტი", clear: "გასუფთავება", remove: "წაშლა", checkout: "პროექტის შენახვა", login: "შედით პროექტის შესანახად და ეტაპების სანახავად.", account: "შესვლა ან რეგისტრაცია", success: "პროექტი შენახულია. გუნდი დაგიკავშირდებათ.", open: "პირადი კაბინეტი", note: "გადახდა ახლა არ ხდება. საბოლოო ფასი დიაგნოსტიკის შემდეგ ფიქსირდება.", error: "პროექტი ვერ შეინახა." },
  hy: { eyebrow: "Ձեր նախագիծը", title: "Ծառայությունների զամբյուղ", text: "Միավորեք ծառայությունները մեկ նախագծում։ Թիմը կհստակեցնի փուլերն ու վերջնական բյուջեն։", empty: "Զամբյուղը դատարկ է", emptyText: "Ընտրեք ծառայություններ կամ հաշվարկեք անհատական նախագիծ։", catalogue: "Դիտել ծառայությունները", estimate: "Հաշվել նախագիծը", total: "Նախնական բյուջե", clear: "Մաքրել", remove: "Հեռացնել", checkout: "Պահպանել նախագիծը", login: "Մուտք գործեք՝ նախագիծը պահպանելու և փուլերը հետևելու համար։", account: "Մուտք կամ գրանցում", success: "Նախագիծը պահպանված է։ Թիմը կկապվի ձեզ հետ։", open: "Անձնական հաշիվ", note: "Այժմ վճարում չի կատարվում։ Վերջնական գինը հաստատվում է ախտորոշումից հետո։", error: "Չհաջողվեց պահպանել նախագիծը։" },
  bg: { eyebrow: "Вашият проект", title: "Количка с услуги", text: "Обединете услугите в един проект. Екипът ще уточни етапите и крайната сметка.", empty: "Количката е празна", emptyText: "Изберете услуги или изчислете индивидуален проект.", catalogue: "Към услугите", estimate: "Изчисли проект", total: "Предварителен бюджет", clear: "Изчисти", remove: "Премахни", checkout: "Запази проекта", login: "Влезте, за да запазите проекта и да следите етапите.", account: "Вход или регистрация", success: "Проектът е запазен. Екипът ще се свърже с вас.", open: "Личен профил", note: "Сега не се извършва плащане. Крайната цена се потвърждава след диагностика.", error: "Проектът не беше запазен." },
} as const;

function formatPrice(price: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);
}

export function ServiceCart({ services, locale }: { services: readonly CatalogService[]; locale: Locale }) {
  const t = copy[locale];
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "login" | "sent" | "error">("idle");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setSelected(saved.filter((id): id is string => typeof id === "string"));
    } catch { window.localStorage.removeItem(STORAGE_KEY); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    window.dispatchEvent(new Event("agile-cart-change"));
  }, [ready, selected]);

  const chosen = useMemo(() => services.filter((service) => selected.includes(service.id)), [selected, services]);
  const total = useMemo(() => chosen.reduce((sum, service) => sum + service.price, 0), [chosen]);
  const remove = (id: string) => { setSelected((current) => current.filter((item) => item !== id)); setStatus("idle"); };

  const checkout = async () => {
    if (!selected.length || status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ serviceIds: selected, locale }) });
      if (response.status === 401) { setStatus("login"); return; }
      if (!response.ok) throw new Error("order failed");
      setSelected([]); setStatus("sent");
    } catch { setStatus("error"); }
  };

  return <main className="cart-page shell">
    <header className="cart-page-head"><span>{t.eyebrow}</span><h1>{t.title}</h1><p>{t.text}</p></header>
    {!ready ? <div className="cart-loading" /> : chosen.length ? <div className="cart-layout">
      <section className="cart-items">{chosen.map((service, index) => <article key={service.id}><span>0{index + 1}</span><div><h2>{service.title}</h2><ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><strong>{formatPrice(service.price, locale)}</strong><button type="button" onClick={() => remove(service.id)} aria-label={`${t.remove}: ${service.title}`}>×</button></article>)}</section>
      <aside className="cart-summary"><header><span>{t.total}</span><strong>{formatPrice(total, locale)}</strong></header>{status === "login" ? <div className="cart-status"><p>{t.login}</p><Link className="button" href={`/${locale}/account?returnTo=/${locale}/cart`}>{t.account}</Link></div> : null}{status === "sent" ? <div className="cart-status success"><p>{t.success}</p><Link className="button" href={`/${locale}/account`}>{t.open}</Link></div> : null}{status === "error" ? <p className="cart-error">{t.error}</p> : null}{status !== "sent" ? <button className="button" type="button" disabled={status === "sending"} onClick={checkout}>{t.checkout}<span>↗</span></button> : null}<button className="cart-clear" type="button" onClick={() => setSelected([])}>{t.clear}</button><small>{t.note}</small></aside>
    </div> : <section className="cart-empty"><span>0</span><h2>{t.empty}</h2><p>{t.emptyText}</p><div><Link className="button" href={`/${locale}/services`}>{t.catalogue}</Link><Link className="text-link" href={`/${locale}/calculator`}>{t.estimate}<span>↗</span></Link></div></section>}
  </main>;
}
