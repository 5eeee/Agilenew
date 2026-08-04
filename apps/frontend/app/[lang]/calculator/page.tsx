import { notFound } from "next/navigation";
import { Calculator } from "@/components/calculator";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({params}:{params:Promise<{lang:string}>}) { const {lang}=await params;if(!isLocale(lang))return {};const d=getDictionary(lang);return buildPageMetadata(lang,"/calculator",d.page.calculatorTitle,d.page.calculatorText); }
export default async function CalculatorPage({ params }: { params: Promise<{ lang: string }> }) { const {lang}=await params;if(!isLocale(lang))notFound();const locale=lang as Locale;const d=getDictionary(locale);return <section className="calc-section calc-page shell"><Calculator locale={locale} labels={d.calc} /></section>; }
