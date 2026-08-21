import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

const copy = {
  ru: {
    title: "Команда, которая отвечает за бизнес-результат",
    lead: "Agile Business объединяет стратегию, аналитику, дизайн и разработку. Мы не передаём между отделами вашу задачу — одна команда ведёт её от диагностики до работающей системы.",
    services: "Смотреть услуги",
    discuss: "Обсудить задачу",
    positioning: "Подключаемся там, где бизнесу нужны рост, прозрачность и рабочий цифровой инструмент — без разрыва между консультацией и внедрением.",
    capabilities: [
      ["Стратегический анализ", "Находим ограничение, проверяем цифры и собираем приоритетный план действий."],
      ["Сайты и продукты", "Проектируем понятные цифровые сценарии и превращаем их в быстрый, адаптивный продукт."],
      ["CRM и BI-системы", "Связываем продажи, процессы и управленческие показатели в одном рабочем контуре."],
    ],
    processTitle: "Как устроена работа",
    processText: "На каждом этапе есть понятный результат, ответственный человек и следующая точка решения.",
    process: [["Диагностика", "Фиксируем задачу, ограничения и метрики успеха."], ["Архитектура", "Собираем сценарий, состав решения и прозрачную смету."], ["Реализация", "Показываем промежуточный результат короткими итерациями."], ["Запуск", "Проверяем, передаём систему и план дальнейшего развития."]],
    final: "Нужна команда, которая разберётся в задаче и доведёт решение до запуска?",
  },
  en: {
    title: "A team accountable for the business outcome",
    lead: "Agile Business brings strategy, analytics, design and development together. One team carries the challenge from discovery to a working system.",
    services: "Explore services", discuss: "Discuss a challenge",
    positioning: "We join when a business needs growth, clarity and a working digital tool — without a gap between consulting and delivery.",
    capabilities: [["Strategy and analytics", "We identify constraints, validate the numbers and build a focused action plan."], ["Websites and products", "We design clear digital journeys and turn them into fast, responsive products."], ["CRM and BI systems", "We connect sales, operations and management metrics in one working system."]],
    processTitle: "How we work", processText: "Every stage has a clear output, an accountable owner and the next decision point.",
    process: [["Discovery", "We define the objective, constraints and success metrics."], ["Architecture", "We shape the journey, solution scope and transparent estimate."], ["Delivery", "We show working progress in short iterations."], ["Launch", "We validate, hand over and define the next growth plan."]],
    final: "Need a team that understands the challenge and delivers the solution?",
  },
  pl: {
    title: "Zespół odpowiedzialny za wynik biznesowy",
    lead: "Agile Business łączy strategię, analitykę, projektowanie i rozwój oprogramowania. Jedna odpowiedzialna ekipa prowadzi wyzwanie od diagnozy do działającego systemu.",
    services: "Zobacz usługi", discuss: "Omów wyzwanie",
    positioning: "Włączamy się tam, gdzie firma potrzebuje wzrostu, przejrzystości i sprawnego narzędzia cyfrowego — bez luki między doradztwem a wdrożeniem.",
    capabilities: [["Strategia i analityka", "Identyfikujemy ograniczenia, weryfikujemy dane i tworzymy skoncentrowany plan działania."], ["Serwisy i produkty cyfrowe", "Projektujemy zrozumiałe ścieżki użytkownika i zamieniamy je w szybkie, responsywne produkty."], ["Systemy CRM i BI", "Łączymy sprzedaż, operacje i wskaźniki zarządcze w jednym środowisku pracy."]],
    processTitle: "Jak pracujemy", processText: "Każdy etap ma konkretny rezultat, osobę odpowiedzialną i jasno określony punkt decyzyjny.",
    process: [["Diagnoza", "Definiujemy cel, ograniczenia i mierniki sukcesu."], ["Architektura", "Ustalamy scenariusz, zakres rozwiązania i przejrzystą wycenę."], ["Realizacja", "Pokazujemy działające rezultaty w krótkich iteracjach."], ["Uruchomienie", "Weryfikujemy rozwiązanie, przekazujemy system i plan dalszego rozwoju."]],
    final: "Potrzebujesz zespołu, który zrozumie wyzwanie i doprowadzi rozwiązanie do uruchomienia?",
  },
  ka: {
    title: "გუნდი, რომელიც ბიზნეს შედეგზე აგებს პასუხს",
    lead: "Agile Business აერთიანებს სტრატეგიას, ანალიტიკას, დიზაინსა და განვითარებას. ერთი გუნდი მიჰყვება ამოცანას კვლევიდან სამუშაო სისტემამდე.",
    services: "სერვისების ნახვა", discuss: "ამოცანის განხილვა",
    positioning: "ვერთვებით იქ, სადაც ბიზნესს სჭირდება ზრდა, გამჭვირვალობა და რეალურად მოქმედი ციფრული ინსტრუმენტი.",
    capabilities: [["სტრატეგია და ანალიტიკა", "ვპოულობთ შეზღუდვებს, ვამოწმებთ მონაცემებს და ვქმნით მოქმედების გეგმას."], ["საიტები და პროდუქტები", "ვქმნით ნათელ ციფრულ სცენარებს და სწრაფ, ადაპტურ პროდუქტებს."], ["CRM და BI სისტემები", "ვაერთიანებთ გაყიდვებს, პროცესებსა და მართვის მეტრიკებს."]],
    processTitle: "როგორ ვმუშაობთ", processText: "ყოველ ეტაპს აქვს მკაფიო შედეგი, პასუხისმგებელი და შემდეგი გადაწყვეტილება.",
    process: [["დიაგნოსტიკა", "ვაფიქსირებთ მიზანს, შეზღუდვებსა და წარმატების მეტრიკებს."], ["არქიტექტურა", "ვქმნით სცენარს, გადაწყვეტის შემადგენლობასა და გამჭვირვალე შეფასებას."], ["რეალიზაცია", "ვაჩვენებთ სამუშაო პროგრესს მოკლე იტერაციებით."], ["გაშვება", "ვამოწმებთ, გადავცემთ სისტემას და განვითარების გეგმას."]],
    final: "გჭირდებათ გუნდი, რომელიც ამოცანას გაიგებს და გადაწყვეტას გაუშვებს?",
  },
  hy: {
    title: "Թիմ, որը պատասխանատու է բիզնես արդյունքի համար",
    lead: "Agile Business-ը միավորում է ռազմավարությունը, վերլուծությունը, դիզայնը և մշակումը։ Մեկ թիմը վարում է խնդիրը ուսումնասիրությունից մինչև գործող համակարգ։",
    services: "Դիտել ծառայությունները", discuss: "Քննարկել խնդիրը",
    positioning: "Միանում ենք այնտեղ, որտեղ բիզնեսին պետք են աճ, թափանցիկություն և աշխատող թվային գործիք՝ առանց խորհրդատվության ու ներդրման միջև բացի։",
    capabilities: [["Ռազմավարություն և վերլուծություն", "Գտնում ենք սահմանափակումները, ստուգում տվյալները և կազմում գործողությունների պլան։"], ["Կայքեր և պրոդուկտներ", "Նախագծում ենք պարզ թվային սցենարներ և ստեղծում արագ, ադապտիվ պրոդուկտներ։"], ["CRM և BI համակարգեր", "Միավորում ենք վաճառքները, գործընթացները և կառավարման ցուցանիշները մեկ համակարգում։"]],
    processTitle: "Ինչպես ենք աշխատում", processText: "Յուրաքանչյուր փուլ ունի հստակ արդյունք, պատասխանատու և հաջորդ որոշման կետ։",
    process: [["Ուսումնասիրություն", "Սահմանում ենք նպատակը, սահմանափակումները և հաջողության չափանիշները։"], ["Ճարտարապետություն", "Կազմում ենք սցենարը, լուծման կազմը և թափանցիկ գնահատումը։"], ["Իրականացում", "Կարճ փուլերով ցույց ենք տալիս գործող արդյունքը։"], ["Գործարկում", "Ստուգում, փոխանցում ենք համակարգը և զարգացման պլանը։"]],
    final: "Պե՞տք է թիմ, որը կհասկանա խնդիրը և լուծումը կհասցնի գործարկման։",
  },
  bg: {
    title: "Екип, който отговаря за бизнес резултата",
    lead: "Agile Business обединява стратегия, анализ, дизайн и разработка. Един екип води задачата от диагностиката до работещата система.",
    services: "Вижте услугите", discuss: "Обсъдете задача",
    positioning: "Включваме се там, където бизнесът има нужда от растеж, прозрачност и работещ дигитален инструмент.",
    capabilities: [["Стратегия и анализ", "Откриваме ограниченията, проверяваме данните и изграждаме план за действие."], ["Сайтове и продукти", "Проектираме ясни дигитални сценарии и бързи адаптивни продукти."], ["CRM и BI системи", "Свързваме продажби, процеси и управленски показатели в една система."]],
    processTitle: "Как работим", processText: "Всеки етап има ясен резултат, отговорник и следваща точка за решение.",
    process: [["Диагностика", "Определяме целта, ограниченията и показателите за успех."], ["Архитектура", "Изграждаме сценария, обхвата и прозрачната оценка."], ["Реализация", "Показваме работещ резултат на кратки итерации."], ["Стартиране", "Проверяваме, предаваме системата и плана за развитие."]],
    final: "Нужен ли ви е екип, който разбира задачата и довежда решението до старт?",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return buildPageMetadata(lang, "/about", copy[lang].title, copy[lang].lead);
}

export default async function About({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const d = getDictionary(locale);
  const t = copy[locale];

  return <main className="about-page">
    <section className="about-overview shell">
      <div className="about-brand-lockup"><Image src="/brand-logo.png" alt="Agile Business" width={104} height={72} priority /><span>Agile Business</span></div>
      <div className="about-overview-main"><h1>{t.title}</h1><p>{t.lead}</p><div><Link className="button" href={`/${locale}/services`}>{t.services}<span>↗</span></Link><Link className="about-text-link" href={`/${locale}/contacts`}>{t.discuss}<span>→</span></Link></div></div>
      <div className="about-proof" aria-label="Agile Business facts">{d.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    </section>

    <section className="about-positioning shell">
      <span>AGILE BUSINESS / EXPERTISE</span>
      <h2>{t.positioning}</h2>
      <div className="about-capability-grid">{t.capabilities.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><i aria-hidden="true">↗</i></article>)}</div>
    </section>

    <section className="about-operating shell">
      <header><h2>{t.processTitle}</h2><p>{t.processText}</p></header>
      <ol>{t.process.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol>
    </section>

    <section className="about-final shell"><h2>{t.final}</h2><Link className="button" href={`/${locale}/contacts`}>{t.discuss}<span>↗</span></Link></section>
  </main>;
}
