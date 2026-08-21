import type { Locale } from "@/lib/i18n";

export type CatalogService = {
  id: string;
  title: string;
  category: string;
  summary: string;
  price: number;
  duration: string;
  features: readonly string[];
  priceLabel?: string;
  tiers?: readonly {
    label: string;
    price: string;
  }[];
  recommended?: boolean;
  consultation?: boolean;
  custom?: boolean;
};

type ServiceBase = Pick<CatalogService, "id" | "price" | "recommended" | "consultation" | "custom">;

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
  pl: [
    { title: "Konsultacja wstępna", category: "Rozpoznanie potrzeb", summary: "W 30 minut doprecyzujemy wyzwanie, zaproponujemy realistyczny format startu i wskażemy kolejny krok — bez zobowiązań.", duration: "30 minut", features: ["Analiza wyzwania", "Ocena formatu", "Kolejny krok"] },
    { title: "Projekt indywidualny", category: "Dopasowany do potrzeb", summary: "Połącz potrzebne funkcje, integracje i etapy, a kalkulator wskaże realistyczny przedział budżetu.", duration: "od 4 tygodni", features: ["Indywidualny zakres", "Wycena budżetu", "Plan techniczny"] },
    { title: "Strona wizytówkowa", category: "WWW", summary: "Kompaktowa strona marki z indywidualnym projektem, podstawowym SEO i skutecznym formularzem kontaktowym.", duration: "3–4 tygodnie", features: ["Do 7 sekcji", "Responsywność", "Podstawowe SEO"] },
    { title: "Landing page nastawiony na konwersję", category: "WWW", summary: "Strona kampanii z analityką, wyrazistą ofertą i przemyślaną ścieżką pozyskania kontaktu.", duration: "4–6 tygodni", features: ["Prototyp UX", "Indywidualny UI", "Analityka"] },
    { title: "Strona firmowa", category: "WWW", summary: "Skalowalny serwis dla oferty, zespołu, realizacji i organicznego pozyskiwania klientów.", duration: "7–10 tygodni", features: ["CMS", "Wielojęzyczność", "Struktura SEO"] },
    { title: "Platforma e-commerce", category: "E-commerce", summary: "Katalog, koszyk, panel klienta i integracje potrzebne do pełnej sprzedaży internetowej.", duration: "10–14 tygodni", features: ["Katalog", "Koszyk", "Integracje"] },
    { title: "Dedykowany CRM — MVP", category: "Rozwój oprogramowania", summary: "Pierwsza działająca wersja CRM dostosowana do procesów, ról i najważniejszych integracji firmy.", duration: "12–18 tygodni", features: ["Mapa procesów", "Role", "Integracje API"] },
    { title: "Dashboard BI", category: "Analityka", summary: "Wskaźniki zarządcze z wielu źródeł w jednym czytelnym środowisku operacyjnym.", duration: "5–8 tygodni", features: ["Model danych", "KPI", "Automatyczne odświeżanie"] },
    { title: "Audyt procesów biznesowych", category: "Doradztwo", summary: "Wykrywamy straty w lejku, operacjach i danych, a następnie ustalamy priorytety zmian.", duration: "3–5 tygodni", features: ["Wywiady", "Mapa AS IS", "Plan TO BE"] },
    { title: "Strategia wzrostu", category: "Doradztwo", summary: "Łączymy strategię produktu, marketingu i technologii wokół jednego mierzalnego celu biznesowego.", duration: "4–6 tygodni", features: ["Diagnoza", "Plan działania", "Ekonomika"] },
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

const RU_DOCUMENT_SERVICES: readonly CatalogService[] = [
  { id: "consultation", title: "Стартовая консультация", category: "Знакомство", summary: "За 30 минут разберём задачу, обозначим реалистичный формат запуска и следующий шаг без обязательств.", price: 0, duration: "30 минут", features: ["Разбор задачи", "Оценка формата", "Следующий шаг"], consultation: true, recommended: true },
  { id: "custom-project", title: "Индивидуальный проект", category: "Под вашу задачу", summary: "Соберите нестандартное решение из нужных функций, интеграций и этапов — калькулятор подготовит ориентир по бюджету.", price: 100_000, duration: "от 4 недель", features: ["Персональный состав", "Расчёт бюджета", "Технический план"], custom: true },
  {
    id: "it-audit", title: "IT-аудит компании", category: "IT и разработка", price: 15_000, priceLabel: "15 000–70 000 ₽", duration: "от 1 недели",
    summary: "Независимая оценка IT-инфраструктуры, сервисов и процессов с поиском рисков и узких мест.",
    features: ["Инфраструктура и сервисы", "Риски и безопасность", "Отчёт с приоритетами"],
    tiers: [{ label: "Низкая", price: "15 000–25 000 ₽" }, { label: "Средняя", price: "25 000–45 000 ₽" }, { label: "Высокая", price: "45 000–70 000 ₽" }],
  },
  {
    id: "it-strategy", title: "Разработка IT-стратегии", category: "IT и разработка", price: 20_000, priceLabel: "20 000–90 000 ₽", duration: "от 2 недель",
    summary: "План развития IT на 1–3 года, связанный с целями, ресурсами и ограничениями бизнеса.",
    features: ["Целевая архитектура", "Этапы и зависимости", "Метрики успеха"],
    tiers: [{ label: "Низкая", price: "20 000–35 000 ₽" }, { label: "Средняя", price: "35 000–60 000 ₽" }, { label: "Высокая", price: "60 000–90 000 ₽" }],
  },
  {
    id: "digital-transformation", title: "Консалтинг по цифровой трансформации", category: "IT и разработка", price: 20_000, priceLabel: "20 000–95 000 ₽", duration: "от 2 недель",
    summary: "Перевод процессов и сервисов в управляемый цифровой контур без лишней автоматизации.",
    features: ["Карта AS IS / TO BE", "Сценарии и quick wins", "План внедрения"],
    tiers: [{ label: "Низкая", price: "20 000–35 000 ₽" }, { label: "Средняя", price: "35 000–65 000 ₽" }, { label: "Высокая", price: "65 000–95 000 ₽" }],
  },
  {
    id: "landing", title: "Лендинг", category: "Веб-разработка", price: 35_000, priceLabel: "35 000–250 000 ₽", duration: "от 3 недель", recommended: true,
    summary: "Одностраничный сайт с ясным предложением, адаптивом, аналитикой и сценарием заявки.",
    features: ["Структура и сценарий", "Адаптив и скорость", "Формы и аналитика"],
    tiers: [{ label: "Низкая", price: "35 000–80 000 ₽" }, { label: "Средняя", price: "60 000–150 000 ₽" }, { label: "Высокая", price: "70 000–250 000 ₽" }],
  },
  {
    id: "corporate-site", title: "Корпоративный сайт", category: "Веб-разработка", price: 50_000, priceLabel: "50 000–500 000 ₽", duration: "от 5 недель",
    summary: "Цифровое представительство компании для услуг, команды, кейсов и органического привлечения.",
    features: ["Архитектура и навигация", "Дизайн и CMS", "SEO и интеграции"],
    tiers: [{ label: "Низкая", price: "50 000–80 000 ₽" }, { label: "Средняя", price: "80 000–210 000 ₽" }, { label: "Высокая", price: "90 000–500 000 ₽" }],
  },
  {
    id: "ecommerce-platform", title: "Интернет-магазин", category: "Веб-разработка", price: 35_000, priceLabel: "35 000–1 000 000 ₽", duration: "от 6 недель",
    summary: "Каталог, поиск, корзина, заказ, оплата, доставка и личный кабинет в одной системе.",
    features: ["Каталог и поиск", "Заказ и оплата", "Админка и отчёты"],
    tiers: [{ label: "Низкая", price: "35 000–150 000 ₽" }, { label: "Средняя", price: "70 000–500 000 ₽" }, { label: "Высокая", price: "120 000–1 000 000 ₽" }],
  },
  {
    id: "saas-platform", title: "SaaS-платформа", category: "Веб-разработка", price: 80_000, priceLabel: "80 000–1 000 000 ₽", duration: "от 8 недель",
    summary: "Браузерный продукт с ролями, подписками, интеграциями и подготовкой к нагрузке.",
    features: ["Роли и сценарии", "API и интеграции", "Мониторинг и нагрузка"],
    tiers: [{ label: "Низкая", price: "80 000–210 000 ₽" }, { label: "Средняя", price: "110 000–350 000 ₽" }, { label: "Высокая", price: "160 000–1 000 000 ₽" }],
  },
  {
    id: "web-support", title: "Поддержка и развитие веб-проектов", category: "Веб-разработка", price: 10_000, priceLabel: "10 000–500 000 ₽", duration: "ежемесячно",
    summary: "Регулярная поддержка действующего продукта: исправления, развитие и контроль стабильности.",
    features: ["Оценка и backlog", "Исправления и обновления", "Инциденты и SLA"],
    tiers: [{ label: "Низкая", price: "10 000–80 000 ₽" }, { label: "Средняя", price: "30 000–150 000 ₽" }, { label: "Высокая", price: "50 000–500 000 ₽" }],
  },
  {
    id: "cross-platform-app", title: "Кроссплатформенные приложения", category: "Мобильная разработка", price: 50_000, priceLabel: "50 000–500 000+ ₽", duration: "от 6 недель",
    summary: "Приложения для iOS и Android с общей кодовой базой и единым продуктовым сценарием.",
    features: ["UX-сценарии", "Push, offline и geo", "Backend и аналитика"],
    tiers: [{ label: "Низкая", price: "50 000–100 000 ₽" }, { label: "Средняя", price: "120 000–180 000 ₽" }, { label: "Высокая", price: "200 000–500 000+ ₽" }],
  },
  {
    id: "crm-erp", title: "CRM / ERP веб-системы", category: "Корпоративные системы", price: 100_000, priceLabel: "100 000–500 000+ ₽", duration: "от 8 недель",
    summary: "Рабочая система для продаж, заказов, производства, учёта и управленческой отчётности.",
    features: ["Сущности и роли", "Воронки и автоматизация", "Отчёты и интеграции"],
    tiers: [{ label: "Низкая", price: "100 000–140 000 ₽" }, { label: "Средняя", price: "170 000–230 000 ₽" }, { label: "Высокая", price: "250 000–500 000+ ₽" }],
  },
  {
    id: "data-analysis", title: "Анализ и обработка данных", category: "Data и AI", price: 25_000, priceLabel: "25 000–100 000+ ₽", duration: "от 2 недель",
    summary: "Приводим данные в порядок, проверяем гипотезы и превращаем результаты в решения.",
    features: ["Инвентаризация данных", "Очистка и EDA", "Отчёт и рекомендации"],
    tiers: [{ label: "Низкая", price: "25 000–35 000 ₽" }, { label: "Средняя", price: "50 000–75 000 ₽" }, { label: "Высокая", price: "85 000–100 000+ ₽" }],
  },
  {
    id: "ai-services", title: "Разработка AI-сервисов", category: "Data и AI", price: 60_000, priceLabel: "60 000–3 000 000+ ₽", duration: "от 6 недель",
    summary: "Прикладной AI-сервис с измеримым качеством, API, интерфейсом и мониторингом.",
    features: ["Постановка и метрики", "Модели и API", "Мониторинг качества"],
    tiers: [{ label: "Низкая", price: "60 000–180 000 ₽" }, { label: "Средняя", price: "110 000–300 000 ₽" }, { label: "Высокая", price: "250 000–3 000 000+ ₽" }],
  },
  {
    id: "ai-business-integration", title: "Внедрение ИИ в бизнес", category: "Data и AI", price: 40_000, priceLabel: "40 000–500 000 ₽", duration: "от 3 недель",
    summary: "Находим процессы, где ИИ даёт измеримый эффект, внедряем готовые модели и AI-агентов в рабочий контур компании.",
    features: ["Аудит AI-сценариев", "Агенты и автоматизация", "Интеграция и обучение команды"],
    tiers: [{ label: "Низкая", price: "40 000–110 000 ₽" }, { label: "Средняя", price: "70 000–150 000 ₽" }, { label: "Крупная", price: "120 000–500 000 ₽" }],
  },
  {
    id: "api-integrations", title: "Интеграции с внешними API", category: "Интеграции и безопасность", price: 40_000, priceLabel: "40 000–350 000 ₽", duration: "от 2 недель",
    summary: "Надёжный обмен данными с внешними системами с логированием и обработкой ошибок.",
    features: ["Авторизация и запросы", "Ошибки и идемпотентность", "Тестовый контур"],
    tiers: [{ label: "Низкая", price: "40 000–100 000 ₽" }, { label: "Средняя", price: "60 000–150 000 ₽" }, { label: "Высокая", price: "120 000–350 000 ₽" }],
  },
  {
    id: "pentest", title: "Пентест", category: "Интеграции и безопасность", price: 25_000, priceLabel: "25 000–500 000 ₽", duration: "от 2 недель",
    summary: "Проверяем устойчивость системы к атакам и даём воспроизводимый план устранения уязвимостей.",
    features: ["Сканирование и ручная проверка", "Оценка критичности", "Отчёт и рекомендации"],
    tiers: [{ label: "Низкая", price: "25 000–80 000 ₽" }, { label: "Средняя", price: "60 000–250 000 ₽" }, { label: "Высокая", price: "100 000–500 000 ₽" }],
  },
  {
    id: "security-audit", title: "Аудит информационной безопасности", category: "Интеграции и безопасность", price: 30_000, priceLabel: "30 000–700 000 ₽", duration: "от 2 недель",
    summary: "Оцениваем текущую защиту, риски и соответствие требованиям, затем формируем план исправлений.",
    features: ["Интервью и артефакты", "Карта рисков", "Приоритетный план"],
    tiers: [{ label: "Низкая", price: "30 000–70 000 ₽" }, { label: "Средняя", price: "80 000–200 000 ₽" }, { label: "Высокая", price: "120 000–700 000 ₽" }],
  },
] as const;

type DocumentServiceCopy = Pick<CatalogService, "title" | "category" | "summary" | "duration" | "features"> & {
  tierLabels?: readonly string[];
};

const EN_DOCUMENT_COPY: Record<string, DocumentServiceCopy> = {
  consultation: {
    title: "Introductory consultation", category: "Discovery", duration: "30 minutes",
    summary: "In 30 minutes we will clarify the challenge, suggest a realistic launch format and define the next step with no obligation.",
    features: ["Challenge review", "Format assessment", "Next step"],
  },
  "custom-project": {
    title: "Custom project", category: "Built around your needs", duration: "from 4 weeks",
    summary: "Combine the functions, integrations and delivery stages your business needs, then use the estimator to get a realistic budget range.",
    features: ["Custom scope", "Budget estimate", "Technical plan"],
  },
  "it-audit": {
    title: "Company IT audit", category: "IT & development", duration: "from 1 week",
    summary: "An independent review of your infrastructure, services and IT processes, focused on risks, bottlenecks and practical priorities.",
    features: ["Infrastructure and services", "Risk and security review", "Prioritised report"], tierLabels: ["Low", "Medium", "High"],
  },
  "it-strategy": {
    title: "IT strategy development", category: "IT & development", duration: "from 2 weeks",
    summary: "A practical 1–3 year technology roadmap aligned with business goals, available resources and operational constraints.",
    features: ["Target architecture", "Stages and dependencies", "Success metrics"], tierLabels: ["Low", "Medium", "High"],
  },
  "digital-transformation": {
    title: "Digital transformation consulting", category: "IT & development", duration: "from 2 weeks",
    summary: "We redesign processes and services into a manageable digital operating model without automating work that does not create value.",
    features: ["AS IS / TO BE map", "Scenarios and quick wins", "Implementation plan"], tierLabels: ["Low", "Medium", "High"],
  },
  landing: {
    title: "Landing page", category: "Web development", duration: "from 3 weeks",
    summary: "A focused one-page website with a clear proposition, responsive design, analytics and a deliberate conversion journey.",
    features: ["Structure and journey", "Responsive performance", "Forms and analytics"], tierLabels: ["Low", "Medium", "High"],
  },
  "corporate-site": {
    title: "Corporate website", category: "Web development", duration: "from 5 weeks",
    summary: "A scalable digital presence for services, team, case studies and organic customer acquisition.",
    features: ["Architecture and navigation", "Design and CMS", "SEO and integrations"], tierLabels: ["Low", "Medium", "High"],
  },
  "ecommerce-platform": {
    title: "E-commerce platform", category: "Web development", duration: "from 6 weeks",
    summary: "Catalogue, search, cart, checkout, payment, delivery and customer accounts brought together in one sales system.",
    features: ["Catalogue and search", "Checkout and payment", "Admin and reporting"], tierLabels: ["Low", "Medium", "High"],
  },
  "saas-platform": {
    title: "SaaS platform", category: "Web development", duration: "from 8 weeks",
    summary: "A browser-based product with user roles, subscriptions, integrations and an architecture prepared for growth.",
    features: ["Roles and journeys", "APIs and integrations", "Monitoring and load"], tierLabels: ["Low", "Medium", "High"],
  },
  "web-support": {
    title: "Web product support and development", category: "Web development", duration: "monthly",
    summary: "Ongoing support for a live product: issue resolution, planned improvements and continuous stability control.",
    features: ["Assessment and backlog", "Fixes and updates", "Incidents and SLA"], tierLabels: ["Low", "Medium", "High"],
  },
  "cross-platform-app": {
    title: "Cross-platform applications", category: "Mobile development", duration: "from 6 weeks",
    summary: "iOS and Android applications with a shared codebase and a consistent end-to-end product journey.",
    features: ["UX journeys", "Push, offline and location", "Backend and analytics"], tierLabels: ["Low", "Medium", "High"],
  },
  "crm-erp": {
    title: "CRM / ERP web systems", category: "Enterprise systems", duration: "from 8 weeks",
    summary: "A working system for sales, orders, production, accounting and management reporting.",
    features: ["Entities and roles", "Pipelines and automation", "Reporting and integrations"], tierLabels: ["Low", "Medium", "High"],
  },
  "data-analysis": {
    title: "Data analysis and processing", category: "Data & AI", duration: "from 2 weeks",
    summary: "We organise your data, test business hypotheses and turn the findings into clear, actionable decisions.",
    features: ["Data inventory", "Cleaning and EDA", "Report and recommendations"], tierLabels: ["Low", "Medium", "High"],
  },
  "ai-services": {
    title: "AI product development", category: "Data & AI", duration: "from 6 weeks",
    summary: "A production-ready AI service with measurable quality, secure APIs, a practical interface and continuous monitoring.",
    features: ["Problem framing and metrics", "Models and APIs", "Quality monitoring"], tierLabels: ["Low", "Medium", "High"],
  },
  "ai-business-integration": {
    title: "AI implementation for business", category: "Data & AI", duration: "from 3 weeks",
    summary: "We identify workflows where AI can create measurable value, then integrate proven models and AI agents into day-to-day operations.",
    features: ["AI opportunity audit", "Agents and automation", "Integration and team enablement"], tierLabels: ["Low", "Medium", "Large"],
  },
  "api-integrations": {
    title: "External API integrations", category: "Integration & security", duration: "from 2 weeks",
    summary: "Reliable data exchange with external systems, including authentication, logging, retries and robust error handling.",
    features: ["Authentication and requests", "Errors and idempotency", "Test environment"], tierLabels: ["Low", "Medium", "High"],
  },
  pentest: {
    title: "Penetration testing", category: "Integration & security", duration: "from 2 weeks",
    summary: "We test how your system withstands realistic attacks and provide a reproducible, prioritised remediation plan.",
    features: ["Automated and manual testing", "Severity assessment", "Report and recommendations"], tierLabels: ["Low", "Medium", "High"],
  },
  "security-audit": {
    title: "Information security audit", category: "Integration & security", duration: "from 2 weeks",
    summary: "We assess current controls, business risks and compliance requirements, then define a prioritised improvement plan.",
    features: ["Interviews and evidence", "Risk map", "Prioritised plan"], tierLabels: ["Low", "Medium", "High"],
  },
};

const EN_DOCUMENT_SERVICES: readonly CatalogService[] = RU_DOCUMENT_SERVICES.map((service) => {
  const copy = EN_DOCUMENT_COPY[service.id];
  return {
    ...service,
    ...copy,
    tiers: service.tiers?.map((tier, index) => ({ ...tier, label: copy.tierLabels?.[index] ?? tier.label })),
  };
});

const PL_DOCUMENT_COPY: Record<string, DocumentServiceCopy> = {
  consultation: { title: "Konsultacja wstępna", category: "Rozpoznanie potrzeb", duration: "30 minut", summary: "W 30 minut doprecyzujemy wyzwanie, zaproponujemy realistyczny format startu i wskażemy kolejny krok — bez zobowiązań.", features: ["Analiza wyzwania", "Ocena formatu", "Kolejny krok"] },
  "custom-project": { title: "Projekt indywidualny", category: "Dopasowany do potrzeb", duration: "od 4 tygodni", summary: "Połącz potrzebne funkcje, integracje i etapy realizacji, aby otrzymać realistyczny przedział budżetu.", features: ["Indywidualny zakres", "Wycena budżetu", "Plan techniczny"] },
  "it-audit": { title: "Audyt IT firmy", category: "IT i rozwój oprogramowania", duration: "od 1 tygodnia", summary: "Niezależna ocena infrastruktury, usług i procesów IT, skoncentrowana na ryzykach, wąskich gardłach i praktycznych priorytetach.", features: ["Infrastruktura i usługi", "Ryzyko i bezpieczeństwo", "Raport z priorytetami"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "it-strategy": { title: "Opracowanie strategii IT", category: "IT i rozwój oprogramowania", duration: "od 2 tygodni", summary: "Praktyczny plan rozwoju technologii na 1–3 lata, powiązany z celami biznesowymi, dostępnymi zasobami i ograniczeniami operacyjnymi.", features: ["Architektura docelowa", "Etapy i zależności", "Mierniki sukcesu"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "digital-transformation": { title: "Doradztwo w transformacji cyfrowej", category: "IT i rozwój oprogramowania", duration: "od 2 tygodni", summary: "Przekształcamy procesy i usługi w zarządzalny model cyfrowy, bez automatyzowania działań, które nie tworzą wartości.", features: ["Mapa AS IS / TO BE", "Scenariusze i szybkie efekty", "Plan wdrożenia"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  landing: { title: "Landing page", category: "Tworzenie stron", duration: "od 3 tygodni", summary: "Skoncentrowana strona z jasną propozycją wartości, responsywnym projektem, analityką i przemyślaną ścieżką konwersji.", features: ["Struktura i ścieżka", "Responsywność i wydajność", "Formularze i analityka"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "corporate-site": { title: "Strona firmowa", category: "Tworzenie stron", duration: "od 5 tygodni", summary: "Skalowalna obecność cyfrowa dla oferty, zespołu, realizacji i organicznego pozyskiwania klientów.", features: ["Architektura i nawigacja", "Projekt i CMS", "SEO i integracje"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "ecommerce-platform": { title: "Sklep internetowy", category: "Tworzenie stron", duration: "od 6 tygodni", summary: "Katalog, wyszukiwarka, koszyk, zamówienie, płatność, dostawa i panel klienta połączone w jednym systemie sprzedaży.", features: ["Katalog i wyszukiwanie", "Zamówienie i płatność", "Administracja i raporty"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "saas-platform": { title: "Platforma SaaS", category: "Tworzenie stron", duration: "od 8 tygodni", summary: "Produkt internetowy z rolami użytkowników, subskrypcjami, integracjami i architekturą przygotowaną do wzrostu.", features: ["Role i scenariusze", "API i integracje", "Monitoring i obciążenie"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "web-support": { title: "Utrzymanie i rozwój produktów internetowych", category: "Tworzenie stron", duration: "miesięcznie", summary: "Stałe wsparcie działającego produktu: usuwanie problemów, planowany rozwój i ciągła kontrola stabilności.", features: ["Ocena i backlog", "Poprawki i aktualizacje", "Incydenty i SLA"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "cross-platform-app": { title: "Aplikacje wieloplatformowe", category: "Aplikacje mobilne", duration: "od 6 tygodni", summary: "Aplikacje na iOS i Androida ze wspólną bazą kodu oraz spójną ścieżką użytkownika.", features: ["Scenariusze UX", "Push, offline i lokalizacja", "Backend i analityka"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "crm-erp": { title: "Systemy internetowe CRM / ERP", category: "Systemy firmowe", duration: "od 8 tygodni", summary: "System do obsługi sprzedaży, zamówień, produkcji, ewidencji i raportowania zarządczego.", features: ["Obiekty i role", "Lejki i automatyzacja", "Raporty i integracje"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "data-analysis": { title: "Analiza i przetwarzanie danych", category: "Dane i AI", duration: "od 2 tygodni", summary: "Porządkujemy dane, testujemy hipotezy biznesowe i przekładamy wyniki na jasne decyzje operacyjne.", features: ["Inwentaryzacja danych", "Czyszczenie i EDA", "Raport i rekomendacje"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "ai-services": { title: "Tworzenie rozwiązań AI", category: "Dane i AI", duration: "od 6 tygodni", summary: "Gotowa do pracy usługa AI z mierzalną jakością, bezpiecznym API, praktycznym interfejsem i monitoringiem.", features: ["Definicja problemu i metryk", "Modele i API", "Monitoring jakości"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "ai-business-integration": { title: "Wdrożenie AI w biznesie", category: "Dane i AI", duration: "od 3 tygodni", summary: "Wskazujemy procesy, w których AI daje mierzalną wartość, a następnie wdrażamy sprawdzone modele i agentów do codziennej pracy firmy.", features: ["Audyt możliwości AI", "Agenci i automatyzacja", "Integracja i przygotowanie zespołu"], tierLabels: ["Niska", "Średnia", "Duża"] },
  "api-integrations": { title: "Integracje z zewnętrznymi API", category: "Integracje i bezpieczeństwo", duration: "od 2 tygodni", summary: "Niezawodna wymiana danych z systemami zewnętrznymi, obejmująca uwierzytelnianie, logowanie, ponawianie i obsługę błędów.", features: ["Uwierzytelnianie i zapytania", "Błędy i idempotencja", "Środowisko testowe"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  pentest: { title: "Testy penetracyjne", category: "Integracje i bezpieczeństwo", duration: "od 2 tygodni", summary: "Sprawdzamy odporność systemu na realistyczne ataki i przekazujemy odtwarzalny, uporządkowany plan usunięcia podatności.", features: ["Testy automatyczne i ręczne", "Ocena krytyczności", "Raport i rekomendacje"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
  "security-audit": { title: "Audyt bezpieczeństwa informacji", category: "Integracje i bezpieczeństwo", duration: "od 2 tygodni", summary: "Oceniamy obecne zabezpieczenia, ryzyka biznesowe i wymagania zgodności, a następnie tworzymy priorytetowy plan usprawnień.", features: ["Wywiady i dokumentacja", "Mapa ryzyka", "Plan priorytetów"], tierLabels: ["Niska", "Średnia", "Wysoka"] },
};

const PL_DOCUMENT_SERVICES: readonly CatalogService[] = RU_DOCUMENT_SERVICES.map((service) => {
  const copy = PL_DOCUMENT_COPY[service.id];
  return { ...service, ...copy, tiers: service.tiers?.map((tier, index) => ({ ...tier, label: copy.tierLabels?.[index] ?? tier.label })) };
});

export function getServiceCatalog(locale: Locale): readonly CatalogService[] {
  if (locale === "ru") return RU_DOCUMENT_SERVICES;
  if (locale === "en") return EN_DOCUMENT_SERVICES;
  if (locale === "pl") return PL_DOCUMENT_SERVICES;
  return BASE.map((service, index) => ({ ...service, ...COPY[locale][index] }));
}

export function getAccountServiceTitles(locale: Locale) {
  const legacy = BASE.map((service, index) => ({ id: service.id, title: COPY[locale][index].title }));
  const current = getServiceCatalog(locale).map(({ id, title }) => ({ id, title }));
  return [...new Map([...legacy, ...current].map((service) => [service.id, service])).values()];
}

export function getPricedServices(ids: readonly string[]) {
  const uniqueIds = [...new Set(ids)];
  const priced = [...BASE, ...RU_DOCUMENT_SERVICES];
  return uniqueIds.map((id) => priced.find((service) => service.id === id)).filter((service): service is ServiceBase => Boolean(service));
}
