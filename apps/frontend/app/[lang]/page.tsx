import { notFound } from "next/navigation";
import { PresentationHome } from "@/components/presentation-home";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getPortfolioProjects } from "@/lib/projects";

const heroCopy = {
  ru: { title: "Agile Business", terms: ["ИТ-разработка", "Бизнес-аналитика", "Стратегия и рост"], outcomes: ["продажи", "конверсию", "прибыль", "скорость"], text: "Проектируем цифровые системы, которые делают бизнес управляемым и сильным." },
  en: { title: "Agile Business", terms: ["IT development", "Business analytics", "Strategy and growth"], outcomes: ["sales", "conversion", "profit", "velocity"], text: "We design digital systems that make business manageable and strong." },
  pl: { title: "Agile Business", terms: ["Rozwój oprogramowania", "Analityka biznesowa", "Strategia i wzrost"], outcomes: ["sprzedaż", "konwersję", "zysk", "tempo działania"], text: "Projektujemy systemy cyfrowe, które porządkują biznes i wzmacniają jego rozwój." },
  ka: { title: "Agile Business", terms: ["IT განვითარება", "ბიზნეს ანალიტიკა", "სტრატეგია და ზრდა"], outcomes: ["გაყიდვებს", "კონვერსიას", "მოგებას", "სიჩქარეს"], text: "ვქმნით ციფრულ სისტემებს, რომლებიც ბიზნესს მართვადსა და ძლიერს ხდის." },
  hy: { title: "Agile Business", terms: ["ՏՏ մշակում", "Բիզնես վերլուծություն", "Ռազմավարություն և աճ"], outcomes: ["վաճառքները", "փոխարկումը", "շահույթը", "արագությունը"], text: "Նախագծում ենք թվային համակարգեր, որոնք բիզնեսը դարձնում են կառավարելի և ուժեղ։" },
  bg: { title: "Agile Business", terms: ["ИТ разработка", "Бизнес анализ", "Стратегия и растеж"], outcomes: ["продажбите", "конверсията", "печалбата", "скоростта"], text: "Проектираме дигитални системи, които правят бизнеса управляем и силен." },
} as const;

const projects = [
  { slug: "revolution-print", title: "Revolution Print", description: "Платформа управления типографией, заказами, производством и документами.", image: "/projects/captures/revolution-print-desktop.png", mobileImage: "/projects/captures/revolution-print-mobile.png", website: "https://github.com/5eeee/revolution-print", logo: "/projects/logos/revolution-print.png" },
  { slug: "13auto", title: "13AUTO", description: "Каталог автозапчастей с точным подбором и личным кабинетом.", image: "/projects/captures/13auto-desktop.png", mobileImage: "/projects/captures/13auto-mobile.png", website: "https://13auto-storefront.vercel.app/", logo: "/projects/logos/13auto.svg" },
  { slug: "dianafarm", title: "Dianafarm", description: "Международная платформа для недвижимости и сопровождения бизнеса.", image: "/projects/captures/dianafarm-desktop.png", mobileImage: "/projects/captures/dianafarm-mobile.png", website: "https://dianafarm.group/", logo: "/projects/logos/dianafarm.svg" },
  { slug: "boostmarine", title: "Boost Marine", description: "Сервисный сайт по ремонту водной техники.", image: "/projects/captures/boostmarine-desktop.png", mobileImage: "/projects/captures/boostmarine-mobile.png", website: "https://boostmarine.ru/", logo: "/projects/logos/boostmarine.png" },
  { slug: "royal-horse", title: "Royal Horse", description: "Премиальная цифровая среда конно-спортивного комплекса.", image: "/projects/captures/royal-horse-desktop.png", mobileImage: "/projects/captures/royal-horse-mobile.png", website: "https://royal-horse-lake.vercel.app/", logo: "/projects/logos/royal-horse.png" },
  { slug: "beef-flame", title: "Beefshteks", description: "Интерфейс доставки с быстрым сценарием заказа.", image: "/projects/captures/beef-flame-desktop.png", mobileImage: "/projects/captures/beef-flame-mobile.png", website: "https://beef-flame.vercel.app/", logo: "/projects/logos/beef-flame.png" },
  { slug: "profist", title: "Профист", description: "Каталог металлопроката с подбором под бизнес-задачу.", image: "/projects/captures/profist-desktop.png", mobileImage: "/projects/captures/profist-mobile.png", website: "https://profist-rf.vercel.app/", logo: "/projects/logos/profist.png" },
  { slug: "prokub", title: "Прокуб", description: "B2B-платформа бетона с быстрым расчётом и заявками.", image: "/projects/captures/prokub-desktop.png", mobileImage: "/projects/captures/prokub-mobile.png", website: "https://prokub-rf.vercel.app/", logo: "/projects/logos/prokub.png" },
] as const;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = getDictionary(locale);
  const hero = heroCopy[locale];
  const localizedPortfolio = new Map(getPortfolioProjects(locale).map((project) => [project.slug, project]));
  const homeProjects = projects.map((project) => {
    const localized = localizedPortfolio.get(project.slug);
    return { ...project, title: localized?.title ?? project.title, description: localized?.lead ?? project.description };
  });

  return <PresentationHome locale={locale} title={hero.title} terms={hero.terms} outcomes={hero.outcomes} text={hero.text} primary={d.hero.primary} secondary={d.hero.secondary} servicesTitle={d.services.title} servicesText={d.services.text} services={d.services.items} methodTitle={d.method.title} steps={d.method.steps} projects={homeProjects} ctaTitle={d.cta.title} ctaText={d.cta.text} ctaButton={d.cta.button} />;
}
