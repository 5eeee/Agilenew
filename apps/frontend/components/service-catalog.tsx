"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { CatalogService } from "@/lib/service-catalog";

const STORAGE_KEY = "agile-service-cart-v1";

const labels = {
  ru: { from: "от", free: "Бесплатно", consult: "Записаться", calculate: "Рассчитать", details: "Подробнее", scope: "Что входит", collapse: "Свернуть", add: "Добавить", added: "В корзине", popular: "Оптимальный старт", cart: "Состав проекта", empty: "Добавьте услуги — мы соберём их в один проект.", total: "Предварительно", checkout: "Сохранить проект", login: "Войдите в личный кабинет, чтобы сохранить заказ и отслеживать статусы.", account: "Войти или зарегистрироваться", sent: "Заказ создан. Команда уточнит состав и зафиксирует смету.", open: "Открыть заказ", note: "Финальная стоимость фиксируется после интервью. Платёж сейчас не списывается.", clear: "Очистить" },
  en: { from: "from", free: "Free", consult: "Book a call", calculate: "Estimate", details: "Details", scope: "Included", collapse: "Collapse", add: "Add", added: "In cart", popular: "Recommended start", cart: "Project scope", empty: "Add services and we will combine them into one project.", total: "Preliminary", checkout: "Save project", login: "Sign in to save the order and track its stages.", account: "Sign in or register", sent: "Order created. The team will clarify the scope and confirm the estimate.", open: "Open order", note: "The final price is confirmed after discovery. No payment is taken now.", clear: "Clear" },
  ka: { from: "დან", free: "უფასო", consult: "ჩაწერა", calculate: "გამოთვლა", details: "დეტალურად", scope: "რა შედის", collapse: "დახურვა", add: "დამატება", added: "კალათაშია", popular: "რეკომენდებული დასაწყისი", cart: "პროექტის შემადგენლობა", empty: "დაამატეთ სერვისები და ერთ პროექტად გავაერთიანებთ.", total: "წინასწარი", checkout: "პროექტის შენახვა", login: "შედით ანგარიშში შეკვეთის შესანახად და სტატუსების სანახავად.", account: "შესვლა ან რეგისტრაცია", sent: "შეკვეთა შეიქმნა. გუნდი დააზუსტებს მოცულობას და ბიუჯეტს.", open: "შეკვეთის გახსნა", note: "საბოლოო ფასი ფიქსირდება ინტერვიუს შემდეგ. გადახდა ახლა არ ხდება.", clear: "გასუფთავება" },
  hy: { from: "սկսած", free: "Անվճար", consult: "Գրանցվել", calculate: "Հաշվել", details: "Մանրամասն", scope: "Ինչ է ներառված", collapse: "Փակել", add: "Ավելացնել", added: "Զամբյուղում", popular: "Առաջարկվող մեկնարկ", cart: "Նախագծի կազմ", empty: "Ավելացրեք ծառայությունները, և մենք կմիավորենք դրանք մեկ նախագծում։", total: "Նախնական", checkout: "Պահպանել նախագիծը", login: "Մուտք գործեք՝ պատվերը պահպանելու և փուլերը տեսնելու համար։", account: "Մուտք կամ գրանցում", sent: "Պատվերը ստեղծված է։ Թիմը կհստակեցնի ծավալն ու նախահաշիվը։", open: "Բացել պատվերը", note: "Վերջնական գինը հաստատվում է հարցազրույցից հետո։ Այժմ վճարում չի կատարվում։", clear: "Մաքրել" },
  bg: { from: "от", free: "Безплатно", consult: "Запази час", calculate: "Изчисли", details: "Подробности", scope: "Какво включва", collapse: "Затвори", add: "Добави", added: "В количката", popular: "Препоръчителен старт", cart: "Обхват на проекта", empty: "Добавете услуги и ще ги обединим в един проект.", total: "Предварително", checkout: "Запази проекта", login: "Влезте, за да запазите поръчката и да следите етапите.", account: "Вход или регистрация", sent: "Поръчката е създадена. Екипът ще уточни обхвата и бюджета.", open: "Отвори поръчката", note: "Крайната цена се потвърждава след интервю. Сега не се извършва плащане.", clear: "Изчисти" },
} as const;

