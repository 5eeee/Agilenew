import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPortal } from "@/components/account-portal";
import { isLocale, type Locale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Личный кабинет", robots: { index: false, follow: false } };
export default async function AccountPage({ params }: { params: Promise<{ lang: string }> }) { const { lang } = await params; if (!isLocale(lang)) notFound(); return <section className="account-page shell"><AccountPortal locale={lang as Locale} /></section>; }
