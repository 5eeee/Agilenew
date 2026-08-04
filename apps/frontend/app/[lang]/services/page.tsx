import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}) { const {lang}=await params;if(!isLocale(lang))return {};const d=getDictionary(lang);return buildPageMetadata(lang,"/services",d.page.servicesTitle,d.page.servicesText); }

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params; if (!isLocale(lang)) notFound(); const locale = lang as Locale; const d = getDictionary(locale);
  return <><section className="page-hero shell"><h1>{d.page.servicesTitle}</h1><p>{d.page.servicesText}</p></section><section className="section shell"><div className="service-detail-list">{d.services.items.map(([number,title,text])=><article key={number}><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div><Link className="button button-outline" href={`/${locale}/contacts`}>{d.nav.cta}</Link></article>)}</div></section><section className="cta shell"><h2>{d.cta.title}</h2><p>{d.cta.text}</p><Link className="button" href={`/${locale}/calculator`}>{d.hero.primary}</Link></section></>;
}
