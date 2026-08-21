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
  benefits: readonly string[];
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
  { slug: "revolution-print", title: "Revolution Print", category: "Operations platform", lead: "Платформа управления типографией: клиенты, заказы, производство, документы и коммуникации в одном рабочем пространстве.", tech: ["Node.js", "Express", "PostgreSQL", "Responsive dashboard"], image: "/projects/captures/revolution-print-desktop.png", mobileImage: "/projects/captures/revolution-print-mobile.png", website: "https://github.com/5eeee/revolution-print", year: "2026", duration: "12 недель", featured: true },
  { slug: "13auto", title: "13AUTO", category: "E-commerce", lead: "Каталог автозапчастей с подбором, личным кабинетом и прозрачным сценарием заказа.", tech: ["Next.js", "TypeScript", "E-commerce", "Responsive UX"], image: "/projects/captures/13auto-desktop.png", mobileImage: "/projects/captures/13auto-mobile.png", website: "https://13auto-storefront.vercel.app/", year: "2026", duration: "8 недель", featured: true },
  { slug: "dianafarm", title: "Dianafarm", category: "International", lead: "Международная платформа по ВНЖ, недвижимости и сопровождению бизнеса.", tech: ["Multilingual", "Content system", "Conversion UX", "Next.js"], image: "/projects/captures/dianafarm-desktop.png", mobileImage: "/projects/captures/dianafarm-mobile.png", website: "https://dianafarm.group/", year: "2026", duration: "10 недель", featured: true },
  { slug: "boostmarine", title: "Boost Marine", category: "Service", lead: "Сервисный сайт по ремонту водной техники с понятной навигацией по услугам.", tech: ["Service architecture", "Lead forms", "SEO", "Responsive UX"], image: "/projects/captures/boostmarine-desktop.png", mobileImage: "/projects/captures/boostmarine-mobile.png", website: "https://boostmarine.ru/", year: "2026", duration: "6 недель", featured: true },
  { slug: "royal-horse", title: "Royal Horse", category: "Hospitality", lead: "Премиальный сайт конно-спортивного комплекса с выразительной атмосферой бренда.", tech: ["Art direction", "Responsive UX", "Booking flow", "Next.js"], image: "/projects/captures/royal-horse-desktop.png", mobileImage: "/projects/captures/royal-horse-mobile.png", website: "https://royal-horse-lake.vercel.app/", year: "2026", duration: "9 недель", featured: true },
  { slug: "beef-flame", title: "Beefshteks", category: "Food delivery", lead: "Интерфейс доставки бургеров с яркой продуктовой подачей и быстрым заказом.", tech: ["Menu UX", "Cart", "Mobile UX", "Next.js"], image: "/projects/captures/beef-flame-desktop.png", mobileImage: "/projects/captures/beef-flame-mobile.png", website: "https://beef-flame.vercel.app/", year: "2026", duration: "6 недель", featured: true },
  { slug: "profist", title: "Профист", category: "Industry", lead: "Каталог металлопроката с подбором продукции под конкретную бизнес-задачу.", tech: ["Product catalogue", "Lead generation", "UI system", "SEO"], image: "/projects/captures/profist-desktop.png", mobileImage: "/projects/captures/profist-mobile.png", website: "https://profist-rf.vercel.app/", year: "2026", duration: "7 недель", featured: true },
  { slug: "prokub", title: "Прокуб", category: "B2B platform", lead: "Прайс-платформа бетона с доставкой, быстрым расчётом и заявками.", tech: ["Next.js", "Calculator", "B2B UX", "SEO"], image: "/projects/captures/prokub-desktop.png", mobileImage: "/projects/captures/prokub-mobile.png", website: "https://prokub-rf.vercel.app/", year: "2026", duration: "7 недель", featured: true },
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
  "revolution-print": "/projects/logos/revolution-print.png",
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
const englishTitles: Record<string, string> = { profist: "Profist", prokub: "Prokub", "corporate-site": "Corporate website", landing: "Landing page", "bi-analytics": "BI analytics", strategy: "Strategic consulting", "web-service": "Web service", crm: "CRM integration", marketing: "Marketing campaign" };
const polishTitles: Record<string, string> = { profist: "Profist", prokub: "Prokub", "corporate-site": "Strona firmowa", landing: "Landing page", "bi-analytics": "Analityka BI", strategy: "Doradztwo strategiczne", "web-service": "Serwis internetowy", crm: "Integracja CRM", marketing: "Kampania marketingowa" };
const armenianCategories: Record<string, string> = { "IT-продукт": "IT արտադրանք", "Бизнес-аналитика": "Բիզնես վերլուծություն", "Креатив и web": "Կրեատիվ և վեբ", "Аналитика": "Վերլուծություն", "Консалтинг": "Խորհրդատվություն", "Автоматизация": "Ավտոմատացում", "Креатив": "Կրեատիվ" };
const englishCategories: Record<string, string> = { "IT-продукт": "IT product", "Бизнес-аналитика": "Business analytics", "Креатив и web": "Creative & web", "Аналитика": "Analytics", "Консалтинг": "Consulting", "Автоматизация": "Automation", "Креатив": "Creative" };
const polishCategories: Record<string, string> = { "IT-продукт": "Produkt IT", "Бизнес-аналитика": "Analityka biznesowa", "Креатив и web": "Kreacja i WWW", "Аналитика": "Analityka", "Консалтинг": "Doradztwo", "Автоматизация": "Automatyzacja", "Креатив": "Kreacja" };

