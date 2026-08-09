"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type LegacyLabels = { back: string; calculate: string; result: string; disclaimer: string; options: Record<string, string> };
type Values = { type?: string; outcome?: string; scale?: string; timeline?: string; task?: string };

const copy = {
  ru: { title: "Соберите индивидуальный проект", intro: "Ответьте на несколько вопросов — получите реалистичный диапазон бюджета и передайте нам уже структурированную задачу.", steps: ["Тип решения", "Бизнес-результат", "Масштаб", "Функции", "Срок запуска", "Контекст задачи"], questions: ["Что нужно создать?", "Что должно измениться после запуска?", "Какой объём нужен на первом этапе?", "Какие функции обязательны?", "Когда нужен первый рабочий релиз?", "Расскажите детали, которые важно учесть"], options: { website: "Сайт или веб-сервис", crm: "CRM / личный кабинет", automation: "Автоматизация процессов", analytics: "BI и аналитика", custom: "Нестандартная система", leads: "Больше заявок", sales: "Рост продаж", speed: "Быстрее процессы", control: "Прозрачное управление", launch: "Запуск нового продукта", starter: "MVP — только основное", growth: "Рабочая система для роста", scale: "Большая платформа", design: "Уникальный дизайн", integrations: "Интеграции и API", account: "Личный кабинет", payments: "Оплата и корзина", dashboard: "Дашборды", multilingual: "Несколько языков", calm: "Срок гибкий", standard: "2–3 месяца", urgent: "Нужен ускоренный запуск" }, multi: "Можно выбрать несколько", continue: "Продолжить", placeholder: "Например: кто будет пользоваться системой, какие процессы уже существуют, с чем нужна интеграция…", estimate: "Предварительный диапазон", contact: "Куда отправить разбор", name: "Ваше имя", email: "Рабочая почта", phone: "Телефон", send: "Отправить расчёт", sending: "Отправляем…", success: "Расчёт отправлен. Свяжемся с уточняющими вопросами в течение рабочего дня.", error: "Не удалось отправить. Проверьте поля или напишите нам напрямую.", note: "Это ориентир, а не публичная оферта. После короткой диагностики мы зафиксируем состав, этапы и смету." },
  en: { title: "Build your custom project", intro: "Answer a few questions to get a realistic budget range and send us a structured brief.", steps: ["Solution", "Outcome", "Scale", "Features", "Timeline", "Context"], questions: ["What should we build?", "What should change after launch?", "What is the first-release scale?", "Which functions are essential?", "When is the first working release needed?", "Share the important context"], options: { website: "Website or web service", crm: "CRM / client portal", automation: "Process automation", analytics: "BI and analytics", custom: "Custom system", leads: "More leads", sales: "Sales growth", speed: "Faster operations", control: "Management visibility", launch: "New product launch", starter: "MVP — essentials only", growth: "Growth-ready system", scale: "Large platform", design: "Custom design", integrations: "Integrations and API", account: "Client account", payments: "Payments and cart", dashboard: "Dashboards", multilingual: "Multilingual", calm: "Flexible", standard: "2–3 months", urgent: "Accelerated launch" }, multi: "Select several", continue: "Continue", placeholder: "Who will use it, what processes already exist and what should be integrated?", estimate: "Estimated range", contact: "Where to send the review", name: "Your name", email: "Work email", phone: "Phone", send: "Send estimate", sending: "Sending…", success: "Estimate sent. We will follow up within one business day.", error: "Could not send. Check the fields or contact us directly.", note: "This is an estimate, not a public offer. Scope, stages and budget are confirmed after discovery." },
  ka: { title: "შეადგინეთ ინდივიდუალური პროექტი", intro: "უპასუხეთ რამდენიმე კითხვას და მიიღეთ ბიუჯეტის რეალისტური დიაპაზონი.", steps: ["გადაწყვეტა", "შედეგი", "მასშტაბი", "ფუნქციები", "ვადა", "კონტექსტი"], questions: ["რა უნდა შევქმნათ?", "რა უნდა შეიცვალოს გაშვების შემდეგ?", "რა მოცულობაა საჭირო?", "რომელი ფუნქციებია აუცილებელი?", "როდის გჭირდებათ პირველი ვერსია?", "აღწერეთ მნიშვნელოვანი დეტალები"], options: { website: "საიტი ან ვებ სერვისი", crm: "CRM / პირადი კაბინეტი", automation: "პროცესების ავტომატიზაცია", analytics: "BI და ანალიტიკა", custom: "ინდივიდუალური სისტემა", leads: "მეტი მოთხოვნა", sales: "გაყიდვების ზრდა", speed: "სწრაფი პროცესები", control: "გამჭვირვალე მართვა", launch: "ახალი პროდუქტი", starter: "MVP", growth: "ზრდისთვის მზად", scale: "დიდი პლატფორმა", design: "უნიკალური დიზაინი", integrations: "ინტეგრაციები და API", account: "პირადი კაბინეტი", payments: "გადახდა და კალათა", dashboard: "დაშბორდები", multilingual: "მრავალენოვანი", calm: "მოქნილი ვადა", standard: "2–3 თვე", urgent: "სწრაფი გაშვება" }, multi: "აირჩიეთ რამდენიმე", continue: "გაგრძელება", placeholder: "აღწერეთ მომხმარებლები, არსებული პროცესები და ინტეგრაციები…", estimate: "წინასწარი დიაპაზონი", contact: "სად გამოგიგზავნოთ", name: "სახელი", email: "ელფოსტა", phone: "ტელეფონი", send: "შეფასების გაგზავნა", sending: "იგზავნება…", success: "შეფასება გაიგზავნა. ერთ სამუშაო დღეში დაგიკავშირდებით.", error: "გაგზავნა ვერ მოხერხდა.", note: "ეს არის ორიენტირი. საბოლოო შემადგენლობა და ბიუჯეტი დიაგნოსტიკის შემდეგ ფიქსირდება." },
  hy: { title: "Կազմեք անհատական նախագիծ", intro: "Պատասխանեք մի քանի հարցի և ստացեք բյուջեի իրատեսական միջակայք։", steps: ["Լուծում", "Արդյունք", "Ծավալ", "Գործառույթներ", "Ժամկետ", "Համատեքստ"], questions: ["Ի՞նչ է պետք ստեղծել։", "Ի՞նչ պետք է փոխվի գործարկումից հետո։", "Ի՞նչ ծավալ է անհրաժեշտ։", "Ո՞ր գործառույթներն են պարտադիր։", "Ե՞րբ է պետք առաջին տարբերակը։", "Նկարագրեք կարևոր մանրամասները"], options: { website: "Կայք կամ վեբ ծառայություն", crm: "CRM / անձնական հաշիվ", automation: "Գործընթացների ավտոմատացում", analytics: "BI և վերլուծություն", custom: "Անհատական համակարգ", leads: "Ավելի շատ հայտեր", sales: "Վաճառքի աճ", speed: "Արագ գործընթացներ", control: "Թափանցիկ կառավարում", launch: "Նոր արտադրանքի գործարկում", starter: "MVP", growth: "Աճի համակարգ", scale: "Մեծ հարթակ", design: "Յուրահատուկ դիզայն", integrations: "Ինտեգրումներ և API", account: "Անձնական հաշիվ", payments: "Վճարում և զամբյուղ", dashboard: "Դաշբորդներ", multilingual: "Բազմալեզու", calm: "Ճկուն ժամկետ", standard: "2–3 ամիս", urgent: "Արագ գործարկում" }, multi: "Կարելի է ընտրել մի քանիսը", continue: "Շարունակել", placeholder: "Նկարագրեք օգտատերերին, գործընթացները և ինտեգրումները…", estimate: "Նախնական միջակայք", contact: "Որտե՞ղ ուղարկել", name: "Անուն", email: "Էլ․ հասցե", phone: "Հեռախոս", send: "Ուղարկել հաշվարկը", sending: "Ուղարկվում է…", success: "Հաշվարկն ուղարկված է։ Կկապվենք մեկ աշխատանքային օրվա ընթացքում։", error: "Չհաջողվեց ուղարկել։", note: "Սա կողմնորոշիչ գնահատում է։ Վերջնական կազմն ու բյուջեն հաստատվում են ախտորոշումից հետո։" },
  bg: { title: "Съставете индивидуален проект", intro: "Отговорете на няколко въпроса и получете реалистичен бюджетен диапазон.", steps: ["Решение", "Резултат", "Мащаб", "Функции", "Срок", "Контекст"], questions: ["Какво трябва да създадем?", "Какво трябва да се промени след старта?", "Какъв обхват е нужен?", "Кои функции са задължителни?", "Кога е нужна първата версия?", "Опишете важните детайли"], options: { website: "Сайт или уеб услуга", crm: "CRM / клиентски профил", automation: "Автоматизация", analytics: "BI и анализи", custom: "Индивидуална система", leads: "Повече запитвания", sales: "Ръст на продажбите", speed: "По-бързи процеси", control: "Прозрачно управление", launch: "Нов продукт", starter: "MVP", growth: "Система за растеж", scale: "Голяма платформа", design: "Уникален дизайн", integrations: "Интеграции и API", account: "Клиентски профил", payments: "Плащания и количка", dashboard: "Табла", multilingual: "Няколко езика", calm: "Гъвкав срок", standard: "2–3 месеца", urgent: "Ускорен старт" }, multi: "Може да изберете няколко", continue: "Продължи", placeholder: "Опишете потребителите, процесите и интеграциите…", estimate: "Предварителен диапазон", contact: "Къде да го изпратим", name: "Име", email: "Имейл", phone: "Телефон", send: "Изпрати оценката", sending: "Изпращане…", success: "Оценката е изпратена. Ще се свържем до един работен ден.", error: "Неуспешно изпращане.", note: "Това е ориентир. Финалният обхват и бюджет се потвърждават след диагностика." },
} as const;

