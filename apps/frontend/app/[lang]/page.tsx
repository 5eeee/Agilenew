import { notFound } from "next/navigation";
import { PresentationHome } from "@/components/presentation-home";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const heroCopy = {
  ru: { title: "Agile Business", terms: ["ИТ-разработка", "Бизнес-аналитика", "Стратегия и рост"], outcomes: ["продажи", "конверсию", "прибыль", "скорость"], text: "Проектируем цифровые системы, которые делают бизнес управляемым и сильным." },
  en: { title: "Agile Business", terms: ["IT development", "Business analytics", "Strategy and growth"], outcomes: ["sales", "conversion", "profit", "velocity"], text: "We design digital systems that make business manageable and strong." },
  ka: { title: "Agile Business", terms: ["IT განვითარება", "ბიზნეს ანალიტიკა", "სტრატეგია და ზრდა"], outcomes: ["გაყიდვებს", "კონვერსიას", "მოგებას", "სიჩქარეს"], text: "ვქმნით ციფრულ სისტემებს, რომლებიც ბიზნესს მართვადსა და ძლიერს ხდის." },
  hy: { title: "Agile Business", terms: ["ՏՏ մշակում", "Բիզնես վերլուծություն", "Ռազմավարություն և աճ"], outcomes: ["վաճառքները", "փոխարկումը", "շահույթը", "արագությունը"], text: "Նախագծում ենք թվային համակարգեր, որոնք բիզնեսը դարձնում են կառավարելի և ուժեղ։" },
  bg: { title: "Agile Business", terms: ["ИТ разработка", "Бизнес анализ", "Стратегия и растеж"], outcomes: ["продажбите", "конверсията", "печалбата", "скоростта"], text: "Проектираме дигитални системи, които правят бизнеса управляем и силен." },
} as const;

const projects = [
  { slug: "13auto", title: "13AUTO", description: "Каталог автозапчастей с точным подбором и личным кабинетом.", image: "/projects/real/13auto-desktop.webp", website: "https://13auto-storefront.vercel.app/" },
  { slug: "prokub", title: "Прокуб", description: "B2B-платформа бетона с быстрым расчётом и заявками.", image: "/projects/real/prokub-desktop.webp", website: "https://prokub-rf.vercel.app/", logo: "https://prokub-rf.vercel.app/assets/brand/prokub-logo.png?v=2" },
  { slug: "profist", title: "Профист", description: "Каталог металлопроката с подбором под бизнес-задачу.", image: "/projects/real/profist-desktop.webp", website: "https://profist-rf.vercel.app/", logo: "https://profist-rf.vercel.app/assets/brand/profist-logo.png?v=2" },
  { slug: "dianafarm", title: "Dianafarm", description: "Международная платформа для недвижимости и сопровождения бизнеса.", image: "/projects/real/dianafarm-desktop.webp", website: "https://dianafarm.group/" },
  { slug: "boostmarine", title: "Boost Marine", description: "Сервисный сайт по ремонту водной техники.", image: "/projects/real/boostmarine-desktop.webp", website: "https://boostmarine.ru/", logo: "https://boostmarine.ru/assets/img/logo2.png" },
  { slug: "royal-horse", title: "Royal Horse", description: "Премиальная цифровая среда конно-спортивного комплекса.", image: "/projects/real/royal-horse-desktop.webp", website: "https://royal-horse-lake.vercel.app/", logo: "https://royal-horse-lake.vercel.app/images/horse_logo.png" },
  { slug: "beef-flame", title: "Beefshteks", description: "Интерфейс доставки с быстрым сценарием заказа.", image: "/projects/real/beef-flame-desktop.webp", website: "https://beef-flame.vercel.app/", logo: "https://beef-flame.vercel.app/images/brand/logo-mark.png" },
] as const;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = getDictionary(locale);
  const hero = heroCopy[locale];

  return <PresentationHome locale={locale} title={hero.title} terms={hero.terms} outcomes={hero.outcomes} text={hero.text} primary={d.hero.primary} secondary={d.hero.secondary} servicesTitle={d.services.title} servicesText={d.services.text} services={d.services.items} methodTitle={d.method.title} steps={d.method.steps} projects={projects} ctaTitle={d.cta.title} ctaText={d.cta.text} ctaButton={d.cta.button} />;
}
