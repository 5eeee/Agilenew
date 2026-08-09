import { notFound } from "next/navigation";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { isLocale, type Locale } from "@/lib/i18n";
import { getPortfolioProjects } from "@/lib/projects";
import { buildPageMetadata } from "@/lib/seo";

const copy = {
  ru: { title: "Проекты, которые работают в бизнесе", text: "Запущенные цифровые продукты с понятной задачей, продуманной логикой и измеримым результатом." },
  en: { title: "Projects that work in business", text: "Launched digital products with a clear challenge, deliberate product logic and measurable outcomes." },
  ka: { title: "პროექტები, რომლებიც ბიზნესში მუშაობს", text: "გაშვებული ციფრული პროდუქტები მკაფიო ამოცანით, გააზრებული ლოგიკითა და გაზომვადი შედეგით." },
  hy: { title: "Նախագծեր, որոնք աշխատում են բիզնեսում", text: "Գործարկված թվային պրոդուկտներ՝ հստակ խնդրով, մտածված տրամաբանությամբ և չափելի արդյունքով։" },
  bg: { title: "Проекти, които работят за бизнеса", text: "Стартирани дигитални продукти с ясна задача, обмислена логика и измерим резултат." },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return buildPageMetadata(lang, "/projects", copy[lang].title, copy[lang].text);
}

export default async function ProjectsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const projects = getPortfolioProjects(locale);
  const t = copy[locale];

  return <main className="portfolio-page shell">
    <header className="portfolio-hero">
      <h1>{t.title}</h1>
      <p>{t.text}</p>
    </header>
    <PortfolioGrid projects={projects} locale={locale} />
  </main>;
}
