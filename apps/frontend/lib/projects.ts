import type { Locale } from "@/lib/i18n";

export type Project = {
  slug: string;
  title: string;
  category: string;
  lead: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  deliverables: readonly string[];
  tech: readonly string[];
  image?: string;
  mobileImage?: string;
  website?: string;
  year?: string;
  featured?: boolean;
};

type ProjectSource = Pick<Project, "slug" | "title" | "category" | "lead" | "tech" | "image" | "mobileImage" | "website" | "year" | "featured">;

const projects: readonly ProjectSource[] = [
  { slug: "13auto", title: "13AUTO", category: "E-commerce", lead: "Каталог автозапчастей с подбором, личным кабинетом и прозрачным сценарием заказа.", tech: ["Next.js", "TypeScript", "E-commerce", "Responsive UX"], image: "/projects/real/13auto-desktop.png", mobileImage: "/projects/real/13auto-mobile.png", website: "https://13auto-storefront.vercel.app/", year: "2026", featured: true },
  { slug: "prokub", title: "Прокуб", category: "B2B platform", lead: "Прайс-платформа бетона с доставкой, быстрым расчётом и заявками.", tech: ["Next.js", "Calculator", "B2B UX", "SEO"], image: "/projects/real/prokub-desktop.png", mobileImage: "/projects/real/prokub-mobile.png", website: "https://prokub-rf.vercel.app/", year: "2026", featured: true },
  { slug: "profist", title: "Профист", category: "Industry", lead: "Каталог металлопроката с подбором продукции под конкретную бизнес-задачу.", tech: ["Product catalogue", "Lead generation", "UI system", "SEO"], image: "/projects/real/profist-desktop.png", mobileImage: "/projects/real/profist-mobile.png", website: "https://profist-rf.vercel.app/", year: "2026", featured: true },
  { slug: "dianafarm", title: "Dianafarm", category: "International", lead: "Международная платформа по ВНЖ, недвижимости и сопровождению бизнеса.", tech: ["Multilingual", "Content system", "Conversion UX", "Next.js"], image: "/projects/real/dianafarm-desktop.png", mobileImage: "/projects/real/dianafarm-mobile.png", website: "https://dianafarm.group/", year: "2026", featured: true },
  { slug: "boostmarine", title: "Boost Marine", category: "Service", lead: "Сервисный сайт по ремонту водной техники с понятной навигацией по услугам.", tech: ["Service architecture", "Lead forms", "SEO", "Responsive UX"], image: "/projects/real/boostmarine-desktop.png", mobileImage: "/projects/real/boostmarine-mobile.png", website: "https://boostmarine.ru/", year: "2026", featured: true },
  { slug: "royal-horse", title: "Royal Horse", category: "Hospitality", lead: "Премиальный сайт конно-спортивного комплекса с выразительной атмосферой бренда.", tech: ["Art direction", "Responsive UX", "Booking flow", "Next.js"], image: "/projects/real/royal-horse-desktop.png", mobileImage: "/projects/real/royal-horse-mobile.png", website: "https://royal-horse-lake.vercel.app/", year: "2026", featured: true },
  { slug: "beef-flame", title: "Beefshteks", category: "Food delivery", lead: "Интерфейс доставки бургеров с яркой продуктовой подачей и быстрым заказом.", tech: ["Menu UX", "Cart", "Mobile UX", "Next.js"], image: "/projects/real/beef-flame-desktop.png", mobileImage: "/projects/real/beef-flame-mobile.png", website: "https://beef-flame.vercel.app/", year: "2026", featured: true },
  { slug: "agile-call", title: "Agile Call", category: "IT-продукт", lead: "Единая система для управления коммуникациями с клиентами.", tech: ["FastAPI", "React", "PostgreSQL", "WebSocket"] },
  { slug: "agile-kpi", title: "Agile KPI", category: "Бизнес-аналитика", lead: "Цифровая панель показателей для команд и руководителей.", tech: ["Next.js", "Python", "BI", "PostgreSQL"] },
  { slug: "corporate-site", title: "Корпоративный сайт", category: "Креатив и web", lead: "Имиджевая цифровая платформа с понятной продуктовой структурой.", tech: ["Next.js", "TypeScript", "CMS", "SEO"] },
  { slug: "landing", title: "Лендинг", category: "Креатив и web", lead: "Посадочная страница, которая объясняет ценность продукта и приводит заявки.", tech: ["React", "Motion", "Analytics", "A/B tests"] },
  { slug: "bi-analytics", title: "BI-аналитика", category: "Аналитика", lead: "Управленческие показатели, собранные в едином понятном интерфейсе.", tech: ["Power BI", "Python", "SQL", "ETL"] },
  { slug: "strategy", title: "Стратегический консалтинг", category: "Консалтинг", lead: "Стратегия роста с приоритетами, экономикой и планом внедрения.", tech: ["Research", "Unit Economics", "GTM", "Roadmap"] },
  { slug: "web-service", title: "Веб-сервис", category: "IT-продукт", lead: "Масштабируемый сервис для автоматизации ключевого бизнес-процесса.", tech: ["FastAPI", "Next.js", "Docker", "PostgreSQL"] },
  { slug: "crm", title: "CRM-интеграция", category: "Автоматизация", lead: "Связали продажи, коммуникации и отчётность в одном процессе.", tech: ["CRM", "REST API", "Python", "Webhooks"] },
  { slug: "marketing", title: "Маркетинговая кампания", category: "Креатив", lead: "Кампания с единым визуальным языком и измеримой воронкой.", tech: ["Strategy", "Creative", "Performance", "Analytics"] },
];

