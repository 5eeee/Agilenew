import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminLeads } from "@/components/admin-leads";
import { isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Управление сайтом", robots: { index: false, follow: false } };

export default async function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <section className="admin-page shell"><h1>Управление Agile Business</h1><p>Заявки, проекты, этапы, публикации и отзывы доступны только по серверному токену. Токен не сохраняется в браузере.</p><AdminLeads /></section>;
}
