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
  testimonial: string;
  deliverables: readonly string[];
  tech: readonly string[];
  image?: string;
  logo?: string;
  mobileImage?: string;
  website?: string;
  year?: string;
  duration?: string;
  featured?: boolean;
};

type ProjectSource = Pick<Project, "slug" | "title" | "category" | "lead" | "tech" | "image" | "mobileImage" | "website" | "year" | "duration" | "featured">;

const projects: readonly ProjectSource[] = [
  { slug: "13auto", title: "13AUTO", category: "E-commerce", lead: "Каталог автозапчастей с подбором, личным кабинетом и прозрачным сценарием заказа.", tech: ["Next.js", "TypeScript", "E-commerce", "Responsive UX"], image: "/projects/real/13auto-desktop.webp", mobileImage: "/projects/real/13auto-mobile.webp", website: "https://13auto-storefront.vercel.app/", year: "2026", duration: "8 недель", featured: true },
  { slug: "prokub", title: "Прокуб", category: "B2B platform", lead: "Прайс-платформа бетона с доставкой, быстрым расчётом и заявками.", tech: ["Next.js", "Calculator", "B2B UX", "SEO"], image: "/projects/real/prokub-desktop.webp", mobileImage: "/projects/real/prokub-mobile.webp", website: "https://prokub-rf.vercel.app/", year: "2026", duration: "7 недель", featured: true },
  { slug: "profist", title: "Профист", category: "Industry", lead: "Каталог металлопроката с подбором продукции под конкретную бизнес-задачу.", tech: ["Product catalogue", "Lead generation", "UI system", "SEO"], image: "/projects/real/profist-desktop.webp", mobileImage: "/projects/real/profist-mobile.webp", website: "https://profist-rf.vercel.app/", year: "2026", duration: "7 недель", featured: true },
  { slug: "dianafarm", title: "Dianafarm", category: "International", lead: "Международная платформа по ВНЖ, недвижимости и сопровождению бизнеса.", tech: ["Multilingual", "Content system", "Conversion UX", "Next.js"], image: "/projects/real/dianafarm-desktop.webp", mobileImage: "/projects/real/dianafarm-mobile.webp", website: "https://dianafarm.group/", year: "2026", duration: "10 недель", featured: true },
  { slug: "boostmarine", title: "Boost Marine", category: "Service", lead: "Сервисный сайт по ремонту водной техники с понятной навигацией по услугам.", tech: ["Service architecture", "Lead forms", "SEO", "Responsive UX"], image: "/projects/real/boostmarine-desktop.webp", mobileImage: "/projects/real/boostmarine-mobile.webp", website: "https://boostmarine.ru/", year: "2026", duration: "6 недель", featured: true },
  { slug: "royal-horse", title: "Royal Horse", category: "Hospitality", lead: "Премиальный сайт конно-спортивного комплекса с выразительной атмосферой бренда.", tech: ["Art direction", "Responsive UX", "Booking flow", "Next.js"], image: "/projects/real/royal-horse-desktop.webp", mobileImage: "/projects/real/royal-horse-mobile.webp", website: "https://royal-horse-lake.vercel.app/", year: "2026", duration: "9 недель", featured: true },
  { slug: "beef-flame", title: "Beefshteks", category: "Food delivery", lead: "Интерфейс доставки бургеров с яркой продуктовой подачей и быстрым заказом.", tech: ["Menu UX", "Cart", "Mobile UX", "Next.js"], image: "/projects/real/beef-flame-desktop-v2.webp", mobileImage: "/projects/real/beef-flame-mobile.webp", website: "https://beef-flame.vercel.app/", year: "2026", duration: "6 недель", featured: true },
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

const projectLogos: Record<string, string> = {
  "13auto": "/projects/logos/13auto.svg",
  prokub: "/projects/logos/prokub.png",
  profist: "/projects/logos/profist.png",
  dianafarm: "/projects/logos/dianafarm.svg",
  boostmarine: "/projects/logos/boostmarine.png",
  "royal-horse": "/projects/logos/royal-horse.png",
  "beef-flame": "/projects/logos/beef-flame.png",
};

export const projectSlugs = projects.map((project) => project.slug);

const armenianTitles: Record<string, string> = { "corporate-site": "Կորպորատիվ կայք", landing: "Լենդինգ", "bi-analytics": "BI վերլուծություն", strategy: "Ռազմավարական խորհրդատվություն", "web-service": "Վեբ ծառայություն", crm: "CRM ինտեգրում", marketing: "Մարքեթինգային արշավ" };
const englishTitles: Record<string, string> = { "corporate-site": "Corporate website", landing: "Landing page", "bi-analytics": "BI analytics", strategy: "Strategic consulting", "web-service": "Web service", crm: "CRM integration", marketing: "Marketing campaign" };
const armenianCategories: Record<string, string> = { "IT-продукт": "IT արտադրանք", "Бизнес-аналитика": "Բիզնես վերլուծություն", "Креатив и web": "Կրեատիվ և վեբ", "Аналитика": "Վերլուծություն", "Консалтинг": "Խորհրդատվություն", "Автоматизация": "Ավտոմատացում", "Креатив": "Կրեատիվ" };

export function getProject(slug: string, locale: Locale): Project | undefined {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return undefined;
  const isRussian = locale === "ru";
  const isArmenian = locale === "hy";
  const businessBenefits: Record<string, string> = {
    "13auto": "Сократили путь от поиска запчасти до заказа и сделали подбор понятным для покупателя и менеджера.",
    prokub: "Ускорили получение расчёта и превратили сложный B2B-прайс в прозрачный сценарий заявки.",
    profist: "Упростили подбор металлопроката и повысили качество входящих обращений за счёт точной структуры каталога.",
    dianafarm: "Собрали международные услуги в единую воронку и сделали сложное предложение понятным для клиента.",
    boostmarine: "Развели услуги по понятным сценариям и сократили путь клиента от проблемы до обращения в сервис.",
    "royal-horse": "Усилили премиальное позиционирование комплекса и сделали запись на услуги заметнее и проще.",
    "beef-flame": "Сделали продукт главным героем экрана и сократили путь пользователя от выбора бургера до заказа.",
  };
  const testimonials: Record<string, string> = {
    "13auto": "Теперь покупатель быстрее находит нужную деталь, а менеджер получает уже понятный и подготовленный запрос.",
    prokub: "Клиент видит условия и следующий шаг сразу — меньше уточнений, быстрее расчёт и предметнее заявка.",
    profist: "Каталог наконец говорит на языке задачи клиента, поэтому обращения стали точнее и полезнее для отдела продаж.",
    dianafarm: "Сложные международные услуги удалось собрать в ясный маршрут, которому клиент доверяет с первого экрана.",
    boostmarine: "Вместо долгого поиска посетитель сразу понимает, какая услуга решит его проблему и как обратиться в сервис.",
    "royal-horse": "Сайт передаёт уровень комплекса ещё до визита и аккуратно ведёт гостя к записи.",
    "beef-flame": "Меню стало визуальным и быстрым: продукт хочется выбрать, а оформить заказ можно без лишних шагов.",
  };
  return {
    ...project,
    logo: projectLogos[slug],
    title: isRussian ? project.title : isArmenian ? armenianTitles[slug] ?? project.title : englishTitles[slug] ?? project.title,
    category: isRussian ? project.category : isArmenian ? armenianCategories[project.category] ?? project.category : project.category.replace("ИТ", "IT"),
    lead: isRussian ? project.lead : isArmenian ? "Չափելի բիզնես նպատակի շուրջ կառուցված հստակ թվային լուծում։" : "A focused business solution designed around a measurable objective.",
    description: isRussian
      ? "Мы начали с диагностики задачи и пользовательских сценариев, затем собрали прототип, визуальную систему и рабочий продукт. Решение проектировалось так, чтобы команда могла развивать его после запуска без полной переработки архитектуры."
      : isArmenian ? "Սկսեցինք բիզնես խնդրի և օգտատերերի սցենարների ուսումնասիրությունից, ապա ստեղծեցինք նախատիպը, տեսողական համակարգը և գործող արտադրանքը։ Ճարտարապետությունը նախատեսված է հետագա զարգացման համար։" : "We started with business discovery and user journeys, then built the prototype, visual system and production solution. The architecture is ready for continued growth after launch.",
    challenge: isRussian ? "Объединить разрозненные процессы в одном понятном инструменте и убрать ручные действия, которые замедляли команду." : isArmenian ? "Միավորել առանձին գործընթացները մեկ հասկանալի գործիքում և նվազեցնել թիմը դանդաղեցնող ձեռքի աշխատանքը։" : "Unify fragmented processes in one clear tool and remove manual work slowing the team down.",
    solution: isRussian ? "Спроектировали путь пользователя, логику ролей и ключевые экраны. Проверили прототип на реальных сценариях и только затем перешли к разработке." : isArmenian ? "Նախագծեցինք օգտատիրոջ ուղին, դերերի տրամաբանությունը և հիմնական էկրանները։ Նախատիպը ստուգեցինք իրական սցենարներով, ապա անցանք մշակմանը։" : "We designed the user journey, roles and key screens, validated the prototype on real scenarios and then moved into development.",
    result: isRussian
      ? businessBenefits[slug] ?? "Команда получила понятный цифровой инструмент, прозрачную логику работы и основу для дальнейшего масштабирования."
      : isArmenian ? "Թիմը ստացավ պարզ թվային գործիք, աշխատանքի թափանցիկ տրամաբանություն և հետագա մասշտաբավորման հիմք։" : "The team received a clear digital tool, transparent operating logic and a foundation for further scaling.",
    testimonial: isRussian
      ? testimonials[slug] ?? "Решение стало понятным для клиентов и удобным рабочим инструментом для команды."
      : isArmenian ? "Լուծումը հասկանալի դարձավ հաճախորդների համար և հարմար գործիք՝ թիմի համար։" : "The solution is now clearer for customers and more useful for the team operating it.",
    deliverables: isRussian ? ["Диагностика и сценарии", "UX-прототип", "Визуальная система", "Разработка и запуск"] : isArmenian ? ["Ախտորոշում և սցենարներ", "UX նախատիպ", "Տեսողական համակարգ", "Մշակում և գործարկում"] : ["Discovery and journeys", "UX prototype", "Visual system", "Development and launch"],
  };
}

export function getPortfolioProjects(locale: Locale) {
  return projects.filter((project) => project.featured).map((project) => getProject(project.slug, locale)!).filter(Boolean);
}
