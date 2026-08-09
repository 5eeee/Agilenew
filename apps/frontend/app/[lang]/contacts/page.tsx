import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { ContactChannels } from "@/components/contact-channels";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}) { const {lang}=await params;if(!isLocale(lang))return {};const d=getDictionary(lang);return buildPageMetadata(lang,"/contacts",d.page.contactsTitle,d.page.contactsText); }
export default async function Contacts({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = getDictionary(locale);
  const note = locale === "ru" ? "Регистрация не нужна. Первый разбор задачи — бесплатно." : locale === "hy" ? "Գրանցում պետք չէ։ Առաջին քննարկումն անվճար է։" : "No registration required. The first consultation is free.";
  return <main className="contact-layout shell"><header className="contact-editorial"><span>AGILE / CONTACT / 2026</span><h1>{d.page.contactsTitle}</h1><p>{d.page.contactsText}</p><strong>{note}</strong></header><section className="contact-page"><div className="contact-intro"><ContactChannels locale={locale} /></div><ContactForm labels={d.form} locale={locale} /></section></main>;
}
