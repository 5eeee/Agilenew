"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { CatalogService } from "@/lib/service-catalog";

const STORAGE_KEY = "agile-service-cart-v1";

const labels = {
  ru: { from: "от", free: "Бесплатно", consult: "Записаться", calculate: "Рассчитать", details: "Подробнее", scope: "Что входит", collapse: "Свернуть", add: "Добавить", added: "В корзине", popular: "Оптимальный старт", cart: "Состав проекта", empty: "Добавьте услуги — мы соберём их в один проект.", total: "Предварительно", checkout: "Сохранить проект", login: "Войдите в личный кабинет, чтобы сохранить заказ и отслеживать статусы.", account: "Войти или зарегистрироваться", sent: "Заказ создан. Команда уточнит состав и зафиксирует смету.", open: "Открыть заказ", note: "Финальная стоимость фиксируется после интервью. Платёж сейчас не списывается.", clear: "Очистить" },
  en: { from: "from", free: "Free", consult: "Book a call", calculate: "Estimate", details: "Details", scope: "Included", collapse: "Collapse", add: "Add", added: "In cart", popular: "Recommended start", cart: "Project scope", empty: "Add services and we will combine them into one project.", total: "Preliminary", checkout: "Save project", login: "Sign in to save the order and track its stages.", account: "Sign in or register", sent: "Order created. The team will clarify the scope and confirm the estimate.", open: "Open order", note: "The final price is confirmed after discovery. No payment is taken now.", clear: "Clear" },
  pl: { from: "od", free: "Bezpłatnie", consult: "Umów rozmowę", calculate: "Wyceń", details: "Szczegóły", scope: "Zakres", collapse: "Zwiń", add: "Dodaj", added: "W koszyku", popular: "Rekomendowany start", cart: "Zakres projektu", empty: "Dodaj usługi, a połączymy je w jeden spójny projekt.", total: "Wstępnie", checkout: "Zapisz projekt", login: "Zaloguj się, aby zapisać zamówienie i śledzić jego etapy.", account: "Zaloguj się lub zarejestruj", sent: "Zamówienie zostało utworzone. Zespół doprecyzuje zakres i potwierdzi wycenę.", open: "Otwórz zamówienie", note: "Ostateczną cenę potwierdzamy po diagnozie. Na tym etapie nie pobieramy płatności.", clear: "Wyczyść" },
  ka: { from: "დან", free: "უფასო", consult: "ჩაწერა", calculate: "გამოთვლა", details: "დეტალურად", scope: "რა შედის", collapse: "დახურვა", add: "დამატება", added: "კალათაშია", popular: "რეკომენდებული დასაწყისი", cart: "პროექტის შემადგენლობა", empty: "დაამატეთ სერვისები და ერთ პროექტად გავაერთიანებთ.", total: "წინასწარი", checkout: "პროექტის შენახვა", login: "შედით ანგარიშში შეკვეთის შესანახად და სტატუსების სანახავად.", account: "შესვლა ან რეგისტრაცია", sent: "შეკვეთა შეიქმნა. გუნდი დააზუსტებს მოცულობას და ბიუჯეტს.", open: "შეკვეთის გახსნა", note: "საბოლოო ფასი ფიქსირდება ინტერვიუს შემდეგ. გადახდა ახლა არ ხდება.", clear: "გასუფთავება" },
  hy: { from: "սկսած", free: "Անվճար", consult: "Գրանցվել", calculate: "Հաշվել", details: "Մանրամասն", scope: "Ինչ է ներառված", collapse: "Փակել", add: "Ավելացնել", added: "Զամբյուղում", popular: "Առաջարկվող մեկնարկ", cart: "Նախագծի կազմ", empty: "Ավելացրեք ծառայությունները, և մենք կմիավորենք դրանք մեկ նախագծում։", total: "Նախնական", checkout: "Պահպանել նախագիծը", login: "Մուտք գործեք՝ պատվերը պահպանելու և փուլերը տեսնելու համար։", account: "Մուտք կամ գրանցում", sent: "Պատվերը ստեղծված է։ Թիմը կհստակեցնի ծավալն ու նախահաշիվը։", open: "Բացել պատվերը", note: "Վերջնական գինը հաստատվում է հարցազրույցից հետո։ Այժմ վճարում չի կատարվում։", clear: "Մաքրել" },
  bg: { from: "от", free: "Безплатно", consult: "Запази час", calculate: "Изчисли", details: "Подробности", scope: "Какво включва", collapse: "Затвори", add: "Добави", added: "В количката", popular: "Препоръчителен старт", cart: "Обхват на проекта", empty: "Добавете услуги и ще ги обединим в един проект.", total: "Предварително", checkout: "Запази проекта", login: "Влезте, за да запазите поръчката и да следите етапите.", account: "Вход или регистрация", sent: "Поръчката е създадена. Екипът ще уточни обхвата и бюджета.", open: "Отвори поръчката", note: "Крайната цена се потвърждава след интервю. Сега не се извършва плащане.", clear: "Изчисти" },
} as const;