function ServiceGlyph({ id }: { id: string }) {
  const kind = id === "consultation" ? 0 : id === "custom-project" ? 1 : id.includes("site") || id === "landing" || id === "corporate" || id === "business-card" ? 2 : id === "ecommerce" ? 3 : id.includes("crm") ? 4 : id.includes("bi") ? 5 : 6;
  return <svg className="service-glyph" viewBox="0 0 160 110" aria-hidden="true">
    <rect x="1" y="1" width="158" height="108" rx="20" />
    {kind === 0 ? <><path d="M39 70c0-25 18-43 41-43s41 18 41 43"/><circle cx="80" cy="47" r="12"/><path d="M30 76h100"/></> : null}
    {kind === 1 ? <><path d="M31 31h43v28H31zM86 31h43v18H86zM31 70h25v12H31zM68 65h61v17H68z"/><path className="accent" d="M74 45h12M49 59v11M99 49v16"/></> : null}
    {kind === 2 ? <><path d="M27 28h106v59H27zM27 42h106"/><circle cx="36" cy="35" r="2"/><circle cx="44" cy="35" r="2"/><path className="accent" d="M42 58h47M42 67h67M42 76h34"/></> : null}
    {kind === 3 ? <><path d="M35 40h12l8 34h51l10-25H52M63 84a5 5 0 1 0 0 .1M101 84a5 5 0 1 0 0 .1"/><path className="accent" d="M71 32v27M61 42h20"/></> : null}
    {kind === 4 ? <><rect x="28" y="25" width="104" height="62" rx="10"/><path d="M42 43h29M42 53h20M42 70h28M82 40h35M82 50h35M82 60h35M82 70h25"/><circle className="accent" cx="70" cy="70" r="7"/></> : null}
    {kind === 5 ? <><path d="M32 83V55h18v28M61 83V37h18v46M90 83V48h18v35M119 83V25h9v58"/><path className="accent" d="M27 30c25 11 42 6 58-3s29-7 45-17"/></> : null}
    {kind === 6 ? <><circle cx="80" cy="55" r="31"/><circle cx="80" cy="55" r="18"/><path d="M80 16v16M80 78v16M41 55h16M103 55h16"/><path className="accent" d="M80 55l23-18"/></> : null}
  </svg>;
}

function formatPrice(price: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "hy" ? "hy-AM" : locale === "ka" ? "ka-GE" : locale === "bg" ? "bg-BG" : "en-US", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(price);
}

function SelectionIcon({ selected }: { selected: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{selected ? <path d="m6.5 12.5 3.4 3.4 7.6-8" /> : <><path d="M12 6v12" /><path d="M6 12h12" /></>}</svg>;
}

export function ServiceCatalog({ services, locale }: { services: readonly CatalogService[]; locale: Locale }) {
  const copy = labels[locale];
  const [selected, setSelected] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

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
    if (ready) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      window.dispatchEvent(new Event("agile-cart-change"));
    }
  }, [ready, selected]);

  const toggle = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <div className="service-commerce service-commerce-catalog-only">
      <div className="service-catalog-grid">
        {services.map((service) => {
          const isSelected = selected.includes(service.id);
          return (
            <article className={`service-commerce-card ${isSelected ? "selected" : ""} ${service.consultation ? "consultation" : ""}`} id={service.id === "business-audit" ? "01" : service.id === "crm-mvp" ? "02" : service.id === "growth-strategy" ? "03" : service.id} key={service.id}>
              <ServiceGlyph id={service.id} />
              <h2><Link href={`/${locale}/services/${service.id}`}>{service.title}</Link></h2>
              <ul className="service-scope">{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              <div className="service-commerce-meta"><span>{service.duration}</span><strong>{service.consultation ? copy.free : `${copy.from} ${formatPrice(service.price, locale)}`}</strong></div>
              {service.consultation
                ? <Link href={`/${locale}/contacts`}><span>{copy.consult}</span><i>↗</i></Link>
                : service.custom
                  ? <Link href={`/${locale}/calculator`}><span>{copy.calculate}</span><i>↗</i></Link>
                : <button type="button" aria-pressed={isSelected} onClick={() => toggle(service.id)}><span>{isSelected ? copy.added : copy.add}</span><i><SelectionIcon selected={isSelected} /></i></button>}
              <Link className="service-detail-link" href={`/${locale}/services/${service.id}`}>{copy.details}<span>→</span></Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
