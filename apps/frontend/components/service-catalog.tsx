"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { CatalogService } from "@/lib/service-catalog";

const STORAGE_KEY = "agile-service-cart-v1";

const labels = {
  ru: { from: "от", add: "Добавить", added: "В корзине", popular: "Оптимальный старт", cart: "Состав проекта", empty: "Добавьте услуги — мы соберём их в один проект.", total: "Предварительно", checkout: "Отправить на консультацию", login: "Войдите в личный кабинет, чтобы сохранить заказ и отслеживать статусы.", account: "Войти или зарегистрироваться", sent: "Заказ создан. Команда уточнит состав и зафиксирует смету.", open: "Открыть заказ", note: "Финальная стоимость фиксируется после интервью. Платёж сейчас не списывается.", clear: "Очистить" },
  en: { from: "from", add: "Add", added: "In cart", popular: "Recommended start", cart: "Project scope", empty: "Add services and we will combine them into one project.", total: "Preliminary", checkout: "Request a consultation", login: "Sign in to save the order and track its stages.", account: "Sign in or register", sent: "Order created. The team will clarify the scope and confirm the estimate.", open: "Open order", note: "The final price is confirmed after discovery. No payment is taken now.", clear: "Clear" },
  ka: { from: "დან", add: "დამატება", added: "კალათაშია", popular: "რეკომენდებული დასაწყისი", cart: "პროექტის შემადგენლობა", empty: "დაამატეთ სერვისები და ერთ პროექტად გავაერთიანებთ.", total: "წინასწარი", checkout: "კონსულტაციის მოთხოვნა", login: "შედით ანგარიშში შეკვეთის შესანახად და სტატუსების სანახავად.", account: "შესვლა ან რეგისტრაცია", sent: "შეკვეთა შეიქმნა. გუნდი დააზუსტებს მოცულობას და ბიუჯეტს.", open: "შეკვეთის გახსნა", note: "საბოლოო ფასი ფიქსირდება ინტერვიუს შემდეგ. გადახდა ახლა არ ხდება.", clear: "გასუფთავება" },
  hy: { from: "սկսած", add: "Ավելացնել", added: "Զամբյուղում", popular: "Առաջարկվող մեկնարկ", cart: "Նախագծի կազմ", empty: "Ավելացրեք ծառայությունները, և մենք կմիավորենք դրանք մեկ նախագծում։", total: "Նախնական", checkout: "Ուղարկել խորհրդատվության", login: "Մուտք գործեք՝ պատվերը պահպանելու և փուլերը տեսնելու համար։", account: "Մուտք կամ գրանցում", sent: "Պատվերը ստեղծված է։ Թիմը կհստակեցնի ծավալն ու նախահաշիվը։", open: "Բացել պատվերը", note: "Վերջնական գինը հաստատվում է հարցազրույցից հետո։ Այժմ վճարում չի կատարվում։", clear: "Մաքրել" },
  bg: { from: "от", add: "Добави", added: "В количката", popular: "Препоръчителен старт", cart: "Обхват на проекта", empty: "Добавете услуги и ще ги обединим в един проект.", total: "Предварително", checkout: "Заяви консултация", login: "Влезте, за да запазите поръчката и да следите етапите.", account: "Вход или регистрация", sent: "Поръчката е създадена. Екипът ще уточни обхвата и бюджета.", open: "Отвори поръчката", note: "Крайната цена се потвърждава след интервю. Сега не се извършва плащане.", clear: "Изчисти" },
} as const;

function formatPrice(price: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "hy" ? "hy-AM" : locale === "ka" ? "ka-GE" : locale === "bg" ? "bg-BG" : "en-US", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

export function ServiceCatalog({ services, locale }: { services: readonly CatalogService[]; locale: Locale }) {
  const copy = labels[locale];
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "login" | "sent" | "error">("idle");

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setSelected(saved.filter((id): id is string => typeof id === "string"));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  }, [ready, selected]);

  const chosen = useMemo(() => services.filter((service) => selected.includes(service.id)), [selected, services]);
  const total = useMemo(() => chosen.reduce((sum, service) => sum + service.price, 0), [chosen]);

  const toggle = (id: string) => {
    setStatus("idle");
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const checkout = async () => {
    if (!selected.length || status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ serviceIds: selected, locale }),
      });
      if (response.status === 401) {
        setStatus("login");
        return;
      }
      if (!response.ok) throw new Error("order failed");
      setSelected([]);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="service-commerce">
      <div className="service-catalog-grid">
        {services.map((service, index) => {
          const isSelected = selected.includes(service.id);
          return (
            <article className={`service-commerce-card ${isSelected ? "selected" : ""}`} id={String(index + 1).padStart(2, "0")} key={service.id}>
              <div className="service-commerce-card-head"><span>{String(index + 1).padStart(2, "0")} / {service.category}</span>{service.recommended ? <i>{copy.popular}</i> : null}</div>
              <h2>{service.title}</h2>
              <p>{service.summary}</p>
              <ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <div className="service-commerce-meta"><span>{service.duration}</span><strong>{copy.from} {formatPrice(service.price, locale)}</strong></div>
              <button type="button" aria-pressed={isSelected} onClick={() => toggle(service.id)}><span>{isSelected ? copy.added : copy.add}</span><i>{isSelected ? "✓" : "+"}</i></button>
            </article>
          );
        })}
      </div>

      <aside className={`service-cart ${selected.length || status !== "idle" ? "visible" : ""}`} aria-live="polite">
        <header><div><span>{copy.cart}</span><strong>{selected.length}</strong></div>{selected.length ? <button type="button" onClick={() => setSelected([])}>{copy.clear}</button> : null}</header>
        {chosen.length ? <ul>{chosen.map((service) => <li key={service.id}><span>{service.title}</span><strong>{formatPrice(service.price, locale)}</strong><button type="button" onClick={() => toggle(service.id)} aria-label={`Remove ${service.title}`}>×</button></li>)}</ul> : <p>{copy.empty}</p>}
        {chosen.length ? <div className="service-cart-total"><span>{copy.total}</span><strong>{formatPrice(total, locale)}</strong></div> : null}
        {status === "login" ? <div className="service-cart-message"><p>{copy.login}</p><Link className="button" href={`/${locale}/account?returnTo=/${locale}/services`}>{copy.account}</Link></div> : null}
        {status === "sent" ? <div className="service-cart-message success"><p>{copy.sent}</p><Link className="button" href={`/${locale}/account`}>{copy.open}</Link></div> : null}
        {status === "error" ? <p className="service-cart-error">Something went wrong. Please try again.</p> : null}
        {status !== "sent" ? <button className="button service-cart-checkout" type="button" disabled={!selected.length || status === "sending"} onClick={checkout}>{copy.checkout}<span>↗</span></button> : null}
        <small>{copy.note}</small>
      </aside>
    </div>
  );
}
