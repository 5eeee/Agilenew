import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedHero } from "@/components/animated-hero";
import { KineticServices } from "@/components/kinetic-services";
import { ProductShowcase } from "@/components/product-showcase";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const homeContent = {
  ru: { title: "Увеличиваем", terms: ["продажи", "конверсию", "прибыль", "скорость"], text: "Проектируем сайты, CRM и аналитику, которые превращают больше обращений в продажи и дают руководителю прозрачные цифры.", kpiLabel: "Рост целевого действия", kpiNote: "после внедрения системы", projectsEyebrow: "Выбранные проекты", projectsTitle: "Решения, которыми мы гордимся", category: ["IT", "IT", "Креатив", "Креатив", "Аналитика", "Аналитика", "IT", "IT", "Креатив"] },
  en: { title: "We increase", terms: ["sales", "conversion", "profit", "velocity"], text: "We design websites, CRM systems and analytics that turn more enquiries into sales and give leaders clear, actionable numbers.", kpiLabel: "Target action growth", kpiNote: "after the system launch", projectsEyebrow: "Selected projects", projectsTitle: "Solutions we are proud of", category: ["IT", "IT", "Creative", "Creative", "Analytics", "Analytics", "IT", "IT", "Creative"] },
  ka: { title: "ვზრდით", terms: ["გაყიდვებს", "კონვერსიას", "მოგებას", "სიჩქარეს"], text: "ვქმნით საიტებს, CRM სისტემებსა და ანალიტიკას, რომლებიც მეტ მოთხოვნას გაყიდვად აქცევს და ხელმძღვანელს გამჭვირვალე მონაცემებს აძლევს.", kpiLabel: "სამიზნე მოქმედების ზრდა", kpiNote: "სისტემის დანერგვის შემდეგ", projectsEyebrow: "რჩეული პროექტები", projectsTitle: "გადაწყვეტილებები, რომლებითაც ვამაყობთ", category: ["IT", "IT", "კრეატივი", "კრეატივი", "ანალიტიკა", "ანალიტიკა", "IT", "IT", "კრეატივი"] },
  hy: { title: "Բարձրացնում ենք", terms: ["վաճառքները", "փոխարկումը", "շահույթը", "արագությունը"], text: "Ստեղծում ենք կայքեր, CRM համակարգեր և վերլուծություն, որոնք ավելի շատ դիմումներ վերածում են վաճառքի և ղեկավարին տալիս են հստակ թվեր։", kpiLabel: "Թիրախային գործողության աճ", kpiNote: "համակարգի ներդրումից հետո", projectsEyebrow: "Ընտրված նախագծեր", projectsTitle: "Լուծումներ, որոնցով հպարտանում ենք", category: ["ՏՏ", "ՏՏ", "Կրեատիվ", "Կրեատիվ", "Վերլուծություն", "Վերլուծություն", "ՏՏ", "ՏՏ", "Կրեատիվ"] },
  bg: { title: "Увеличаваме", terms: ["продажбите", "конверсията", "печалбата", "скоростта"], text: "Създаваме сайтове, CRM системи и анализи, които превръщат повече запитвания в продажби и дават на ръководителите ясни данни.", kpiLabel: "Ръст на целевото действие", kpiNote: "след внедряване на системата", projectsEyebrow: "Избрани проекти", projectsTitle: "Решения, с които се гордеем", category: ["ИТ", "ИТ", "Креатив", "Креатив", "Анализи", "Анализи", "ИТ", "ИТ", "Креатив"] },
} as const;

