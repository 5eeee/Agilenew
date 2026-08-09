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
  return <main className="contact-layout shell"><header className="contact-editorial"><h1>{d.page.contactsTitle}</h1></header><section className="contact-page"><div className="contact-intro"><ContactChannels locale={locale} /></div><ContactForm labels={d.form} locale={locale} /></section></main>;
}
