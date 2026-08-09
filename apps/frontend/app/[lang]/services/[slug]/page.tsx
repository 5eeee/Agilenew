import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { getServiceCatalog } from "@/lib/service-catalog";
import { buildPageMetadata } from "@/lib/seo";

const copy = {
  ru: { back: "Все услуги", format: "Формат", budget: "Стартовый бюджет", result: "Что получит бизнес", roadmap: "Roadmap проекта", steps: ["Диагностика", "Архитектура", "Дизайн и сборка", "Проверка", "Запуск и развитие"], stepText: ["Фиксируем задачу, аудиторию, ограничения и показатели успеха.", "Проектируем пользовательский сценарий, состав системы и интеграции.", "Создаём интерфейс и рабочую версию короткими итерациями.", "Тестируем ключевые сценарии, скорость и адаптивность.", "Запускаем, измеряем результат и передаём понятный план развития."], action: "Добавить услугу", calculate: "Рассчитать свой проект", consult: "Записаться бесплатно", note: "Состав и сроки фиксируем после короткого интервью. Каждый этап имеет понятный результат и точку приёмки." },
  en: { back: "All services", format: "Format", budget: "Starting budget", result: "Business outcome", roadmap: "Project roadmap", steps: ["Discovery", "Architecture", "Design and build", "Quality review", "Launch and growth"], stepText: ["We define the objective, audience, constraints and success metrics.", "We design the user journey, system scope and integrations.", "We build the interface and working release in short iterations.", "We test key journeys, performance and responsive behaviour.", "We launch, measure the outcome and hand over a clear growth plan."], action: "Add service", calculate: "Estimate custom project", consult: "Book a free call", note: "Scope and timing are confirmed after a short interview. Every stage has a clear output and acceptance point." },
  ka: { back: "ყველა სერვისი", format: "ფორმატი", budget: "საწყისი ბიუჯეტი", result: "ბიზნეს შედეგი", roadmap: "პროექტის roadmap", steps: ["დიაგნოსტიკა", "არქიტექტურა", "დიზაინი და აწყობა", "შემოწმება", "გაშვება და ზრდა"], stepText: ["ვაფიქსირებთ მიზანს, აუდიტორიას და წარმატების მეტრიკებს.", "ვქმნით სცენარს, სისტემის შემადგენლობას და ინტეგრაციებს.", "ვაწყობთ ინტერფეისსა და სამუშაო ვერსიას მოკლე ეტაპებად.", "ვამოწმებთ სცენარებს, სიჩქარესა და ადაპტივს.", "ვუშვებთ, ვზომავთ შედეგს და ვადგენთ განვითარების გეგმას."], action: "სერვისის დამატება", calculate: "ინდივიდუალური პროექტის შეფასება", consult: "უფასო კონსულტაცია", note: "შემადგენლობა და ვადები მოკლე ინტერვიუს შემდეგ ფიქსირდება." },
  hy: { back: "Բոլոր ծառայությունները", format: "Ձևաչափ", budget: "Մեկնարկային բյուջե", result: "Բիզնես արդյունք", roadmap: "Նախագծի roadmap", steps: ["Ախտորոշում", "Ճարտարապետություն", "Դիզայն և մշակում", "Ստուգում", "Գործարկում և աճ"], stepText: ["Սահմանում ենք նպատակը, լսարանը և հաջողության չափանիշները։", "Նախագծում ենք սցենարը, համակարգի կազմը և ինտեգրումները։", "Ստեղծում ենք ինտերֆեյսն ու աշխատանքային տարբերակը փուլերով։", "Փորձարկում ենք սցենարները, արագությունն ու ադապտիվությունը։", "Գործարկում ենք, չափում արդյունքը և փոխանցում զարգացման պլանը։"], action: "Ավելացնել ծառայությունը", calculate: "Հաշվել անհատական նախագիծը", consult: "Անվճար խորհրդատվություն", note: "Կազմն ու ժամկետները հաստատվում են կարճ հարցազրույցից հետո։" },
  bg: { back: "Всички услуги", format: "Формат", budget: "Начален бюджет", result: "Бизнес резултат", roadmap: "Roadmap на проекта", steps: ["Диагностика", "Архитектура", "Дизайн и разработка", "Проверка", "Стартиране и развитие"], stepText: ["Фиксираме целта, аудиторията и показателите за успех.", "Проектираме сценария, системата и интеграциите.", "Изграждаме интерфейса и работещата версия на кратки етапи.", "Тестваме сценариите, скоростта и адаптивността.", "Стартираме, измерваме резултата и предаваме план за развитие."], action: "Добави услугата", calculate: "Изчисли индивидуален проект", consult: "Безплатна консултация", note: "Обхватът и сроковете се потвърждават след кратко интервю." },
} as const;

function price(value: number, locale: Locale) {
  if (!value) return copy[locale].consult;
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);
}

export function generateStaticParams() {
  return locales.flatMap((lang) => getServiceCatalog(lang).map((service) => ({ lang, slug: service.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const service = getServiceCatalog(lang).find((item) => item.id === slug);
  return service ? buildPageMetadata(lang, `/services/${slug}`, service.title, service.summary) : {};
}

export default async function ServiceDetail({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const service = getServiceCatalog(locale).find((item) => item.id === slug);
  if (!service) notFound();
  const t = copy[locale];

  return <main className="service-detail shell">
    <Link className="service-detail-back" href={`/${locale}/services`}>← {t.back}</Link>
    <section className="service-detail-hero">
      <div className="service-detail-index"><span>AGILE BUSINESS / SERVICE</span><strong>{service.category}</strong></div>
      <div className="service-detail-title"><h1>{service.title}</h1><p>{service.summary}</p></div>
      <dl><div><dt>{t.format}</dt><dd>{service.duration}</dd></div><div><dt>{t.budget}</dt><dd>{price(service.price, locale)}</dd></div><div><dt>{t.result}</dt><dd>{service.features.join(" · ")}</dd></div></dl>
    </section>
    <section className="service-roadmap">
      <header><span>01—05</span><h2>{t.roadmap}</h2><p>{t.note}</p></header>
      <ol>{t.steps.map((step, index) => <li key={step}><span>0{index + 1}</span><div><h3>{step}</h3><p>{t.stepText[index]}</p></div><i aria-hidden="true" /></li>)}</ol>
    </section>
    <section className="service-detail-cta">
      <p>{service.summary}</p>
      <Link className="button" href={service.consultation ? `/${locale}/contacts` : service.custom ? `/${locale}/calculator` : `/${locale}/services#${service.id}`}>{service.consultation ? t.consult : service.custom ? t.calculate : t.action}<span>↗</span></Link>
    </section>
  </main>;
}
