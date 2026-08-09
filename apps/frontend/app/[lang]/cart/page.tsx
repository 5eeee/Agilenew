import { notFound } from "next/navigation";
import { ServiceCart } from "@/components/service-cart";
import { isLocale, type Locale } from "@/lib/i18n";
import { getServiceCatalog } from "@/lib/service-catalog";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return buildPageMetadata(lang, "/cart", lang === "ru" ? "Корзина услуг — Agile Business" : "Service cart — Agile Business", lang === "ru" ? "Соберите услуги Agile Business в один проект." : "Combine Agile Business services into one project.");
}

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  return <ServiceCart locale={locale} services={getServiceCatalog(locale)} />;
}
