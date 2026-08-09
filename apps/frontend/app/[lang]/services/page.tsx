import { notFound } from "next/navigation";
import { ServiceCatalog } from "@/components/service-catalog";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getServiceCatalog } from "@/lib/service-catalog";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDictionary(lang);
  return buildPageMetadata(lang, "/services", d.page.servicesTitle, d.page.servicesText);
}

const pageCopy = {
  ru: { kicker: "Каталог / 2026", title: "Решения с понятной точкой старта", text: "Выберите один или несколько форматов. Мы объединим их в проект, проверим зависимости и зафиксируем финальную смету после интервью.", market: "Цены рассчитаны для полноценной команды: аналитика, дизайн, разработка, QA, управление и обязательный резерв на запуск. Это не шаблонные пакеты — указан минимальный бюджет качественного проекта.", steps: ["Выберите состав", "Войдите в кабинет", "Получите план и смету"] },
  en: { kicker: "Catalogue / 2026", title: "Solutions with a clear starting point", text: "Choose one or several formats. We will combine them into a project, check dependencies and confirm the final estimate after discovery.", market: "Prices cover a complete team: analytics, design, development, QA, management and a launch reserve. These are not template packages — each amount is the minimum for a quality delivery.", steps: ["Choose the scope", "Sign in", "Receive the plan"] },
  ka: { kicker: "კატალოგი / 2026", title: "გადაწყვეტილებები მკაფიო საწყისი წერტილით", text: "აირჩიეთ ერთი ან რამდენიმე ფორმატი. მათ ერთ პროექტად გავაერთიანებთ და ინტერვიუს შემდეგ დავაფიქსირებთ საბოლოო ბიუჯეტს.", market: "ფასი მოიცავს სრულ გუნდს: ანალიტიკას, დიზაინს, განვითარებას, QA-ს, მართვას და გაშვების რეზერვს.", steps: ["აირჩიეთ შემადგენლობა", "შედით ანგარიშში", "მიიღეთ გეგმა"] },
  hy: { kicker: "Կատալոգ / 2026", title: "Լուծումներ՝ հստակ մեկնարկային կետով", text: "Ընտրեք մեկ կամ մի քանի ձևաչափ։ Մենք դրանք կմիավորենք մեկ նախագծում և հարցազրույցից հետո կհաստատենք վերջնական նախահաշիվը։", market: "Գինը ներառում է ամբողջական թիմ՝ վերլուծություն, դիզայն, մշակում, QA, կառավարում և մեկնարկի պահուստ։", steps: ["Ընտրեք կազմը", "Մուտք գործեք", "Ստացեք պլանն ու նախահաշիվը"] },
  bg: { kicker: "Каталог / 2026", title: "Решения с ясна начална точка", text: "Изберете един или няколко формата. Ще ги обединим в проект и ще потвърдим крайната оферта след интервю.", market: "Цените включват пълен екип: анализ, дизайн, разработка, QA, управление и резерв за старта.", steps: ["Изберете обхват", "Влезте в профила", "Получете план"] },
} as const;

export default async function Services({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const copy = pageCopy[locale];
  const services = getServiceCatalog(locale);

  return (
    <>
      <section className="services-commerce-hero shell">
        <div><span>{copy.kicker}</span><h1>{copy.title}</h1></div>
        <div><p>{copy.text}</p><ol>{copy.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol></div>
      </section>
      <section className="services-commerce-section shell">
        <ServiceCatalog services={services} locale={locale} />
      </section>
      <section className="pricing-note shell"><span>PRICING LOGIC</span><p>{copy.market}</p></section>
    </>
  );
}
