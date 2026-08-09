import type { Locale } from "@/lib/i18n";

export type CatalogService = {
  id: string;
  title: string;
  category: string;
  summary: string;
  price: number;
  duration: string;
  features: readonly string[];
  recommended?: boolean;
  consultation?: boolean;
  custom?: boolean;
};

type ServiceBase = Omit<CatalogService, "title" | "category" | "summary" | "duration" | "features">;

const BASE: readonly ServiceBase[] = [
  { id: "consultation", price: 0, consultation: true, recommended: true },
  { id: "custom-project", price: 100_000, custom: true },
  { id: "business-card", price: 90_000 },
  { id: "landing", price: 110_000, recommended: true },
  { id: "corporate", price: 140_000 },
  { id: "ecommerce", price: 220_000 },
  { id: "crm-mvp", price: 280_000 },
  { id: "bi-dashboard", price: 150_000 },
  { id: "business-audit", price: 80_000 },
  { id: "growth-strategy", price: 110_000 },
] as const;

type Copy = Omit<CatalogService, keyof ServiceBase>;

const COPY: Record<Locale, readonly Copy[]> = {
  ru: [
    { title: "Стартовая консультация", category: "Знакомство", summary: "За 30 минут разберём задачу, обозначим реалистичный формат запуска и следующий шаг без обязательств.", duration: "30 минут", features: ["Разбор задачи", "Оценка формата", "Следующий шаг"] },
    { title: "Индивидуальный проект", category: "Под вашу задачу", summary: "Соберите нестандартное решение из нужных функций, интеграций и этапов — калькулятор подготовит ориентир по бюджету.", duration: "от 4 недель", features: ["Персональный состав", "Расчёт бюджета", "Технический план"] },
    { title: "Сайт-визитка", category: "Сайты", summary: "Компактный имиджевый сайт с уникальным дизайном, базовым SEO и формой заявки.", duration: "3–4 недели", features: ["До 7 экранов", "Адаптив", "Базовое SEO"] },
    { title: "Конверсионный лендинг", category: "Сайты", summary: "Посадочная страница под рекламу с аналитикой, сильным оффером и продуманным сценарием заявки.", duration: "4–6 недель", features: ["UX-прототип", "Авторский UI", "Аналитика"] },
    { title: "Корпоративный сайт", category: "Сайты", summary: "Многостраничная система для услуг, команды, кейсов и органического привлечения клиентов.", duration: "7–10 недель", features: ["CMS", "Мультиязычность", "SEO-структура"] },
    { title: "Интернет-магазин", category: "E-commerce", summary: "Каталог, корзина, личный кабинет и интеграции для полноценной онлайн-продажи.", duration: "10–14 недель", features: ["Каталог", "Корзина", "Интеграции"] },
    { title: "CRM-система — MVP", category: "IT-разработка", summary: "Первый рабочий релиз CRM под ваши процессы: клиенты, сделки, роли и ключевые интеграции.", duration: "12–18 недель", features: ["Карта процессов", "Роли", "API-интеграции"] },
    { title: "BI-дашборд", category: "Аналитика", summary: "Управленческие показатели из нескольких источников в одном понятном интерфейсе.", duration: "5–8 недель", features: ["Модель данных", "KPI", "Автообновление"] },
    { title: "Аудит бизнес-процессов", category: "Консалтинг", summary: "Находим потери в воронке, операциях и данных и формируем план изменений с приоритетами.", duration: "3–5 недель", features: ["Интервью", "Карта AS IS", "План TO BE"] },
    { title: "Стратегия роста", category: "Консалтинг", summary: "Собираем продуктовую, маркетинговую и цифровую стратегию вокруг измеримой бизнес-цели.", duration: "4–6 недель", features: ["Диагностика", "Roadmap", "Экономика"] },
  ],
  en: [
    { title: "Introductory consultation", category: "Discovery", summary: "In 30 minutes we will clarify the task, suggest a realistic launch format and define the next step with no obligation.", duration: "30 minutes", features: ["Task review", "Format estimate", "Next step"] },
    { title: "Custom project", category: "Built around you", summary: "Combine the functions, integrations and stages your business needs, then use the estimator to get a realistic budget range.", duration: "from 4 weeks", features: ["Custom scope", "Budget estimate", "Technical plan"] },
    { title: "Business website", category: "Web", summary: "A compact brand website with custom design, baseline SEO and a focused lead form.", duration: "3–4 weeks", features: ["Up to 7 sections", "Responsive", "Baseline SEO"] },
    { title: "Conversion landing page", category: "Web", summary: "A campaign landing page with analytics, a clear offer and a carefully designed lead journey.", duration: "4–6 weeks", features: ["UX prototype", "Custom UI", "Analytics"] },
    { title: "Corporate website", category: "Web", summary: "A scalable content system for services, team, cases and organic client acquisition.", duration: "7–10 weeks", features: ["CMS", "Multilingual", "SEO structure"] },
    { title: "E-commerce platform", category: "E-commerce", summary: "Catalogue, cart, customer account and integrations for end-to-end online sales.", duration: "10–14 weeks", features: ["Catalogue", "Cart", "Integrations"] },
    { title: "Custom CRM — MVP", category: "Development", summary: "A first working CRM release built around your processes, roles and core integrations.", duration: "12–18 weeks", features: ["Process map", "Roles", "API integrations"] },
    { title: "BI dashboard", category: "Analytics", summary: "Management indicators from multiple sources in one clear operational interface.", duration: "5–8 weeks", features: ["Data model", "KPIs", "Auto refresh"] },
    { title: "Business process audit", category: "Consulting", summary: "We locate losses across the funnel, operations and data, then prioritise improvements.", duration: "3–5 weeks", features: ["Interviews", "AS IS map", "TO BE plan"] },
    { title: "Growth strategy", category: "Consulting", summary: "Product, marketing and digital strategy aligned around one measurable business target.", duration: "4–6 weeks", features: ["Diagnosis", "Roadmap", "Economics"] },
  ],
  hy: [
    { title: "Մեկնարկային խորհրդատվություն", category: "Ծանոթացում", summary: "30 րոպեում կհստակեցնենք խնդիրը, կառաջարկենք իրատեսական մեկնարկ և հաջորդ քայլը՝ առանց պարտավորության։", duration: "30 րոպե", features: ["Խնդրի վերլուծություն", "Ձևաչափի գնահատում", "Հաջորդ քայլ"] },
    { title: "Անհատական նախագիծ", category: "Ձեր խնդրի համար", summary: "Միավորեք անհրաժեշտ գործառույթները, ինտեգրումները և փուլերը, իսկ հաշվիչը կտա բյուջեի իրատեսական միջակայք։", duration: "4 շաբաթից", features: ["Անհատական կազմ", "Բյուջեի հաշվարկ", "Տեխնիկական պլան"] },
    { title: "Ներկայացուցչական կայք", category: "Կայքեր", summary: "Կոմպակտ բրենդային կայք՝ անհատական դիզայնով, SEO-ով և հայտի ձևով։", duration: "3–4 շաբաթ", features: ["Մինչև 7 բաժին", "Ադապտիվ", "Բազային SEO"] },
    { title: "Կոնվերսիոն լենդինգ", category: "Կայքեր", summary: "Գովազդային էջ՝ ուժեղ առաջարկով, վերլուծությամբ և հայտի հստակ սցենարով։", duration: "4–6 շաբաթ", features: ["UX նախատիպ", "Հեղինակային UI", "Վերլուծություն"] },
    { title: "Կորպորատիվ կայք", category: "Կայքեր", summary: "Բազմաէջ համակարգ ծառայությունների, թիմի, քեյսերի և SEO առաջխաղացման համար։", duration: "7–10 շաբաթ", features: ["CMS", "Բազմալեզու", "SEO կառուցվածք"] },
    { title: "Առցանց խանութ", category: "E-commerce", summary: "Կատալոգ, զամբյուղ, անձնական հաշիվ և ինտեգրումներ առցանց վաճառքի համար։", duration: "10–14 շաբաթ", features: ["Կատալոգ", "Զամբյուղ", "Ինտեգրումներ"] },
    { title: "CRM համակարգ — MVP", category: "ՏՏ մշակում", summary: "CRM-ի առաջին աշխատանքային թողարկումը՝ ձեր գործընթացների, դերերի և ինտեգրումների հիման վրա։", duration: "12–18 շաբաթ", features: ["Գործընթացների քարտեզ", "Դերեր", "API"] },
    { title: "BI դաշբորդ", category: "Վերլուծություն", summary: "Տարբեր աղբյուրների կառավարման ցուցանիշները մեկ հասկանալի ինտերֆեյսում։", duration: "5–8 շաբաթ", features: ["Տվյալների մոդել", "KPI", "Ավտոթարմացում"] },
    { title: "Բիզնես գործընթացների աուդիտ", category: "Խորհրդատվություն", summary: "Գտնում ենք կորուստները և կազմում առաջնահերթ փոփոխությունների ծրագիր։", duration: "3–5 շաբաթ", features: ["Հարցազրույցներ", "AS IS", "TO BE"] },
    { title: "Աճի ռազմավարություն", category: "Խորհրդատվություն", summary: "Ապրանքային, մարքեթինգային և թվային ռազմավարություն՝ չափելի նպատակի շուրջ։", duration: "4–6 շաբաթ", features: ["Ախտորոշում", "Roadmap", "Տնտեսագիտություն"] },
  ],
  ka: [
    { title: "საწყისი კონსულტაცია", category: "გაცნობა", summary: "30 წუთში განვიხილავთ ამოცანას, შევარჩევთ რეალისტურ სტარტს და შემდეგ ნაბიჯს ვალდებულების გარეშე.", duration: "30 წუთი", features: ["ამოცანის განხილვა", "ფორმატის შეფასება", "შემდეგი ნაბიჯი"] },
    { title: "ინდივიდუალური პროექტი", category: "თქვენს ამოცანაზე", summary: "შეაერთეთ საჭირო ფუნქციები, ინტეგრაციები და ეტაპები, ხოლო კალკულატორი რეალისტურ ბიუჯეტს დაგითვლით.", duration: "4 კვირიდან", features: ["ინდივიდუალური შემადგენლობა", "ბიუჯეტის შეფასება", "ტექნიკური გეგმა"] },
    { title: "სავიზიტო საიტი", category: "ვებგვერდები", summary: "კომპაქტური ბრენდული საიტი უნიკალური დიზაინით, საბაზისო SEO-თი და განაცხადის ფორმით.", duration: "3–4 კვირა", features: ["7-მდე სექცია", "ადაპტივი", "საბაზისო SEO"] },
    { title: "კონვერსიული ლენდინგი", category: "ვებგვერდები", summary: "სარეკლამო გვერდი ძლიერი შეთავაზებით, ანალიტიკით და განაცხადის მკაფიო გზით.", duration: "4–6 კვირა", features: ["UX პროტოტიპი", "ავტორული UI", "ანალიტიკა"] },
    { title: "კორპორაციული საიტი", category: "ვებგვერდები", summary: "მრავალგვერდიანი სისტემა სერვისებისთვის, გუნდისთვის, ქეისებისა და SEO-სთვის.", duration: "7–10 კვირა", features: ["CMS", "მრავალენოვანი", "SEO სტრუქტურა"] },
    { title: "ონლაინ მაღაზია", category: "E-commerce", summary: "კატალოგი, კალათა, პირადი კაბინეტი და ინტეგრაციები ონლაინ გაყიდვებისთვის.", duration: "10–14 კვირა", features: ["კატალოგი", "კალათა", "ინტეგრაციები"] },
    { title: "CRM სისტემა — MVP", category: "IT განვითარება", summary: "CRM-ის პირველი სამუშაო რელიზი თქვენი პროცესების, როლებისა და ინტეგრაციების მიხედვით.", duration: "12–18 კვირა", features: ["პროცესების რუკა", "როლები", "API"] },
    { title: "BI დაფა", category: "ანალიტიკა", summary: "მმართველობითი მაჩვენებლები სხვადასხვა წყაროდან ერთ გასაგებ ინტერფეისში.", duration: "5–8 კვირა", features: ["მონაცემთა მოდელი", "KPI", "ავტოგანახლება"] },
    { title: "ბიზნეს პროცესების აუდიტი", category: "კონსალტინგი", summary: "ვპოულობთ დანაკარგებს და ვადგენთ პრიორიტეტული ცვლილებების გეგმას.", duration: "3–5 კვირა", features: ["ინტერვიუები", "AS IS", "TO BE"] },
    { title: "ზრდის სტრატეგია", category: "კონსალტინგი", summary: "პროდუქტის, მარკეტინგისა და ციფრული სტრატეგია გაზომვადი მიზნის გარშემო.", duration: "4–6 კვირა", features: ["დიაგნოსტიკა", "Roadmap", "ეკონომიკა"] },
  ],
  bg: [
    { title: "Начална консултация", category: "Запознаване", summary: "За 30 минути ще уточним задачата, реалистичния формат за старт и следващата стъпка без ангажимент.", duration: "30 минути", features: ["Преглед на задачата", "Оценка на формата", "Следваща стъпка"] },
    { title: "Индивидуален проект", category: "По ваша задача", summary: "Комбинирайте нужните функции, интеграции и етапи, а калкулаторът ще даде реалистичен бюджетен диапазон.", duration: "от 4 седмици", features: ["Персонален обхват", "Оценка на бюджета", "Технически план"] },
    { title: "Представителен сайт", category: "Уеб", summary: "Компактен бранд сайт с уникален дизайн, базово SEO и форма за запитване.", duration: "3–4 седмици", features: ["До 7 секции", "Адаптивен", "Базово SEO"] },
    { title: "Конверсионен лендинг", category: "Уеб", summary: "Рекламна страница със силна оферта, аналитика и ясен път към запитването.", duration: "4–6 седмици", features: ["UX прототип", "Авторски UI", "Аналитика"] },
    { title: "Корпоративен сайт", category: "Уеб", summary: "Многостранична система за услуги, екип, казуси и органично привличане.", duration: "7–10 седмици", features: ["CMS", "Многоезичност", "SEO структура"] },
    { title: "Онлайн магазин", category: "E-commerce", summary: "Каталог, количка, клиентски профил и интеграции за онлайн продажби.", duration: "10–14 седмици", features: ["Каталог", "Количка", "Интеграции"] },
    { title: "CRM система — MVP", category: "IT разработка", summary: "Първа работеща версия на CRM според вашите процеси, роли и интеграции.", duration: "12–18 седмици", features: ["Карта на процесите", "Роли", "API"] },
    { title: "BI табло", category: "Аналитика", summary: "Управленски показатели от различни източници в един ясен интерфейс.", duration: "5–8 седмици", features: ["Модел на данните", "KPI", "Автообновяване"] },
    { title: "Одит на бизнес процеси", category: "Консултиране", summary: "Откриваме загубите и подреждаме план за промени по приоритет.", duration: "3–5 седмици", features: ["Интервюта", "AS IS", "TO BE"] },
    { title: "Стратегия за растеж", category: "Консултиране", summary: "Продуктова, маркетингова и дигитална стратегия около измерима цел.", duration: "4–6 седмици", features: ["Диагностика", "Roadmap", "Икономика"] },
  ],
};

export function getServiceCatalog(locale: Locale): readonly CatalogService[] {
  return BASE.map((service, index) => ({ ...service, ...COPY[locale][index] }));
}

export function getPricedServices(ids: readonly string[]) {
  const uniqueIds = [...new Set(ids)];
  return uniqueIds.map((id) => BASE.find((service) => service.id === id)).filter((service): service is ServiceBase => Boolean(service));
}
