import { notFound } from "next/navigation";
import { PresentationHome } from "@/components/presentation-home";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const heroCopy = {
  ru: { title: "Увеличиваем", terms: ["продажи", "конверсию", "прибыль", "скорость"], text: "Проектируем сайты, CRM и аналитику, которые превращают обращения в продажи." },
  en: { title: "We increase", terms: ["sales", "conversion", "profit", "velocity"], text: "We design websites, CRM and analytics that turn enquiries into sales." },
  ka: { title: "ვზრდით", terms: ["გაყიდვებს", "კონვერსიას", "მოგებას", "სიჩქარეს"], text: "ვქმნით საიტებს, CRM-სა და ანალიტიკას, რომლებიც მოთხოვნებს გაყიდვებად აქცევს." },
  hy: { title: "Բարձրացնում ենք", terms: ["վաճառքները", "փոխարկումը", "շահույթը", "արագությունը"], text: "Նախագծում ենք կայքեր, CRM և վերլուծություն, որոնք դիմումները վերածում են վաճառքի։" },
  bg: { title: "Увеличаваме", terms: ["продажбите", "конверсията", "печалбата", "скоростта"], text: "Проектираме сайтове, CRM и анализи, които превръщат запитванията в продажби." },
} as const;

const projects = [
  { slug: "13auto", title: "13AUTO", description: "Каталог автозапчастей с точным подбором и личным кабинетом.", image: "/projects/real/13auto-desktop.png" },
  { slug: "dianafarm", title: "Dianafarm", description: "Международная платформа для недвижимости и сопровождения бизнеса.", image: "/projects/real/dianafarm-desktop.png" },
  { slug: "royal-horse", title: "Royal Horse", description: "Премиальная цифровая среда конно-спортивного комплекса.", image: "/projects/real/royal-horse-desktop.png" },
] as const;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = getDictionary(locale);
  const hero = heroCopy[locale];

  return <PresentationHome locale={locale} title={hero.title} terms={hero.terms} text={hero.text} primary={d.hero.primary} secondary={d.hero.secondary} servicesTitle={d.services.title} servicesText={d.services.text} services={d.services.items} methodTitle={d.method.title} steps={d.method.steps} projects={projects} ctaTitle={d.cta.title} ctaText={d.cta.text} ctaButton={d.cta.button} />;
}