const productContent = {
  ru: { title: "Продукты Agile Business", intro: "Отдельные цифровые продукты компании. Листайте вправо, чтобы посмотреть возможности каждого.", items: [{ slug: "agile-call", title: "Agile Call", label: "Коммуникации", description: "Единое рабочее пространство для звонков, сообщений и истории взаимодействия с клиентом.", features: ["Омниканальные обращения", "Карточка клиента", "Контроль качества"], more: "Подробнее о продукте" }, { slug: "agile-kpi", title: "Agile KPI", label: "Управление", description: "Показатели компании, команд и сотрудников в одном управленческом контуре.", features: ["Единая система KPI", "Динамика показателей", "Роли и ответственность"], more: "Подробнее о продукте" }] },
  en: { title: "Agile Business products", intro: "Standalone digital products by our team. Scroll right to explore each one.", items: [{ slug: "agile-call", title: "Agile Call", label: "Communications", description: "One workspace for calls, messages and the complete customer interaction history.", features: ["Omnichannel requests", "Customer profile", "Quality control"], more: "Explore product" }, { slug: "agile-kpi", title: "Agile KPI", label: "Management", description: "Company, team and employee metrics in a single management system.", features: ["Unified KPI system", "Performance trends", "Roles and ownership"], more: "Explore product" }] },
  hy: { title: "Agile Business-ի արտադրանքները", intro: "Ընկերության առանձին թվային արտադրանքները։ Սահեցրեք աջ՝ յուրաքանչյուրի հնարավորությունները տեսնելու համար։", items: [{ slug: "agile-call", title: "Agile Call", label: "Հաղորդակցություն", description: "Զանգերի, հաղորդագրությունների և հաճախորդների հետ աշխատանքի ամբողջ պատմության միասնական միջավայր։", features: ["Բազմաալիք դիմումներ", "Հաճախորդի քարտ", "Որակի վերահսկում"], more: "Մանրամասն" }, { slug: "agile-kpi", title: "Agile KPI", label: "Կառավարում", description: "Ընկերության, թիմերի և աշխատակիցների ցուցանիշները մեկ կառավարման համակարգում։", features: ["Միասնական KPI համակարգ", "Ցուցանիշների դինամիկա", "Դերեր և պատասխանատվություն"], more: "Մանրամասն" }] },
} as const;

