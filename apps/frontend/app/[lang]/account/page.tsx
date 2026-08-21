import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPortal } from "@/components/account-portal";
import { isLocale, type Locale } from "@/lib/i18n";
import { getAccountServiceTitles } from "@/lib/service-catalog";

export const metadata: Metadata = { title: "Личный кабинет", robots: { index: false, follow: false } };
export default async function AccountPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ reset?: string }> }) {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const services = getAccountServiceTitles(locale);
  return <section className="account-page account-client-page"><AccountPortal locale={locale} services={services} resetToken={typeof query.reset === "string" ? query.reset : undefined} /></section>;
}