type EnglishProjectContent = Pick<Project, "lead" | "description" | "challenge" | "solution" | "result" | "benefits" | "testimonial" | "deliverables">;

const englishProjectContent: Record<string, EnglishProjectContent> = {
  "revolution-print": {
    lead: "A print-production operations platform that brings customers, orders, manufacturing, documents and communication into one workspace.",
    description: "We mapped the complete order lifecycle, roles and production hand-offs, then designed and built a responsive operating system that gives every team member a current, reliable view of the work.",
    challenge: "Replace fragmented spreadsheets, chats and manual status checks with one clear process without disrupting live production.",
    solution: "We designed a role-based workspace for customers, orders, production stages, files and communication, validated the prototype with real scenarios and built an extensible operational architecture.",
    result: "Customers, orders, production, documents and communication now work together in one operational control panel.",
    benefits: ["The team sees the current order status without reconciling several tools.", "Less time is spent searching for information and coordinating routine hand-offs.", "A shared process model reduces data loss and creates a foundation for reporting and scale."],
    testimonial: "Order status, documents and production work are now visible in one place, so the team spends far less time on manual coordination.",
    deliverables: ["Operations discovery", "Role and journey design", "Interface system", "Platform development and launch"],
  },
  "13auto": {
    lead: "An automotive parts catalogue with guided selection, customer accounts and a transparent ordering journey.",
    description: "We studied how buyers search for parts and how managers qualify requests, then created a catalogue structure, responsive interface and account experience that supports both sides of the transaction.",
    challenge: "Help customers identify the right part quickly while giving sales managers complete, structured requests instead of lengthy clarification chains.",
    solution: "We organised the catalogue around real search behaviour, designed guided selection and order status flows, and connected them through a consistent responsive product interface.",
    result: "The path from part search to order is shorter, clearer and easier to manage for both customers and the sales team.",
    benefits: ["Buyers reach a relevant part faster through a clear catalogue and selection flow.", "Managers receive better prepared requests and spend less time on basic clarification.", "Customer accounts and transparent order status improve trust and reduce support workload."],
    testimonial: "Customers find the right part faster, while our managers can start with a complete, well-structured request.",
    deliverables: ["Customer journey research", "Catalogue UX prototype", "Visual system", "Storefront development and launch"],
  },
  dianafarm: {
    lead: "A multilingual international platform for residency, property and business support services.",
    description: "We translated a complex cross-border offer into clear service routes, structured the multilingual content and built a conversion-focused platform that remains understandable across markets.",
    challenge: "Explain several legally and commercially complex services to audiences in different countries without overwhelming prospective clients.",
    solution: "We grouped services by customer objective, created a consistent multilingual content model and designed shorter paths from research to a relevant consultation.",
    result: "International services now form one coherent journey that makes the offer easier to understand and act on.",
    benefits: ["Visitors find the right cross-border service more quickly.", "A shared content structure keeps the offer consistent across languages.", "Consultation requests are more informed and specific."],
    testimonial: "The platform turns a complex international offer into one clear route, so clients understand the options and move to consultation faster.",
    deliverables: ["Offer architecture", "Multilingual content model", "Conversion UX", "Platform development and launch"],
  },
  boostmarine: {
    lead: "A service website for marine equipment repair with navigation organised around real customer needs.",
    description: "We analysed common service requests, grouped the offer by customer problem and built a responsive website that helps owners understand the next step before contacting the workshop.",
    challenge: "Turn a long technical service list into a journey that makes sense to boat owners who may not know the exact cause of a fault.",
    solution: "We organised services by practical scenarios, clarified the decision path and designed enquiry forms that collect the context the service team needs upfront.",
    result: "Customers move from a problem to the right service and enquiry route with less uncertainty.",
    benefits: ["Services are organised around owner needs rather than internal workshop structure.", "Customers can identify a likely next step faster.", "Better enquiry context helps the service team assess requests more efficiently."],
    testimonial: "Customers no longer get lost in the service list — they understand what fits their situation and how to book the workshop.",
    deliverables: ["Service journey research", "Information architecture", "Responsive visual system", "Website development and launch"],
  },
  "royal-horse": {
    lead: "A premium website for an equestrian complex, built around atmosphere, hospitality and a clear booking journey.",
    description: "We developed the digital art direction, content hierarchy and responsive experience to communicate the character of the venue and turn interest into a concrete visit or booking enquiry.",
    challenge: "Convey the premium, natural atmosphere of the complex online while making a varied range of services easy to explore.",
    solution: "We combined expressive visual storytelling with a structured service architecture and prominent booking routes across desktop and mobile.",
    result: "The digital experience now communicates the level of the venue before the first visit and guides guests naturally toward booking.",
    benefits: ["The brand feels premium and distinctive from the first screen.", "Services and facilities follow one clear information hierarchy.", "A shorter, more visible booking journey converts interest into enquiries."],
    testimonial: "The website communicates the standard of the complex before a guest arrives and guides them naturally toward a booking.",
    deliverables: ["Brand and audience discovery", "Art direction and UX", "Responsive design system", "Website development and launch"],
  },
  "beef-flame": {
    lead: "A bold food-delivery interface that puts the product first and keeps ordering fast.",
    description: "We built the menu around appetite, product detail and fast decision-making, then designed a mobile-first ordering flow with a distinctive visual language.",
    challenge: "Make the product memorable while reducing the number of steps between choosing a burger and completing an order.",
    solution: "We created product-led menu cards, a clear cart journey and a responsive interface that keeps the primary action visible at every stage.",
    result: "The product is now the hero of the experience, and ordering takes a short, focused sequence of actions.",
    benefits: ["Customers compare ingredients, presentation and price more quickly.", "The order journey removes unnecessary screens and decisions.", "A recognisable visual system strengthens the brand and supports repeat purchases."],
    testimonial: "We wanted the food to be the main character. The menu now looks genuinely appetising and ordering takes only a few clear steps.",
    deliverables: ["Menu journey research", "Mobile-first UX", "Product visual system", "Ordering interface development"],
  },
  profist: {
    lead: "A steel-product catalogue designed around customer requirements and precise B2B enquiries.",
    description: "We reorganised a technical product range into a task-oriented catalogue, created clear specification paths and built forms that give the sales team better request data.",
    challenge: "Help customers navigate a broad technical range without requiring deep product knowledge before making an enquiry.",
    solution: "We structured the catalogue around purchasing scenarios, clarified key parameters and designed forms that capture the information needed for an accurate quote.",
    result: "Product selection is easier and incoming enquiries contain more useful information for the sales team.",
    benefits: ["Customers find the relevant steel category and supply parameters faster.", "Structured forms reduce follow-up questions for sales.", "The catalogue can grow without losing clarity."],
    testimonial: "The catalogue finally speaks the language of the customer’s task, and our sales team receives much more precise enquiries.",
    deliverables: ["Catalogue research", "Information architecture", "B2B interface system", "Website development and launch"],
  },
  prokub: {
    lead: "A B2B concrete pricing platform with delivery parameters, fast estimates and structured enquiries.",
    description: "We simplified a complex pricing model, explained the factors that affect the final cost and connected calculation and enquiry into one continuous customer journey.",
    challenge: "Make grades, delivery conditions and price variables understandable before a customer speaks to a manager.",
    solution: "We designed a guided pricing experience, structured the required project inputs and gave managers a consistent set of data for preparing an accurate quotation.",
    result: "Customers reach a realistic estimate faster, while managers spend less time collecting basic project information.",
    benefits: ["Concrete grades and delivery conditions are easier to compare.", "Calculation and enquiry work as one continuous flow.", "Managers receive structured inputs and can prepare accurate quotations sooner."],
    testimonial: "Clients now see the conditions and the next step immediately. We clarify less and prepare an accurate estimate much faster.",
    deliverables: ["Pricing journey research", "Calculator UX", "B2B visual system", "Platform development and launch"],
  },
};