export const projectSlugs = projects.map((project) => project.slug);

const armenianTitles: Record<string, string> = { "corporate-site": "Կորպորատիվ կայք", landing: "Լենդինգ", "bi-analytics": "BI վերլուծություն", strategy: "Ռազմավարական խորհրդատվություն", "web-service": "Վեբ ծառայություն", crm: "CRM ինտեգրում", marketing: "Մարքեթինգային արշավ" };
const englishTitles: Record<string, string> = { "corporate-site": "Corporate website", landing: "Landing page", "bi-analytics": "BI analytics", strategy: "Strategic consulting", "web-service": "Web service", crm: "CRM integration", marketing: "Marketing campaign" };
const armenianCategories: Record<string, string> = { "IT-продукт": "IT արտադրանք", "Бизнес-аналитика": "Բիզնես վերլուծություն", "Креатив и web": "Կրեատիվ և վեբ", "Аналитика": "Վերլուծություն", "Консалтинг": "Խորհրդատվություն", "Автоматизация": "Ավտոմատացում", "Креатив": "Կրեատիվ" };

export function getProject(slug: string, locale: Locale): Project | undefined {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return undefined;
  const isRussian = locale === "ru";
  const isArmenian = locale === "hy";
  return {
    ...project,
    title: isRussian ? project.title : isArmenian ? armenianTitles[slug] ?? project.title : englishTitles[slug] ?? project.title,
    category: isRussian ? project.category : isArmenian ? armenianCategories[project.category] ?? project.category : project.category.replace("ИТ", "IT"),
    lead: isRussian ? project.lead : isArmenian ? "Չափելի բիզնես նպատակի շուրջ կառուցված հստակ թվային լուծում։" : "A focused business solution designed around a measurable objective.",
    description: isRussian
      ? "Мы начали с диагностики задачи и пользовательских сценариев, затем собрали прототип, визуальную систему и рабочий продукт. Решение проектировалось так, чтобы команда могла развивать его после запуска без полной переработки архитектуры."
      : isArmenian ? "Սկսեցինք բիզնես խնդրի և օգտատերերի սցենարների ուսումնասիրությունից, ապա ստեղծեցինք նախատիպը, տեսողական համակարգը և գործող արտադրանքը։ Ճարտարապետությունը նախատեսված է հետագա զարգացման համար։" : "We started with business discovery and user journeys, then built the prototype, visual system and production solution. The architecture is ready for continued growth after launch.",
    challenge: isRussian ? "Объединить разрозненные процессы в одном понятном инструменте и убрать ручные действия, которые замедляли команду." : isArmenian ? "Միավորել առանձին գործընթացները մեկ հասկանալի գործիքում և նվազեցնել թիմը դանդաղեցնող ձեռքի աշխատանքը։" : "Unify fragmented processes in one clear tool and remove manual work slowing the team down.",
    solution: isRussian ? "Спроектировали путь пользователя, логику ролей и ключевые экраны. Проверили прототип на реальных сценариях и только затем перешли к разработке." : isArmenian ? "Նախագծեցինք օգտատիրոջ ուղին, դերերի տրամաբանությունը և հիմնական էկրանները։ Նախատիպը ստուգեցինք իրական սցենարներով, ապա անցանք մշակմանը։" : "We designed the user journey, roles and key screens, validated the prototype on real scenarios and then moved into development.",
    result: isRussian
      ? "Команда получила понятный цифровой инструмент, прозрачную логику работы и основу для дальнейшего масштабирования."
      : isArmenian ? "Թիմը ստացավ պարզ թվային գործիք, աշխատանքի թափանցիկ տրամաբանություն և հետագա մասշտաբավորման հիմք։" : "The team received a clear digital tool, transparent operating logic and a foundation for further scaling.",
    deliverables: isRussian ? ["Диагностика и сценарии", "UX-прототип", "Визуальная система", "Разработка и запуск"] : isArmenian ? ["Ախտորոշում և սցենարներ", "UX նախատիպ", "Տեսողական համակարգ", "Մշակում և գործարկում"] : ["Discovery and journeys", "UX prototype", "Visual system", "Development and launch"],
  };
}

export function getPortfolioProjects(locale: Locale) {
  return projects.filter((project) => project.featured).map((project) => getProject(project.slug, locale)!).filter(Boolean);
}
