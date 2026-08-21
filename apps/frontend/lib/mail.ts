import nodemailer from "nodemailer";

export type MailStatus = {
  configured: boolean;
  status: "ready" | "not_configured";
  host?: string;
  port?: number;
  secure?: boolean;
  from?: string;
  to?: string;
};

export function mailStatus(): MailStatus {
  const configured = Boolean(
    process.env.AGILE_SMTP_HOST &&
    process.env.AGILE_SMTP_USER &&
    process.env.AGILE_SMTP_PASS &&
    process.env.AGILE_EMAIL_TO,
  );
  return {
    configured,
    status: configured ? "ready" : "not_configured",
    ...(process.env.AGILE_SMTP_HOST ? {
      host: process.env.AGILE_SMTP_HOST,
      port: Number(process.env.AGILE_SMTP_PORT || 465),
      secure: process.env.AGILE_SMTP_SECURE !== "false",
      from: process.env.AGILE_EMAIL_FROM || process.env.AGILE_SMTP_USER,
      to: process.env.AGILE_EMAIL_TO,
    } : {}),
  };
}

function transport() {
  if (!mailStatus().configured) throw new Error("SMTP_NOT_CONFIGURED");
  return nodemailer.createTransport({
    host: process.env.AGILE_SMTP_HOST,
    port: Number(process.env.AGILE_SMTP_PORT || 465),
    secure: process.env.AGILE_SMTP_SECURE !== "false",
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    auth: { user: process.env.AGILE_SMTP_USER, pass: process.env.AGILE_SMTP_PASS },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[character] || character);
}

export async function sendTestEmail() {
  await transport().sendMail({
    from: process.env.AGILE_EMAIL_FROM || process.env.AGILE_SMTP_USER,
    to: process.env.AGILE_EMAIL_TO,
    subject: "Agile Business — проверка корпоративной почты",
    text: "Почтовые уведомления Agile Business настроены корректно.",
  });
}

export async function sendLeadEmail(lead: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  source: string;
}) {
  if (!mailStatus().configured) return false;
  await transport().sendMail({
    from: process.env.AGILE_EMAIL_FROM || process.env.AGILE_SMTP_USER,
    to: process.env.AGILE_EMAIL_TO,
    replyTo: lead.email,
    subject: `Новая заявка Agile Business — ${lead.name}`,
    text: [
      `ID: ${lead.id}`,
      `Имя: ${lead.name}`,
      `Email: ${lead.email}`,
      `Телефон: ${lead.phone || "—"}`,
      `Компания: ${lead.company || "—"}`,
      `Источник: ${lead.source}`,
      "",
      lead.message,
    ].join("\n"),
  });
  return true;
}

type CustomerLocale = "ru" | "en" | "ka" | "hy" | "bg";

const statusLabels: Record<CustomerLocale, Record<string, string>> = {
  ru: { NEW: "Заявка принята", DISCOVERY: "Погружение", PLANNING: "Планирование", DESIGN: "Дизайн", DEVELOPMENT: "Разработка", QA: "Проверка", LAUNCH: "Запуск", SUPPORT: "Поддержка", COMPLETED: "Проект завершён", CANCELLED: "Проект отменён" },
  en: { NEW: "Request received", DISCOVERY: "Discovery", PLANNING: "Planning", DESIGN: "Design", DEVELOPMENT: "Development", QA: "Quality assurance", LAUNCH: "Launch", SUPPORT: "Support", COMPLETED: "Project completed", CANCELLED: "Project cancelled" },
  bg: { NEW: "Заявката е приета", DISCOVERY: "Проучване", PLANNING: "Планиране", DESIGN: "Дизайн", DEVELOPMENT: "Разработка", QA: "Проверка", LAUNCH: "Стартиране", SUPPORT: "Поддръжка", COMPLETED: "Проектът е завършен", CANCELLED: "Проектът е отменен" },
  ka: { NEW: "მოთხოვნა მიღებულია", DISCOVERY: "კვლევა", PLANNING: "დაგეგმვა", DESIGN: "დიზაინი", DEVELOPMENT: "დეველოპმენტი", QA: "შემოწმება", LAUNCH: "გაშვება", SUPPORT: "მხარდაჭერა", COMPLETED: "პროექტი დასრულებულია", CANCELLED: "პროექტი გაუქმებულია" },
  hy: { NEW: "Հայտն ընդունված է", DISCOVERY: "Ուսումնասիրություն", PLANNING: "Պլանավորում", DESIGN: "Դիզայն", DEVELOPMENT: "Մշակում", QA: "Ստուգում", LAUNCH: "Մեկնարկ", SUPPORT: "Աջակցություն", COMPLETED: "Նախագիծն ավարտված է", CANCELLED: "Նախագիծը չեղարկված է" },
};