const polishProjectContent: Record<string, EnglishProjectContent> = {
  "revolution-print": {
    lead: "Platforma operacyjna drukarni, która łączy klientów, zamówienia, produkcję, dokumenty i komunikację w jednym środowisku pracy.",
    description: "Odwzorowaliśmy pełny cykl realizacji zamówienia, role i przekazywanie pracy między etapami produkcji. Następnie zaprojektowaliśmy i zbudowaliśmy responsywny system, który daje każdemu członkowi zespołu aktualny i wiarygodny obraz sytuacji.",
    challenge: "Zastąpić rozproszone arkusze, czaty i ręczne sprawdzanie statusów jednym czytelnym procesem, nie zakłócając bieżącej produkcji.",
    solution: "Zaprojektowaliśmy środowisko oparte na rolach, obejmujące klientów, zamówienia, etapy produkcji, pliki i komunikację. Prototyp sprawdziliśmy na rzeczywistych scenariuszach, a rozwiązanie oparliśmy na architekturze gotowej do dalszego rozwoju.",
    result: "Klienci, zamówienia, produkcja, dokumenty i komunikacja działają teraz w jednym operacyjnym panelu sterowania drukarni.",
    benefits: ["Zespół widzi bieżący status zamówienia bez porównywania danych z kilku narzędzi.", "Mniej czasu zajmuje wyszukiwanie informacji i koordynowanie rutynowych przekazań.", "Wspólny model procesów ogranicza utratę danych i tworzy podstawę do raportowania oraz skalowania."],
    testimonial: "Status zamówienia, dokumenty i praca produkcji są teraz widoczne w jednym miejscu, dlatego zespół poświęca znacznie mniej czasu na ręczną koordynację.",
    deliverables: ["Diagnoza procesów operacyjnych", "Projekt ról i ścieżek", "System interfejsu", "Rozwój platformy i uruchomienie"],
  },
  "13auto": {
    lead: "Katalog części samochodowych z inteligentnym doborem, panelem klienta i przejrzystą ścieżką zamówienia.",
    description: "Zbadaliśmy sposób wyszukiwania części przez kupujących i kwalifikowania zapytań przez handlowców. Na tej podstawie stworzyliśmy strukturę katalogu, responsywny interfejs i panel klienta wspierający obie strony transakcji.",
    challenge: "Pomóc klientowi szybko znaleźć właściwą część, a handlowcom przekazywać kompletne, uporządkowane zapytania bez długich serii doprecyzowań.",
    solution: "Uporządkowaliśmy katalog zgodnie z rzeczywistymi zachowaniami użytkowników, zaprojektowaliśmy dobór części i statusy zamówień oraz połączyliśmy je w spójny, responsywny produkt.",
    result: "Droga od wyszukania części do zamówienia jest krótsza, bardziej zrozumiała i łatwiejsza w obsłudze dla klienta oraz zespołu sprzedaży.",
    benefits: ["Kupujący szybciej dociera do odpowiedniej części dzięki czytelnemu katalogowi i procesowi doboru.", "Handlowiec otrzymuje lepiej przygotowane zapytanie i poświęca mniej czasu na podstawowe pytania.", "Panel klienta i przejrzysty status zamówienia zwiększają zaufanie oraz ograniczają obciążenie obsługi."],
    testimonial: "Klienci szybciej znajdują właściwą część, a nasi handlowcy mogą od razu pracować z kompletnym i dobrze uporządkowanym zapytaniem.",
    deliverables: ["Badanie ścieżki klienta", "Prototyp UX katalogu", "System wizualny", "Rozwój i uruchomienie sklepu"],
  },
  dianafarm: {
    lead: "Wielojęzyczna platforma międzynarodowa dla usług związanych z pobytem, nieruchomościami i obsługą biznesu.",
    description: "Przełożyliśmy złożoną ofertę transgraniczną na czytelne ścieżki usług, uporządkowaliśmy wielojęzyczne treści i zbudowaliśmy platformę nastawioną na konwersję, zrozumiałą na różnych rynkach.",
    challenge: "Wyjaśnić prawnie i biznesowo złożone usługi odbiorcom z różnych krajów, nie przeciążając ich nadmiarem informacji.",
    solution: "Pogrupowaliśmy usługi według celów klienta, stworzyliśmy spójny model treści w wielu językach i skróciliśmy drogę od poszukiwania informacji do właściwej konsultacji.",
    result: "Międzynarodowe usługi tworzą teraz jedną spójną ścieżkę, która ułatwia zrozumienie oferty i podjęcie działania.",
    benefits: ["Odwiedzający szybciej znajduje właściwą usługę transgraniczną.", "Wspólna struktura treści zapewnia spójność oferty we wszystkich językach.", "Zapytania konsultacyjne są lepiej przygotowane i bardziej konkretne."],
    testimonial: "Platforma zamienia złożoną ofertę międzynarodową w jasną ścieżkę, dzięki czemu klienci szybciej rozumieją możliwości i przechodzą do konsultacji.",
    deliverables: ["Architektura oferty", "Wielojęzyczny model treści", "UX konwersji", "Rozwój platformy i uruchomienie"],
  },
  boostmarine: {
    lead: "Serwis internetowy naprawy sprzętu wodnego z nawigacją uporządkowaną według rzeczywistych potrzeb klientów.",
    description: "Przeanalizowaliśmy typowe zgłoszenia serwisowe, pogrupowaliśmy ofertę według problemów klientów i zbudowaliśmy responsywną stronę, która pomaga właścicielowi zrozumieć kolejny krok jeszcze przed kontaktem z warsztatem.",
    challenge: "Zamienić długą listę technicznych usług w zrozumiałą ścieżkę dla właściciela łodzi, który nie zawsze zna przyczynę usterki.",
    solution: "Uporządkowaliśmy usługi według praktycznych scenariuszy, wyjaśniliśmy ścieżkę decyzji i zaprojektowaliśmy formularze zbierające z wyprzedzeniem kontekst potrzebny zespołowi serwisu.",
    result: "Klient przechodzi od problemu do właściwej usługi i zgłoszenia z mniejszą niepewnością.",
    benefits: ["Usługi są uporządkowane według potrzeb właścicieli, a nie wewnętrznej struktury warsztatu.", "Klient szybciej rozpoznaje prawdopodobny kolejny krok.", "Lepszy kontekst zgłoszenia przyspiesza ocenę zapytania przez serwis."],
    testimonial: "Klienci nie gubią się już w liście usług — rozumieją, co pasuje do ich sytuacji i jak umówić wizytę w serwisie.",
    deliverables: ["Badanie ścieżek serwisowych", "Architektura informacji", "Responsywny system wizualny", "Rozwój strony i uruchomienie"],
  },
  "royal-horse": {
    lead: "Strona premium kompleksu jeździeckiego, zbudowana wokół atmosfery, gościnności i czytelnej ścieżki rezerwacji.",
    description: "Opracowaliśmy kierunek artystyczny, hierarchię treści i responsywne doświadczenie, aby oddać charakter miejsca i zamienić zainteresowanie w konkretną wizytę lub zapytanie o rezerwację.",
    challenge: "Przenieść do internetu premium i naturalną atmosferę kompleksu, jednocześnie jasno prezentując zróżnicowaną ofertę.",
    solution: "Połączyliśmy wyrazistą narrację wizualną z uporządkowaną architekturą usług i widocznymi ścieżkami rezerwacji na komputerach oraz urządzeniach mobilnych.",
    result: "Doświadczenie cyfrowe komunikuje poziom obiektu jeszcze przed pierwszą wizytą i naturalnie prowadzi gościa do rezerwacji.",
    benefits: ["Marka od pierwszego ekranu wygląda premium i rozpoznawalnie.", "Usługi i infrastruktura mają jedną czytelną hierarchię informacji.", "Krótsza i bardziej widoczna ścieżka rezerwacji zamienia zainteresowanie w zapytania."],
    testimonial: "Strona pokazuje standard kompleksu, zanim gość do nas przyjedzie, i naturalnie prowadzi go do rezerwacji.",
    deliverables: ["Diagnoza marki i odbiorców", "Kierunek artystyczny i UX", "Responsywny system projektowy", "Rozwój strony i uruchomienie"],
  },
  "beef-flame": {
    lead: "Wyrazisty interfejs dostawy jedzenia, który stawia produkt na pierwszym planie i maksymalnie skraca zamówienie.",
    description: "Zbudowaliśmy menu wokół apetytu, szczegółów produktu i szybkiej decyzji, a następnie zaprojektowaliśmy mobilną ścieżkę zamówienia z rozpoznawalnym językiem wizualnym.",
    challenge: "Nadać produktowi wyrazisty charakter i jednocześnie ograniczyć liczbę kroków między wyborem burgera a zakończeniem zamówienia.",
    solution: "Stworzyliśmy karty menu skupione na produkcie, czytelną ścieżkę koszyka i responsywny interfejs, w którym główne działanie jest zawsze widoczne.",
    result: "Produkt jest głównym bohaterem doświadczenia, a zamówienie wymaga krótkiej i skupionej sekwencji działań.",
    benefits: ["Klient szybciej porównuje skład, wygląd i cenę pozycji.", "Ścieżka zamówienia usuwa zbędne ekrany i decyzje.", "Rozpoznawalny system wizualny wzmacnia markę i wspiera ponowne zakupy."],
    testimonial: "Chcieliśmy, aby jedzenie było głównym bohaterem. Menu naprawdę pobudza apetyt, a zamówienie zajmuje tylko kilka jasnych kroków.",
    deliverables: ["Badanie ścieżki menu", "UX mobile-first", "System wizualny produktu", "Rozwój interfejsu zamówień"],
  },
  profist: {
    lead: "Katalog wyrobów stalowych zaprojektowany wokół potrzeb klienta i precyzyjnych zapytań B2B.",
    description: "Przeorganizowaliśmy techniczny asortyment w katalog oparty na zadaniach, stworzyliśmy jasne ścieżki specyfikacji i formularze, które dostarczają zespołowi sprzedaży lepsze dane wejściowe.",
    challenge: "Pomóc klientom poruszać się po szerokim, technicznym asortymencie bez wymagania specjalistycznej wiedzy przed wysłaniem zapytania.",
    solution: "Ułożyliśmy katalog według scenariuszy zakupowych, wyjaśniliśmy najważniejsze parametry i zaprojektowaliśmy formularze zbierające dane potrzebne do dokładnej wyceny.",
    result: "Dobór produktu jest prostszy, a zapytania zawierają więcej użytecznych informacji dla zespołu sprzedaży.",
    benefits: ["Klient szybciej znajduje właściwą kategorię stali i parametry dostawy.", "Ustrukturyzowane formularze ograniczają dodatkowe pytania handlowców.", "Katalog może rosnąć bez utraty czytelności."],
    testimonial: "Katalog wreszcie mówi językiem zadania klienta, a nasz zespół sprzedaży otrzymuje znacznie precyzyjniejsze zapytania.",
    deliverables: ["Badanie katalogu", "Architektura informacji", "System interfejsu B2B", "Rozwój strony i uruchomienie"],
  },
  prokub: {
    lead: "Platforma cenowa B2B dla betonu z parametrami dostawy, szybką wyceną i uporządkowanymi zapytaniami.",
    description: "Uprościliśmy złożony model cenowy, wyjaśniliśmy czynniki wpływające na koszt końcowy i połączyliśmy kalkulację ze zgłoszeniem w jedną ciągłą ścieżkę klienta.",
    challenge: "Wyjaśnić klasy betonu, warunki dostawy i zmienne cenowe jeszcze przed rozmową klienta z handlowcem.",
    solution: "Zaprojektowaliśmy prowadzoną wycenę, uporządkowaliśmy niezbędne dane projektu i daliśmy handlowcom spójny zestaw informacji do przygotowania dokładnej oferty.",
    result: "Klient szybciej otrzymuje realistyczną wycenę, a handlowiec poświęca mniej czasu na zbieranie podstawowych informacji o projekcie.",
    benefits: ["Klasy betonu i warunki dostawy łatwiej porównać.", "Kalkulacja i zapytanie tworzą jedną ciągłą ścieżkę.", "Handlowiec otrzymuje uporządkowane dane i szybciej przygotowuje dokładną ofertę."],
    testimonial: "Klienci od razu widzą warunki i kolejny krok. Mniej czasu poświęcamy na doprecyzowania i szybciej przygotowujemy dokładną wycenę.",
    deliverables: ["Badanie ścieżki cenowej", "UX kalkulatora", "System wizualny B2B", "Rozwój platformy i uruchomienie"],
  },
};