const SERVICE_GLYPH_KINDS: Record<string, number> = {
  consultation: 0, "custom-project": 1, "business-card": 2, landing: 19,
  corporate: 4, ecommerce: 5, "crm-mvp": 6, "bi-dashboard": 7,
  "business-audit": 8, "growth-strategy": 9, "it-audit": 10,
  "it-strategy": 21, "digital-transformation": 11, "corporate-site": 4,
  "ecommerce-platform": 5, "saas-platform": 12, "web-support": 13,
  "cross-platform-app": 14, "crm-erp": 6, "data-analysis": 7,
  "ai-services": 22, "ai-business-integration": 20, "api-integrations": 16, pentest: 17, "security-audit": 18,
};

function ServiceGlyph({ id }: { id: string }) {
  const kind = SERVICE_GLYPH_KINDS[id] ?? 1;
  return <svg className="service-glyph" viewBox="0 0 160 110" aria-hidden="true">
    <rect x="1" y="1" width="158" height="108" rx="20" />
    {kind === 0 ? <><path d="M39 70c0-25 18-43 41-43s41 18 41 43"/><circle cx="80" cy="47" r="12"/><path d="M30 76h100"/></> : null}
    {kind === 1 ? <><path d="M31 31h43v28H31zM86 31h43v18H86zM31 70h25v12H31zM68 65h61v17H68z"/><path className="accent" d="M74 45h12M49 59v11M99 49v16"/></> : null}
    {kind === 2 ? <><path d="M27 28h106v59H27zM27 42h106"/><circle cx="36" cy="35" r="2"/><circle cx="44" cy="35" r="2"/><path className="accent" d="M42 58h47M42 67h67M42 76h34"/></> : null}
    {kind === 3 ? <><path d="M31 35h15l9 40h52l13-31H51M64 86a5 5 0 1 0 0 .1M101 86a5 5 0 1 0 0 .1"/><path className="accent" d="M62 54h47M67 64h37"/></> : null}
    {kind === 4 ? <><rect x="28" y="25" width="104" height="62" rx="10"/><path d="M42 43h29M42 53h20M42 70h28M82 40h35M82 50h35M82 60h35M82 70h25"/><circle className="accent" cx="70" cy="70" r="7"/></> : null}
    {kind === 5 ? <><path d="M30 49h100v39H30zM37 32h86l8 17H29zM38 49v10c0 6 10 6 10 0V49m0 0v10c0 6 10 6 10 0V49m0 0v10c0 6 10 6 10 0V49m0 0v10c0 6 10 6 10 0V49m0 0v10c0 6 10 6 10 0V49m0 0v10c0 6 10 6 10 0V49m0 0v10c0 6 10 6 10 0V49m0 0v10c0 6 10 6 10 0V49"/><path d="M46 88V69h27v19M87 70h28v12H87z"/><path className="accent" d="M42 40h76M94 76h14"/></> : null}
    {kind === 6 ? <><circle cx="80" cy="55" r="31"/><circle cx="80" cy="55" r="18"/><path d="M80 16v16M80 78v16M41 55h16M103 55h16"/><path className="accent" d="M80 55l23-18"/></> : null}
    {kind === 7 ? <><path d="M28 82V29h104v53zM28 45h104M52 45v37M103 45v37"/><path d="M38 65h7M62 57h31M62 68h23M112 58h10M112 69h10"/><path className="accent" d="M62 76l10-8 9 4 12-16"/></> : null}
    {kind === 8 ? <><circle cx="44" cy="39" r="9"/><circle cx="116" cy="39" r="9"/><circle cx="80" cy="78" r="9"/><path d="M53 39h54M49 47l24 25M111 47 87 72"/><path className="accent" d="m70 35 10 4-10 4M72 67l8 11 8-11"/></> : null}
    {kind === 9 ? <><path d="M28 76c18-30 33-15 48-37s30-14 56-19"/><circle cx="30" cy="75" r="7"/><circle cx="77" cy="38" r="7"/><circle cx="130" cy="20" r="7"/><path d="M35 87h91"/><path className="accent" d="m111 18 19 2-7 18"/></> : null}
    {kind === 10 ? <><rect x="27" y="27" width="84" height="55" rx="8"/><path d="M39 39h59M39 50h42M39 61h31M20 88h98"/><circle cx="116" cy="65" r="18"/><path d="m129 78 11 11"/><path className="accent" d="m108 65 6 6 11-14"/></> : null}
    {kind === 11 ? <><circle cx="36" cy="55" r="12"/><circle cx="80" cy="28" r="12"/><circle cx="124" cy="55" r="12"/><circle cx="80" cy="82" r="12"/><path d="M47 49 69 34M91 34l22 15M113 61 91 76M69 76 47 61"/><path className="accent" d="M55 55h49m-10-9 10 9-10 9"/></> : null}
    {kind === 12 ? <><path d="M49 78H37c-12 0-18-9-14-19 3-7 9-10 16-10 1-17 14-27 29-24 10 2 17 9 20 18 14-5 29 5 29 19 0 9-7 16-16 16H49z"/><rect x="48" y="54" width="66" height="34" rx="7"/><path d="M48 64h66M60 74h19M60 81h36"/><circle className="accent" cx="104" cy="74" r="4"/></> : null}
    {kind === 13 ? <><rect x="31" y="27" width="98" height="60" rx="9"/><path d="M31 42h98M43 35h2M51 35h2"/><path d="M56 69a25 25 0 0 1 42-18M104 51v-14m0 14H90M104 56a25 25 0 0 1-42 18M56 74v14m0-14h14"/><path className="accent" d="M74 63h12M80 57v12"/></> : null}
    {kind === 14 ? <><rect x="55" y="17" width="50" height="76" rx="12"/><path d="M69 27h22M73 83h14M32 43h14m-7-7-7 7 7 7M128 67h-14m7-7 7 7-7 7"/><rect x="65" y="36" width="30" height="37" rx="5"/><path className="accent" d="M72 54h16M80 46v16"/></> : null}
    {kind === 15 ? <><rect x="48" y="24" width="64" height="64" rx="13"/><path d="M58 13v11M73 13v11M88 13v11M103 13v11M58 88v11M73 88v11M88 88v11M103 88v11M37 35h11M37 51h11M37 67h11M37 82h11M112 35h11M112 51h11M112 67h11M112 82h11"/><circle cx="70" cy="48" r="7"/><circle cx="91" cy="64" r="7"/><path d="m75 53 11 7"/><path className="accent" d="M69 70c7-4 15-4 23 0"/></> : null}
    {kind === 16 ? <><rect x="22" y="30" width="42" height="50" rx="8"/><rect x="96" y="30" width="42" height="50" rx="8"/><path d="M34 43h18M34 52h12M108 58h18M108 67h12M64 45h24m-8-8 8 8-8 8M96 66H72m8-8-8 8 8 8"/><path className="accent" d="M77 28h6M77 82h6"/></> : null}
    {kind === 17 ? <><path d="M80 18 121 33v25c0 25-16 39-41 49-25-10-41-24-41-49V33z"/><circle cx="80" cy="58" r="19"/><circle cx="80" cy="58" r="8"/><path d="M80 30v15M80 71v15M52 58h15M93 58h15"/><path className="accent" d="m74 58 5 5 10-12"/></> : null}
    {kind === 18 ? <><path d="M55 20h50v14h16v55H39V34h16zM55 34h50V20H55z"/><path d="M54 50h38M54 61h31M54 72h25"/><circle cx="107" cy="73" r="14"/><path d="m117 83 10 10"/><path className="accent" d="m101 73 4 4 8-10"/></> : null}
    {kind === 19 ? <><rect x="25" y="24" width="110" height="66" rx="10"/><path d="M25 39h110M37 31h2M45 31h2"/><path d="M39 53h49M39 62h34M39 71h24"/><rect x="99" y="51" width="23" height="25" rx="5"/><path className="accent" d="M39 81h43M105 58h11M105 65h8"/></> : null}
    {kind === 20 ? <><rect x="27" y="21" width="36" height="24" rx="7"/><rect x="27" y="69" width="36" height="24" rx="7"/><rect x="101" y="21" width="32" height="24" rx="7"/><rect x="101" y="69" width="32" height="24" rx="7"/><circle cx="81" cy="57" r="20"/><circle cx="74" cy="52" r="3.5"/><circle cx="88" cy="52" r="3.5"/><path d="M72 65h18M63 33h18v4M63 81h18v-4M101 33H81v4M101 81H81v-4"/><path className="accent" d="M68 57h7l4 7 7-15 5 8h7"/></> : null}
    {kind === 21 ? <><rect x="29" y="18" width="102" height="78" rx="13"/><path d="M44 34h37M44 49h20M44 64h18M44 79h22"/><circle cx="79" cy="76" r="5"/><circle cx="99" cy="57" r="5"/><circle cx="117" cy="36" r="5"/><path className="accent" d="m79 76 20-19 18-21m-10 1 10-1-1 10"/></> : null}
    {kind === 22 ? <><rect x="44" y="20" width="72" height="72" rx="14"/><path d="M60 20v-9M80 20v-9M100 20v-9M60 92v9M80 92v9M100 92v9M44 38h-10M44 57h-10M44 76h-10M116 38h10M116 57h10M116 76h10"/><circle cx="64" cy="57" r="6"/><circle cx="80" cy="39" r="6"/><circle cx="98" cy="55" r="6"/><circle cx="81" cy="75" r="6"/><path d="m68 53 8-10m10 0 8 8m0 10-9 10M76 72 67 62"/><path className="accent" d="M70 58h22"/></> : null}
  </svg>;
}

function formatPrice(price: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : locale === "pl" ? "pl-PL" : locale === "hy" ? "hy-AM" : locale === "ka" ? "ka-GE" : locale === "bg" ? "bg-BG" : "en-US", {
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
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
        if (Array.isArray(saved)) setSelected(saved.filter((id): id is string => typeof id === "string"));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setReady(true);
    });
    return () => { cancelled = true; };
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
              {service.tiers ? <div className="service-price-tiers" aria-label={locale === "ru" ? "Цены по сложности проекта" : locale === "pl" ? "Ceny według złożoności projektu" : "Prices by project complexity"}>
                {service.tiers.map((tier) => <div key={tier.label}><span>{tier.label}</span><strong>{tier.price}</strong></div>)}
              </div> : null}
              <div className="service-commerce-meta"><span>{service.duration}</span><strong>{service.consultation ? copy.free : service.priceLabel ?? `${copy.from} ${formatPrice(service.price, locale)}`}</strong></div>
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