const projectContent = {
  ru: { label: "Проекты", intro: "Реальные запущенные продукты — смотрите desktop и мобильную композицию каждого проекта.", items: [
    { slug: "13auto", title: "13AUTO", label: "E-commerce", year: "2026", image: "/projects/real/13auto-desktop.jpg", url: "https://13auto-storefront.vercel.app/", description: "Каталог автозапчастей с подбором, личным кабинетом и прозрачным сценарием заказа.", features: ["UX/UI", "Каталог", "Личный кабинет"], more: "Открыть сайт" },
    { slug: "prokub", title: "Прокуб", label: "B2B platform", year: "2026", image: "/projects/real/prokub-desktop.jpg", url: "https://prokub-rf.vercel.app/", description: "Прайс-платформа бетона с доставкой, быстрым расчётом и заявками.", features: ["Продуктовая структура", "Расчёт", "Адаптив"], more: "Открыть сайт" },
    { slug: "profist", title: "Профист", label: "Industry", year: "2026", image: "/projects/real/profist-desktop.jpg", url: "https://profist-rf.vercel.app/", description: "Каталог металлопроката с подбором продукции под конкретную бизнес-задачу.", features: ["Каталог", "Лидогенерация", "UI-система"], more: "Открыть сайт" },
    { slug: "dianafarm", title: "Dianafarm", label: "International", year: "2026", image: "/projects/real/dianafarm-desktop.jpg", url: "https://dianafarm.group/", description: "Международная платформа по ВНЖ, недвижимости и сопровождению бизнеса.", features: ["Мультиязычность", "Контент", "Конверсия"], more: "Открыть сайт" },
    { slug: "boostmarine", title: "Boost Marine", label: "Service", year: "2026", image: "/projects/real/boostmarine-desktop.jpg", url: "https://boostmarine.ru/", description: "Сервисный сайт по ремонту водной техники с понятной навигацией по услугам.", features: ["Структура услуг", "Заявки", "SEO"], more: "Открыть сайт" },
    { slug: "royal-horse", title: "Royal Horse", label: "Hospitality", year: "2026", image: "/projects/real/royal-horse-desktop.jpg", url: "https://royal-horse-lake.vercel.app/contacts", description: "Премиальный сайт конно-спортивного комплекса с выразительной атмосферой бренда.", features: ["Art direction", "Адаптив", "Контакты"], more: "Открыть сайт" },
    { slug: "beef-flame", title: "Beefshteks", label: "Food delivery", year: "2026", image: "/projects/real/beef-flame-desktop.jpg", url: "https://beef-flame.vercel.app/", description: "Интерфейс доставки бургеров с яркой продуктовой подачей и быстрым заказом.", features: ["Меню", "Корзина", "Mobile UX"], more: "Открыть сайт" },
  ] },
  en: { label: "Projects", intro: "Live digital products presented in desktop and compact mobile compositions.", items: [
    { slug: "13auto", title: "13AUTO", label: "E-commerce", year: "2026", image: "/projects/real/13auto-desktop.jpg", url: "https://13auto-storefront.vercel.app/", description: "Automotive parts catalogue with product matching, account tools and a clear order journey.", features: ["UX/UI", "Catalogue", "Account"], more: "Open website" },
    { slug: "prokub", title: "Prokub", label: "B2B platform", year: "2026", image: "/projects/real/prokub-desktop.jpg", url: "https://prokub-rf.vercel.app/", description: "Concrete pricing platform with delivery calculation and a focused lead flow.", features: ["Product structure", "Calculator", "Responsive"], more: "Open website" },
    { slug: "profist", title: "Profist", label: "Industry", year: "2026", image: "/projects/real/profist-desktop.jpg", url: "https://profist-rf.vercel.app/", description: "Metal products catalogue designed around precise business requirements.", features: ["Catalogue", "Lead generation", "UI system"], more: "Open website" },
    { slug: "dianafarm", title: "Dianafarm", label: "International", year: "2026", image: "/projects/real/dianafarm-desktop.jpg", url: "https://dianafarm.group/", description: "International residence, property and business support platform.", features: ["Multilingual", "Content", "Conversion"], more: "Open website" },
    { slug: "boostmarine", title: "Boost Marine", label: "Service", year: "2026", image: "/projects/real/boostmarine-desktop.jpg", url: "https://boostmarine.ru/", description: "Marine repair service website with a clear service architecture.", features: ["Service structure", "Leads", "SEO"], more: "Open website" },
    { slug: "royal-horse", title: "Royal Horse", label: "Hospitality", year: "2026", image: "/projects/real/royal-horse-desktop.jpg", url: "https://royal-horse-lake.vercel.app/contacts", description: "Premium equestrian complex website with a strong branded atmosphere.", features: ["Art direction", "Responsive", "Contacts"], more: "Open website" },
    { slug: "beef-flame", title: "Beefshteks", label: "Food delivery", year: "2026", image: "/projects/real/beef-flame-desktop.jpg", url: "https://beef-flame.vercel.app/", description: "Burger delivery interface built for vivid presentation and fast ordering.", features: ["Menu", "Cart", "Mobile UX"], more: "Open website" },
  ] },
  hy: { label: "Նախագծեր", intro: "Իրական գործարկված թվային նախագծեր՝ desktop և mobile կոմպոզիցիաներով։", items: [
    { slug: "13auto", title: "13AUTO", label: "E-commerce", year: "2026", image: "/projects/real/13auto-desktop.jpg", url: "https://13auto-storefront.vercel.app/", description: "Ավտոպահեստամասերի կատալոգ՝ ընտրությամբ, անձնական էջով և պարզ պատվերով։", features: ["UX/UI", "Կատալոգ", "Անձնական էջ"], more: "Բացել կայքը" },
    { slug: "prokub", title: "Прокуб", label: "B2B platform", year: "2026", image: "/projects/real/prokub-desktop.jpg", url: "https://prokub-rf.vercel.app/", description: "Բետոնի գնային հարթակ՝ առաքման հաշվարկով և արագ հայտերով։", features: ["Կառուցվածք", "Հաշվարկ", "Ադապտիվ"], more: "Բացել կայքը" },
    { slug: "profist", title: "Профист", label: "Industry", year: "2026", image: "/projects/real/profist-desktop.jpg", url: "https://profist-rf.vercel.app/", description: "Մետաղական արտադրանքի կատալոգ՝ բիզնես խնդրին համապատասխան ընտրությամբ։", features: ["Կատալոգ", "Հայտեր", "UI համակարգ"], more: "Բացել կայքը" },
    { slug: "dianafarm", title: "Dianafarm", label: "International", year: "2026", image: "/projects/real/dianafarm-desktop.jpg", url: "https://dianafarm.group/", description: "Միջազգային հարթակ՝ կացության, անշարժ գույքի և բիզնեսի աջակցության համար։", features: ["Բազմալեզու", "Կոնտենտ", "Կոնվերսիա"], more: "Բացել կայքը" },
    { slug: "boostmarine", title: "Boost Marine", label: "Service", year: "2026", image: "/projects/real/boostmarine-desktop.jpg", url: "https://boostmarine.ru/", description: "Ջրային տեխնիկայի վերանորոգման ծառայությունների հստակ կայք։", features: ["Ծառայություններ", "Հայտեր", "SEO"], more: "Բացել կայքը" },
    { slug: "royal-horse", title: "Royal Horse", label: "Hospitality", year: "2026", image: "/projects/real/royal-horse-desktop.jpg", url: "https://royal-horse-lake.vercel.app/contacts", description: "Պրեմիում ձիասպորտի համալիրի արտահայտիչ բրենդային կայք։", features: ["Art direction", "Ադապտիվ", "Կոնտակտներ"], more: "Բացել կայքը" },
    { slug: "beef-flame", title: "Beefshteks", label: "Food delivery", year: "2026", image: "/projects/real/beef-flame-desktop.jpg", url: "https://beef-flame.vercel.app/", description: "Բուրգերների առաքման վառ ինտերֆեյս՝ արագ պատվերի սցենարով։", features: ["Մենյու", "Զամբյուղ", "Mobile UX"], more: "Բացել կայքը" },
  ] },
} as const;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = getDictionary(locale);
  const home = homeContent[locale];
  const products = productContent[locale === "ru" || locale === "hy" ? locale : "en"];
  const projects = projectContent[locale === "ru" || locale === "hy" ? locale : "en"];
  const productTabLabel = locale === "ru" ? "Продукты" : locale === "hy" ? "Արտադրանքներ" : "Products";

  return (
    <>
      <AnimatedHero title={home.title} terms={home.terms} text={home.text} primary={d.hero.primary} secondary={d.hero.secondary} primaryHref={`/${locale}/calculator`} secondaryHref={`/${locale}/services`} kpiLabel={home.kpiLabel} kpiNote={home.kpiNote} />
      <ProductShowcase locale={locale} groups={[{ id: "products", label: productTabLabel, intro: products.intro, items: products.items }, { id: "projects", label: projects.label, intro: projects.intro, items: projects.items }]} />
      <section className="stats shell" aria-label="Key facts">
        {d.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>
      <KineticServices title={d.services.title} text={d.services.text} items={d.services.items} href={`/${locale}/services`} linkLabel={d.nav.services} />
      <section className="section section-dark">
        <div className="shell"><header className="section-heading"><h2>{d.method.title}</h2></header>
          <ol className="method-grid">{d.method.steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </div>
      </section>
      <section className="cta shell"><h2>{d.cta.title}</h2><p>{d.cta.text}</p><Link className="button" href={`/${locale}/contacts`}>{d.cta.button}</Link></section>
    </>
  );
}