export function getProject(slug: string, locale: Locale): Project | undefined {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return undefined;
  const isRussian = locale === "ru";
  const isPolish = locale === "pl";
  const isArmenian = locale === "hy";
  const isEnglish = locale === "en";
  const englishContent = englishProjectContent[slug];
  const polishContent = polishProjectContent[slug];
  const businessBenefits: Record<string, string> = {
    "revolution-print": "Объединили клиентов, заказы, производство, документы и коммуникации в одной операционной панели типографии.",
    "13auto": "Сократили путь от поиска запчасти до заказа и сделали подбор понятным для покупателя и менеджера.",
    prokub: "Ускорили получение расчёта и превратили сложный B2B-прайс в прозрачный сценарий заявки.",
    profist: "Упростили подбор металлопроката и повысили качество входящих обращений за счёт точной структуры каталога.",
    dianafarm: "Собрали международные услуги в единую воронку и сделали сложное предложение понятным для клиента.",
    boostmarine: "Развели услуги по понятным сценариям и сократили путь клиента от проблемы до обращения в сервис.",
    "royal-horse": "Усилили премиальное позиционирование комплекса и сделали запись на услуги заметнее и проще.",
    "beef-flame": "Сделали продукт главным героем экрана и сократили путь пользователя от выбора бургера до заказа.",
  };
  const businessBenefitDetails: Record<string, readonly string[]> = {
    "revolution-print": [
      "Клиенты, заказы, этапы производства, документы и переписка собраны в единой рабочей среде — команда видит актуальный статус без сверки нескольких систем.",
      "Ручная координация и поиск информации занимают меньше времени: ответственный быстрее понимает, что происходит с заказом и какой шаг нужен дальше.",
      "Единая логика ролей и процессов снижает риск потери данных и создаёт основу для масштабирования производства и управленческой отчётности.",
    ],
    "13auto": [
      "Покупатель быстрее переходит от запроса к подходящей запчасти благодаря понятной структуре каталога и сценарию подбора.",
      "Менеджер получает более подготовленное обращение с нужными параметрами и тратит меньше времени на первичные уточнения.",
      "Личный кабинет и прозрачный статус заказа повышают доверие клиента и снижают нагрузку на поддержку.",
    ],
    dianafarm: [
      "Сложные международные услуги собраны в понятные направления, поэтому клиент быстрее находит подходящий сценарий.",
      "Единая структура контента помогает одинаково точно объяснять предложение аудитории из разных стран.",
      "Путь к консультации стал короче, а входящие обращения — более осознанными и предметными.",
    ],
    boostmarine: [
      "Услуги разделены по реальным задачам владельцев техники, а не по внутренней структуре сервисного центра.",
      "Клиент быстрее понимает возможную причину проблемы и сразу видит подходящий следующий шаг.",
      "Формы обращения собирают нужный контекст заранее и помогают сервису быстрее оценить запрос.",
    ],
    "royal-horse": [
      "Цифровая подача передаёт премиальный уровень комплекса ещё до первого визита и усиливает восприятие бренда.",
      "Услуги и инфраструктура показаны в единой логике, поэтому гостю проще выбрать формат знакомства с комплексом.",
      "Сценарий записи стал заметнее и короче, что помогает переводить интерес в конкретное обращение.",
    ],
    "beef-flame": [
      "Меню построено вокруг продукта: пользователь быстрее оценивает состав, подачу и стоимость позиции.",
      "Путь от выбора бургера до оформления заказа сокращён до последовательного сценария без лишних экранов.",
      "Выразительная визуальная система повышает узнаваемость бренда и поддерживает повторные заказы.",
    ],
    profist: [
      "Каталог организован по бизнес-задачам, поэтому клиенту проще найти нужный вид металлопроката и параметры поставки.",
      "Структурированные формы повышают точность входящих заявок и уменьшают объём уточнений для отдела продаж.",
      "Единая продуктовая система позволяет расширять ассортимент без потери понятности навигации.",
    ],
    prokub: [
      "Клиент быстрее ориентируется в марках бетона, условиях доставки и параметрах, влияющих на итоговую стоимость.",
      "Расчёт и заявка собраны в один последовательный сценарий, что сокращает число ручных уточнений.",
      "Менеджер получает структурированные исходные данные и может быстрее подготовить точное коммерческое предложение.",
    ],
  };
  const testimonials: Record<string, string> = {
    "revolution-print": "Теперь статус заказа, документы и работа производства видны в одном месте, а команда меньше времени тратит на ручную координацию.",
    "13auto": "Мы получили понятный каталог: покупатель быстрее находит нужную деталь, а наши менеджеры работают уже с подготовленными запросами.",
    prokub: "Теперь наши клиенты сразу видят условия и следующий шаг. Мы тратим меньше времени на уточнения и быстрее готовим точный расчёт.",
    profist: "Мы наконец получили каталог, который говорит на языке задачи клиента. Обращения стали точнее и полезнее для нашего отдела продаж.",
    dianafarm: "Мы смогли собрать сложные международные услуги в один ясный маршрут. Клиенты лучше понимают предложение и быстрее переходят к консультации.",
    boostmarine: "Наши клиенты больше не теряются в перечне услуг: они сразу понимают, что им подходит и как записаться в сервис.",
    "royal-horse": "Мы получили сайт, который передаёт уровень комплекса ещё до визита и аккуратно ведёт гостя к записи.",
    "beef-flame": "Мы хотели, чтобы продукт был главным героем. Теперь меню выглядит аппетитно, а оформить заказ можно без лишних шагов.",
  };
  return {
    ...project,
    logo: projectLogos[slug],
    title: isRussian ? project.title : isPolish ? polishTitles[slug] ?? project.title : isArmenian ? armenianTitles[slug] ?? project.title : englishTitles[slug] ?? project.title,
    category: isRussian ? project.category : isPolish ? polishCategories[project.category] ?? project.category : isArmenian ? armenianCategories[project.category] ?? project.category : isEnglish ? englishCategories[project.category] ?? project.category : project.category.replace("ИТ", "IT"),
    lead: isRussian ? project.lead : isPolish ? polishContent?.lead ?? "Skoncentrowane rozwiązanie cyfrowe zaprojektowane wokół mierzalnego celu biznesowego." : isArmenian ? "Չափելի բիզնես նպատակի շուրջ կառուցված հստակ թվային լուծում։" : isEnglish ? englishContent?.lead ?? "A focused business solution designed around a measurable objective." : "A focused business solution designed around a measurable objective.",
    description: isRussian
      ? "Мы начали с диагностики задачи и пользовательских сценариев, затем собрали прототип, визуальную систему и рабочий продукт. Решение проектировалось так, чтобы команда могла развивать его после запуска без полной переработки архитектуры."
      : isPolish ? polishContent?.description ?? "Zaczęliśmy od diagnozy biznesowej i ścieżek użytkownika, a następnie stworzyliśmy prototyp, system wizualny i działające rozwiązanie gotowe do dalszego rozwoju." : isArmenian ? "Սկսեցինք բիզնես խնդրի և օգտատերերի սցենարների ուսումնասիրությունից, ապա ստեղծեցինք նախատիպը, տեսողական համակարգը և գործող արտադրանքը։ Ճարտարապետությունը նախատեսված է հետագա զարգացման համար։" : isEnglish ? englishContent?.description ?? "We started with business discovery and user journeys, then built the prototype, visual system and production solution. The architecture is ready for continued growth after launch." : "We started with business discovery and user journeys, then built the prototype, visual system and production solution. The architecture is ready for continued growth after launch.",
    challenge: isRussian ? "Объединить разрозненные процессы в одном понятном инструменте и убрать ручные действия, которые замедляли команду." : isPolish ? polishContent?.challenge ?? "Połączyć rozproszone procesy w jednym czytelnym narzędziu i ograniczyć ręczne działania spowalniające zespół." : isArmenian ? "Միավորել առանձին գործընթացները մեկ հասկանալի գործիքում և նվազեցնել թիմը դանդաղեցնող ձեռքի աշխատանքը։" : isEnglish ? englishContent?.challenge ?? "Unify fragmented processes in one clear tool and remove manual work slowing the team down." : "Unify fragmented processes in one clear tool and remove manual work slowing the team down.",
    solution: isRussian ? "Спроектировали путь пользователя, логику ролей и ключевые экраны. Проверили прототип на реальных сценариях и только затем перешли к разработке." : isPolish ? polishContent?.solution ?? "Zaprojektowaliśmy ścieżkę użytkownika, role i kluczowe ekrany, zweryfikowaliśmy prototyp na rzeczywistych scenariuszach i dopiero potem przeszliśmy do realizacji." : isArmenian ? "Նախագծեցինք օգտատիրոջ ուղին, դերերի տրամաբանությունը և հիմնական էկրանները։ Նախատիպը ստուգեցինք իրական սցենարներով, ապա անցանք մշակմանը։" : isEnglish ? englishContent?.solution ?? "We designed the user journey, roles and key screens, validated the prototype on real scenarios and then moved into development." : "We designed the user journey, roles and key screens, validated the prototype on real scenarios and then moved into development.",
    result: isRussian
      ? businessBenefits[slug] ?? "Команда получила понятный цифровой инструмент, прозрачную логику работы и основу для дальнейшего масштабирования."
      : isPolish ? polishContent?.result ?? "Zespół otrzymał czytelne narzędzie cyfrowe, przejrzysty model działania i podstawę do dalszego skalowania." : isArmenian ? "Թիմը ստացավ պարզ թվային գործիք, աշխատանքի թափանցիկ տրամաբանություն և հետագա մասշտաբավորման հիմք։" : isEnglish ? englishContent?.result ?? "The team received a clear digital tool, transparent operating logic and a foundation for further scaling." : "The team received a clear digital tool, transparent operating logic and a foundation for further scaling.",
    benefits: isRussian
      ? businessBenefitDetails[slug] ?? ["Ключевые процессы стали понятнее и прозрачнее для команды.", "Пользовательский путь стал короче, а обращения — более предметными.", "Архитектура решения готова к развитию и масштабированию."]
      : isPolish ? polishContent?.benefits ?? ["Kluczowe procesy stały się bardziej czytelne i przejrzyste.", "Ścieżka użytkownika jest krótsza i lepiej ukierunkowana.", "Rozwiązanie jest gotowe do dalszego rozwoju i skalowania."] : isArmenian ? ["Հիմնական գործընթացները դարձան ավելի պարզ և թափանցիկ։", "Օգտատիրոջ ճանապարհը դարձավ ավելի կարճ և հասկանալի։", "Լուծման ճարտարապետությունը պատրաստ է հետագա զարգացման։"] : isEnglish ? englishContent?.benefits ?? ["Core processes became clearer and more transparent.", "The user journey became shorter and more focused.", "The solution is ready for continued development and scaling."] : ["Core processes became clearer and more transparent.", "The user journey became shorter and more focused.", "The solution is ready for continued development and scaling."],
    testimonial: isRussian
      ? testimonials[slug] ?? "Мы получили понятное для клиентов решение и удобный рабочий инструмент для нашей команды."
      : isPolish ? polishContent?.testimonial ?? "Otrzymaliśmy rozwiązanie bardziej zrozumiałe dla klientów i znacznie wygodniejsze dla naszego zespołu." : isArmenian ? "Մենք ստացանք հաճախորդների համար հասկանալի լուծում և թիմի համար հարմար աշխատանքային գործիք։" : isEnglish ? englishContent?.testimonial ?? "We received a solution that is clearer for our customers and more useful for our team." : "We received a solution that is clearer for our customers and more useful for our team.",
    deliverables: isRussian ? ["Диагностика и сценарии", "UX-прототип", "Визуальная система", "Разработка и запуск"] : isPolish ? polishContent?.deliverables ?? ["Diagnoza i scenariusze", "Prototyp UX", "System wizualny", "Realizacja i uruchomienie"] : isArmenian ? ["Ախտորոշում և սցենարներ", "UX նախատիպ", "Տեսողական համակարգ", "Մշակում և գործարկում"] : isEnglish ? englishContent?.deliverables ?? ["Discovery and journeys", "UX prototype", "Visual system", "Development and launch"] : ["Discovery and journeys", "UX prototype", "Visual system", "Development and launch"],
    duration: isPolish && project.duration ? project.duration.replace(/^(\d+) недель$/, "$1 tygodni") : isEnglish && project.duration ? project.duration.replace(/^(\d+) недель$/, "$1 weeks") : project.duration,
  };
}

export function getPortfolioProjects(locale: Locale) {
  return projects.filter((project) => project.featured).map((project) => getProject(project.slug, locale)!).filter(Boolean);
}