function customerCopy(locale: CustomerLocale) {
  if (locale === "ru") return {
    received: "Ваша заявка принята",
    hello: "Здравствуйте",
    intro: "Мы сохранили состав проекта и скоро свяжемся с вами, чтобы уточнить задачу, сроки и итоговую смету.",
    order: "Номер заявки",
    scope: "Состав заявки",
    total: "Предварительная стоимость",
    track: "Отслеживать проект",
    changed: "Статус проекта обновлён",
    status: "Новый этап",
    next: "Откройте личный кабинет, чтобы увидеть прогресс и подтвердить выполненный этап.",
    contact: "Если нужно дополнить заявку, напишите на agilebusinessofficial@gmail.com или в Telegram @DevyatovOfficial.",
  };
  if (locale === "bg") return {
    received: "Вашата заявка е приета", hello: "Здравейте", intro: "Запазихме обхвата на проекта и скоро ще се свържем с вас, за да уточним задачата, срока и крайната оферта.", order: "Номер на заявката", scope: "Обхват", total: "Предварителна стойност", track: "Проследяване на проекта", changed: "Статусът на проекта е обновен", status: "Нов етап", next: "Отворете клиентския профил, за да видите напредъка и да потвърдите завършения етап.", contact: "За допълнения пишете на agilebusinessofficial@gmail.com или в Telegram @DevyatovOfficial.",
  };
  return {
    received: "Your request has been received", hello: "Hello", intro: "We saved the project scope and will contact you shortly to confirm the requirements, timeline and final estimate.", order: "Request number", scope: "Requested services", total: "Preliminary estimate", track: "Track your project", changed: "Your project status has changed", status: "New stage", next: "Open your client account to view progress and approve the completed stage.", contact: "To add details, email agilebusinessofficial@gmail.com or message @DevyatovOfficial on Telegram.",
  };
}

function accountUrl(locale: CustomerLocale) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://agile-business-platform.vercel.app";
  return `${origin}/${locale}/account`;
}

function brandedHtml(content: string) {
  return `<div style="margin:0;background:#f4f3ef;padding:32px 16px;font-family:Arial,sans-serif;color:#111"><div style="max-width:640px;margin:auto;background:#fff;border:1px solid #deddd8;border-radius:24px;overflow:hidden"><div style="height:7px;background:#e11624"></div><div style="padding:32px">${content}</div></div></div>`;
}

