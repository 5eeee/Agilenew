import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedHero } from "@/components/animated-hero";
import { ProductShowcase } from "@/components/product-showcase";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

const homeContent = {
  ru: { title: "Создаём", terms: ["сайты", "CRM-системы", "цифровые продукты", "стратегии роста"], modeOne: "Консалтинг и проекты под ключ для бизнеса", modeTwo: "Собственные продукты для команд и руководителей", projectsEyebrow: "Выбранные проекты", projectsTitle: "Решения, которыми мы гордимся", category: ["IT", "IT", "Креатив", "Креатив", "Аналитика", "Аналитика", "IT", "IT", "Креатив"] },
  en: { title: "We create", terms: ["websites", "CRM systems", "digital products", "growth strategies"], modeOne: "Turnkey consulting and projects for business", modeTwo: "Our products for teams and leaders", projectsEyebrow: "Selected projects", projectsTitle: "Solutions we are proud of", category: ["IT", "IT", "Creative", "Creative", "Analytics", "Analytics", "IT", "IT", "Creative"] },
  ka: { title: "ვქმნით", terms: ["ვებსაიტებს", "CRM სისტემებს", "BI ანალიტიკას", "IT პროდუქტებს", "ზრდის სტრატეგიებს"], modeOne: "კონსალტინგი და პროექტები ბიზნესისთვის", modeTwo: "პროდუქტები გუნდებისა და ლიდერებისთვის", projectsEyebrow: "რჩეული პროექტები", projectsTitle: "გადაწყვეტილებები, რომლებითაც ვამაყობთ", category: ["IT", "IT", "კრეატივი", "კრეატივი", "ანალიტიკა", "ანალიტიკა", "IT", "IT", "კრეატივი"] },
  hy: { title: "Ստեղծում ենք", terms: ["կայքեր", "CRM համակարգեր", "թվային արտադրանք", "աճի ռազմավարություններ"], modeOne: "Խորհրդատվություն և ամբողջական նախագծեր բիզնեսի համար", modeTwo: "Մեր արտադրանքը թիմերի և ղեկավարների համար", projectsEyebrow: "Ընտրված նախագծեր", projectsTitle: "Լուծումներ, որոնցով հպարտանում ենք", category: ["ՏՏ", "ՏՏ", "Կրեատիվ", "Կրեատիվ", "Վերլուծություն", "Վերլուծություն", "ՏՏ", "ՏՏ", "Կրեատիվ"] },
  bg: { title: "Създаваме", terms: ["уебсайтове", "CRM системи", "BI анализи", "ИТ продукти", "стратегии за растеж"], modeOne: "Консултиране и цялостни проекти за бизнеса", modeTwo: "Наши продукти за екипи и ръководители", projectsEyebrow: "Избрани проекти", projectsTitle: "Решения, с които се гордеем", category: ["ИТ", "ИТ", "Креатив", "Креатив", "Анализи", "Анализи", "ИТ", "ИТ", "Креатив"] },
} as const;

const productContent = {
  ru: { title: "Продукты Agile Business", intro: "Отдельные цифровые продукты компании. Листайте вправо, чтобы посмотреть возможности каждого.", items: [{ slug: "agile-call", title: "Agile Call", label: "Коммуникации", description: "Единое рабочее пространство для звонков, сообщений и истории взаимодействия с клиентом.", features: ["Омниканальные обращения", "Карточка клиента", "Контроль качества"], more: "Подробнее о продукте" }, { slug: "agile-kpi", title: "Agile KPI", label: "Управление", description: "Показатели компании, команд и сотрудников в одном управленческом контуре.", features: ["Единая система KPI", "Динамика показателей", "Роли и ответственность"], more: "Подробнее о продукте" }] },
  en: { title: "Agile Business products", intro: "Standalone digital products by our team. Scroll right to explore each one.", items: [{ slug: "agile-call", title: "Agile Call", label: "Communications", description: "One workspace for calls, messages and the complete customer interaction history.", features: ["Omnichannel requests", "Customer profile", "Quality control"], more: "Explore product" }, { slug: "agile-kpi", title: "Agile KPI", label: "Management", description: "Company, team and employee metrics in a single management system.", features: ["Unified KPI system", "Performance trends", "Roles and ownership"], more: "Explore product" }] },
  hy: { title: "Agile Business-ի արտադրանքները", intro: "Ընկերության առանձին թվային արտադրանքները։ Սահեցրեք աջ՝ յուրաքանչյուրի հնարավորությունները տեսնելու համար։", items: [{ slug: "agile-call", title: "Agile Call", label: "Հաղորդակցություն", description: "Զանգերի, հաղորդագրությունների և հաճախորդների հետ աշխատանքի ամբողջ պատմության միասնական միջավայր։", features: ["Բազմաալիք դիմումներ", "Հաճախորդի քարտ", "Որակի վերահսկում"], more: "Մանրամասն" }, { slug: "agile-kpi", title: "Agile KPI", label: "Կառավարում", description: "Ընկերության, թիմերի և աշխատակիցների ցուցանիշները մեկ կառավարման համակարգում։", features: ["Միասնական KPI համակարգ", "Ցուցանիշների դինամիկա", "Դերեր և պատասխանատվություն"], more: "Մանրամասն" }] },
} as const;

