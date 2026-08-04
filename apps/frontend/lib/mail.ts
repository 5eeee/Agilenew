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
