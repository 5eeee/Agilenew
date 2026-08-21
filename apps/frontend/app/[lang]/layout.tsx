import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getDictionary, isLocale, locales, type Locale } from "@/lib/i18n";
import "../globals.css";
import "../responsive-overrides.css";

const siteUrl = "https://agile-business-pro.com";

export function generateStaticParams() { return locales.map((lang) => ({ lang })); }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dictionary = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `Agile Business — ${dictionary.hero.eyebrow}`, template: "%s — Agile Business" },
    description: dictionary.hero.text,
    applicationName: "Agile Business",
    alternates: { canonical: `/${lang}`, languages: Object.fromEntries(locales.map((locale) => [locale, `/${locale}`])) },
    openGraph: { type: "website", siteName: "Agile Business", locale: lang, title: "Agile Business", description: dictionary.hero.text, url: `/${lang}` },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dictionary = getDictionary(locale);
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "Agile Business", url: siteUrl, email: "agilebusinessofficial@gmail.com", telephone: "+359884034524", contactPoint: [{ "@type": "ContactPoint", telephone: "+359884034524", email: "agilebusinessofficial@gmail.com" }, { "@type": "ContactPoint", telephone: "+79636177373", email: "info@agile-business-pro.com", areaServed: "RU" }] };

  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#content">{locale === "ru" ? "К содержанию" : locale === "pl" ? "Przejdź do treści" : "Skip to content"}</a>
        <Header locale={locale} nav={dictionary.nav} />
        <main id="content">{children}</main>
        <Footer locale={locale} line={dictionary.footer.line} privacy={dictionary.footer.privacy} nav={dictionary.nav} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