const stepKeys = ["type", "outcome", "scale", "features", "timeline", "task"] as const;
const choices = {
  type: ["website", "crm", "automation", "analytics", "custom"],
  outcome: ["leads", "sales", "speed", "control", "launch"],
  scale: ["starter", "growth", "scale"],
  features: ["design", "integrations", "account", "payments", "dashboard", "multilingual"],
  timeline: ["calm", "standard", "urgent"],
} as const;
const base = { website: 90_000, crm: 280_000, automation: 180_000, analytics: 150_000, custom: 100_000 };
const scale = { starter: 1, growth: 1.45, scale: 2.1 };
const timeline = { calm: .95, standard: 1, urgent: 1.25 };
const addOn = { design: 25_000, integrations: 35_000, account: 45_000, payments: 40_000, dashboard: 35_000, multilingual: 25_000 };

export function Calculator({ locale, labels }: { locale: Locale; labels: LegacyLabels }) {
  const t = copy[locale];
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [features, setFeatures] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const key = stepKeys[step];
  const options = key === "task" ? [] : choices[key];
  const selected = key === "features" ? features.length > 0 : key === "task" ? Boolean(values.task?.trim()) : Boolean(values[key]);
  const estimate = useMemo(() => {
    if (!values.type || !values.scale || !values.timeline) return 0;
    const amount = (base[values.type as keyof typeof base] + features.reduce((sum, item) => sum + addOn[item as keyof typeof addOn], 0)) * scale[values.scale as keyof typeof scale] * timeline[values.timeline as keyof typeof timeline];
    return Math.round(amount / 10_000) * 10_000;
  }, [features, values]);
  const format = (value: number) => new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US").format(value);

  const choose = (option: string) => {
    if (key === "features") {
      setFeatures((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
      return;
    }
    setValues((current) => ({ ...current, [key]: option }));
    window.setTimeout(() => setStep((current) => Math.min(current + 1, stepKeys.length - 1)), 120);
  };

  const send = async () => {
    if (!contact.name.trim() || !contact.email.includes("@") || status === "sending") return;
    setStatus("sending");
    const summary = [
      `${t.steps[0]}: ${t.options[values.type as keyof typeof t.options] ?? values.type}`,
      `${t.steps[1]}: ${t.options[values.outcome as keyof typeof t.options] ?? values.outcome}`,
      `${t.steps[2]}: ${t.options[values.scale as keyof typeof t.options] ?? values.scale}`,
      `${t.steps[3]}: ${features.map((item) => t.options[item as keyof typeof t.options]).join(", ")}`,
      `${t.steps[4]}: ${t.options[values.timeline as keyof typeof t.options] ?? values.timeline}`,
      `${t.estimate}: ${format(Math.round(estimate * .9))}–${format(Math.round(estimate * 1.15))} ₽`,
      `${t.steps[5]}: ${values.task}`,
    ].join("\n");
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...contact, message: summary, locale, source: "calculator" }) });
      if (!response.ok) throw new Error("request failed");
      setStatus("success");
    } catch { setStatus("error"); }
  };

  if (complete) return <div className="calc-result calc-result-detailed">
    <div className="calc-result-price"><span>{t.estimate}</span><strong>{format(Math.round(estimate * .9))}–{format(Math.round(estimate * 1.15))} ₽</strong><p>{t.note}</p></div>
    <div className="calc-contact"><h2>{t.contact}</h2><div className="calc-contact-fields"><input aria-label={t.name} placeholder={t.name} value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })}/><input aria-label={t.email} type="email" placeholder={t.email} value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })}/><input aria-label={t.phone} placeholder={t.phone} value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })}/></div><button className="button" type="button" onClick={send} disabled={status === "sending" || status === "success"}>{status === "sending" ? t.sending : t.send}<span>↗</span></button>{status === "success" ? <p className="calc-success">{t.success}</p> : null}{status === "error" ? <p className="calc-error">{t.error}</p> : null}</div>
  </div>;

  return <div className="calculator calculator-detailed">
    <header className="calculator-intro"><h1>{t.title}</h1><p>{t.intro}</p></header>
    <div className="calc-progress-label"><span>{t.steps[step]}</span><strong>{step + 1} / {stepKeys.length}</strong></div>
    <div className="calc-progress"><span style={{ width: `${((step + 1) / stepKeys.length) * 100}%` }} /></div>
    <nav className="calc-step-nav" aria-label="Calculator progress">{t.steps.map((item, index) => <button type="button" key={item} disabled={index > step} className={index === step ? "active" : index < step ? "done" : ""} onClick={() => index <= step && setStep(index)}><span>0{index + 1}</span>{item}</button>)}</nav>
    <section className="calc-question"><div className="calc-head"><h2>{t.questions[step]}</h2>{key === "features" ? <small>{t.multi}</small> : null}</div>
      {key === "task" ? <textarea className="calc-textarea" placeholder={t.placeholder} value={values.task || ""} onChange={(event) => setValues({ ...values, task: event.target.value })} rows={7} maxLength={1800} autoFocus /> : <div className={`calc-options ${key === "features" ? "multi" : ""}`}>{options.map((option) => { const active = key === "features" ? features.includes(option) : values[key] === option; return <button key={option} type="button" className={active ? "selected" : ""} onClick={() => choose(option)}><span>{t.options[option as keyof typeof t.options]}</span><i aria-hidden="true">{active ? "✓" : "+"}</i></button>; })}</div>}
    </section>
    <div className="calc-actions"><button type="button" className="text-button" disabled={step === 0} onClick={() => setStep(step - 1)}>{labels.back}</button>{key === "features" ? <button type="button" className="button" disabled={!selected} onClick={() => setStep(step + 1)}>{t.continue}</button> : key === "task" ? <button type="button" className="button" disabled={!selected} onClick={() => setComplete(true)}>{labels.calculate}</button> : <span className="calc-live-estimate">{estimate ? `${t.estimate}: ${format(estimate)} ₽` : "AGILE BUSINESS"}</span>}</div>
  </div>;
}
