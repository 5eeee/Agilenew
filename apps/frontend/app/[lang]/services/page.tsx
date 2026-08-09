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
  ru: { kicker: "Каталог / 2026", title: "Выбирайте решение по бизнес-задаче", text: "Не нужно заранее знать технический стек. Расскажите, что должно измениться в продажах или процессах, — мы предложим минимальный рабочий состав проекта.", pricingTitle: "Как формируется стоимость", market: "Показываем честный стартовый бюджет небольшой сильной команды. Финальный состав можно уменьшить или разбить на этапы после бесплатной консультации.", steps: ["Бесплатно разберём задачу", "Соберите нужное", "Сохраните проект"] },
  en: { kicker: "Catalogue / 2026", title: "Choose a solution by business outcome", text: "You do not need to know the technical stack. Tell us what should change in sales or operations and we will propose the smallest viable project scope.", pricingTitle: "How pricing works", market: "These are transparent starting budgets for a focused senior team. The final scope can be reduced or split into stages after a free consultation.", steps: ["Discuss the task for free", "Build the scope", "Save the project"] },
  ka: { kicker: "კატალოგი / 2026", title: "აირჩიეთ გადაწყვეტა ბიზნეს ამოცანის მიხედვით", text: "ტექნიკური სტეკის წინასწარ ცოდნა არ გჭირდებათ. გვითხარით, რა უნდა შეიცვალოს გაყიდვებში ან პროცესებში.", pricingTitle: "როგორ ყალიბდება ფასი", market: "ეს არის მცირე ძლიერი გუნდის გამჭვირვალე საწყისი ბიუჯეტი. უფასო კონსულტაციის შემდეგ პროექტი შეიძლება ეტაპებად დაიყოს.", steps: ["უფასო განხილვა", "შეარჩიეთ შემადგენლობა", "შეინახეთ პროექტი"] },
  hy: { kicker: "Կատալոգ / 2026", title: "Ընտրեք լուծումը բիզնես խնդրով", text: "Պետք չէ նախապես իմանալ տեխնոլոգիաները։ Ասեք՝ ինչ պետք է փոխվի վաճառքներում կամ գործընթացներում, և մենք կառաջարկենք նվազագույն աշխատող կազմը։", pricingTitle: "Ինչպես է ձևավորվում արժեքը", market: "Սրանք փոքր ուժեղ թիմի թափանցիկ մեկնարկային բյուջեներն են։ Անվճար խորհրդատվությունից հետո նախագիծը կարելի է բաժանել փուլերի։", steps: ["Անվճար քննարկում", "Ընտրեք կազմը", "Պահպանեք նախագիծը"] },
  bg: { kicker: "Каталог / 2026", title: "Изберете решение според бизнес целта", text: "Не е нужно да знаете технологиите предварително. Кажете какво трябва да се промени в продажбите или процесите.", pricingTitle: "Как се формира цената", market: "Това са прозрачни начални бюджети за малък силен екип. След безплатна консултация проектът може да се раздели на етапи.", steps: ["Безплатен разговор", "Изберете обхват", "Запазете проекта"] },
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
        <div><h1>{copy.title}</h1></div>
        <div><ol>{copy.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol></div>
      </section>
      <section className="services-commerce-section shell">
        <ServiceCatalog services={services} locale={locale} />
      </section>
      <section className="pricing-note shell"><span className="pricing-note-label">{copy.pricingTitle}</span><p>{copy.market}</p></section>
    </>
  );
}