const projectContent = {
  ru: { label: "Проекты", intro: "Выбранные кейсы: от стратегии и архитектуры до запуска и сопровождения.", items: [
    { slug: "corporate-site", title: "Корпоративный сайт", label: "Web-проект", description: "Имиджевая цифровая платформа с понятной продуктовой структурой.", features: ["Прототип и UX", "Дизайн-система", "SEO и админка"], more: "Смотреть кейс" },
    { slug: "crm", title: "CRM-интеграция", label: "Автоматизация", description: "Единый контур продаж, коммуникаций и контроля клиентского пути.", features: ["Аудит процессов", "Интеграции", "Отчётность и роли"], more: "Смотреть кейс" },
    { slug: "strategy", title: "Стратегия роста", label: "Консалтинг", description: "Сценарий роста с приоритетами, метриками и понятной дорожной картой.", features: ["Диагностика", "Точки роста", "План внедрения"], more: "Смотреть кейс" },
  ] },
  en: { label: "Projects", intro: "Selected cases, from strategy and architecture through launch and ongoing support.", items: [
    { slug: "corporate-site", title: "Corporate website", label: "Web project", description: "A brand platform with a clear product structure and scalable content system.", features: ["Prototype and UX", "Design system", "SEO and admin"], more: "View case" },
    { slug: "crm", title: "CRM integration", label: "Automation", description: "One environment for sales, communications and customer journey control.", features: ["Process audit", "Integrations", "Reports and roles"], more: "View case" },
    { slug: "strategy", title: "Growth strategy", label: "Consulting", description: "A growth scenario with priorities, metrics and a clear implementation roadmap.", features: ["Diagnostics", "Growth levers", "Implementation plan"], more: "View case" },
  ] },
  hy: { label: "Նախագծեր", intro: "Ընտրված դեպքեր՝ ռազմավարությունից և կառուցվածքից մինչև գործարկում։", items: [
    { slug: "corporate-site", title: "Կորպորատիվ կայք", label: "Web նախագիծ", description: "Բրենդային հարթակ՝ հստակ արտադրանքային կառուցվածքով։", features: ["Նախատիպ և UX", "Դիզայն համակարգ", "SEO և ադմին"], more: "Դիտել դեպքը" },
    { slug: "crm", title: "CRM ինտեգրում", label: "Ավտոմատացում", description: "Վաճառքի, հաղորդակցության և հախախորդի ուղու միասնական միջավայր։", features: ["Գործընթացների աուդիտ", "Ինտեգրումներ", "Հաշվետվություն"], more: "Դիտել դեպքը" },
    { slug: "strategy", title: "Աճի ռազմավարություն", label: "Խորհրդատվություն", description: "Աճի սցենար՝ առաջնահերթություններով, չափանիշներով և ճանապարհային քարտեզով։", features: ["Ախտորոշում", "Աճի կետեր", "Իրականացման պլան"], more: "Դիտել դեպքը" },
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
      <AnimatedHero title={home.title} terms={home.terms} text={d.hero.text} primary={d.hero.primary} secondary={d.hero.secondary} primaryHref={`/${locale}/calculator`} secondaryHref={`/${locale}/services`} modeOne={home.modeOne} modeTwo={home.modeTwo} />
      <ProductShowcase locale={locale} groups={[{ id: "products", label: productTabLabel, intro: products.intro, items: products.items }, { id: "projects", label: projects.label, intro: projects.intro, items: projects.items }]} />
      <section className="stats shell" aria-label="Key facts">
        {d.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </section>
      <section className="section shell">
        <header className="section-heading"><h2>{d.services.title}</h2><p>{d.services.text}</p></header>
        <div className="service-list">
          {d.services.items.map(([number, title, text]) => (
            <article key={number}><div className="service-card-top"><span>{number}</span><span className="service-orbit" aria-hidden="true"><i /></span></div><h3>{title}</h3><p>{text}</p><Link href={`/${locale}/services`} aria-label={`${title}: ${d.nav.services}`}>{d.nav.services}<span>↗</span></Link></article>
          ))}
        </div>
      </section>
      <section className="section section-dark">
        <div className="shell"><header className="section-heading"><h2>{d.method.title}</h2></header>
          <ol className="method-grid">{d.method.steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
        </div>
      </section>
      <section className="cta shell"><h2>{d.cta.title}</h2><p>{d.cta.text}</p><Link className="button" href={`/${locale}/contacts`}>{d.cta.button}</Link></section>
    </>
  );
}