export async function sendOrderConfirmationEmail(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  locale: CustomerLocale;
  total: number;
  currency: string;
  items: { title: string }[];
}) {
  if (!mailStatus().configured) return false;
  const copy = customerCopy(order.locale);
  const formattedTotal = new Intl.NumberFormat(order.locale === "ru" ? "ru-RU" : "en-US", { style: "currency", currency: order.currency, maximumFractionDigits: 0 }).format(order.total);
  const list = order.items.map((item) => `<li style="margin:8px 0">${escapeHtml(item.title)}</li>`).join("");
  const customerName = escapeHtml(order.customerName);
  await transport().sendMail({
    from: process.env.AGILE_EMAIL_FROM || process.env.AGILE_SMTP_USER,
    to: order.customerEmail,
    subject: `${copy.received} — Agile Business`,
    text: `${copy.hello}, ${order.customerName}!\n\n${copy.intro}\n${copy.order}: ${order.id}\n${copy.scope}:\n${order.items.map((item) => `— ${item.title}`).join("\n")}\n${copy.total}: ${formattedTotal}\n\n${copy.contact}\n${accountUrl(order.locale)}`,
    html: brandedHtml(`<p style="margin:0 0 10px;color:#e11624;font-size:12px;font-weight:700;text-transform:uppercase">Agile Business</p><h1 style="margin:0 0 22px;font-size:34px;line-height:1.05">${copy.received}</h1><p>${copy.hello}, <strong>${customerName}</strong>!</p><p style="line-height:1.6">${copy.intro}</p><p><strong>${copy.order}:</strong> ${order.id}</p><h2 style="margin:26px 0 10px;font-size:18px">${copy.scope}</h2><ul style="padding-left:20px">${list}</ul><p><strong>${copy.total}:</strong> ${formattedTotal}</p><a href="${accountUrl(order.locale)}" style="display:inline-block;margin-top:20px;padding:15px 22px;border-radius:999px;background:#e11624;color:#fff;text-decoration:none;font-weight:700">${copy.track}</a><p style="margin-top:28px;color:#666;font-size:13px;line-height:1.5">${copy.contact}</p>`),
  });
  return true;
}

export async function sendOrderStatusEmail(order: {
  id: string;
  customerName: string;
  customerEmail: string;
  locale: CustomerLocale;
  status: string;
}) {
  if (!mailStatus().configured) return false;
  const copy = customerCopy(order.locale);
  const label = statusLabels[order.locale][order.status] || order.status;
  const customerName = escapeHtml(order.customerName);
  await transport().sendMail({
    from: process.env.AGILE_EMAIL_FROM || process.env.AGILE_SMTP_USER,
    to: order.customerEmail,
    subject: `${copy.changed}: ${label} — Agile Business`,
    text: `${copy.hello}, ${order.customerName}!\n\n${copy.status}: ${label}\n${copy.next}\n\n${copy.contact}\n${accountUrl(order.locale)}`,
    html: brandedHtml(`<p style="margin:0 0 10px;color:#e11624;font-size:12px;font-weight:700;text-transform:uppercase">${copy.changed}</p><h1 style="margin:0 0 22px;font-size:34px;line-height:1.05">${label}</h1><p>${copy.hello}, <strong>${customerName}</strong>!</p><p style="line-height:1.6">${copy.next}</p><a href="${accountUrl(order.locale)}" style="display:inline-block;margin-top:20px;padding:15px 22px;border-radius:999px;background:#e11624;color:#fff;text-decoration:none;font-weight:700">${copy.track}</a><p style="margin-top:28px;color:#666;font-size:13px;line-height:1.5">${copy.contact}</p>`),
  });
  return true;
}

export async function sendPasswordResetEmail(input: { to: string; name: string; url: string; locale: CustomerLocale }) {
  if (!mailStatus().configured) return false;
  const ru = input.locale === "ru";
  const subject = ru ? "Восстановление доступа — Agile Business" : "Reset your Agile Business password";
  const title = ru ? "Восстановление доступа" : "Reset your password";
  const body = ru ? "Ссылка действует 30 минут. Если вы не запрашивали восстановление, просто проигнорируйте письмо." : "This link is valid for 30 minutes. If you did not request it, you can safely ignore this email.";
  const button = ru ? "Задать новый пароль" : "Set a new password";
  const name = escapeHtml(input.name);
  await transport().sendMail({
    from: process.env.AGILE_EMAIL_FROM || process.env.AGILE_SMTP_USER,
    to: input.to,
    subject,
    text: `${input.name},\n\n${body}\n${input.url}`,
    html: brandedHtml(`<p style="margin:0 0 10px;color:#e11624;font-size:12px;font-weight:700;text-transform:uppercase">Agile Business</p><h1 style="margin:0 0 22px;font-size:34px;line-height:1.05">${title}</h1><p><strong>${name}</strong>,</p><p style="line-height:1.6">${body}</p><a href="${input.url}" style="display:inline-block;margin-top:20px;padding:15px 22px;border-radius:999px;background:#e11624;color:#fff;text-decoration:none;font-weight:700">${button}</a>`),
  });
  return true;
}
