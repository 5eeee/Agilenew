import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductVisual } from "@/components/product-visual";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { getProject, projectSlugs } from "@/lib/projects";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((lang) => projectSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const project = getProject(slug, lang);
  return project ? buildPageMetadata(lang, `/projects/${slug}`, project.title, project.lead) : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const project = getProject(slug, locale);
  if (!project) notFound();
  const ru = locale === "ru";
  const hy = locale === "hy";
  const labels = ru
    ? { all: "Все проекты", essence: "Суть проекта", impact: "Польза для бизнеса", made: "Что сделала команда", challenge: "Задача", solution: "Решение", tech: "Технологии", duration: "Срок реализации", gallery: "Десктопная версия проекта", comment: "Комментарий заказчика", cta: "Обсудить похожий проект", website: "Перейти на сайт" }
    : hy
      ? { all: "Բոլոր նախագծերը", essence: "Նախագծի էությունը", impact: "Գլխավոր արդյունքը", made: "Ինչ է արել թիմը", challenge: "Խնդիր", solution: "Լուծում", tech: "Տեխնոլոգիաներ", duration: "Իրականացման ժամկետ", gallery: "Նախագծի համակարգչային տարբերակը", comment: "Հաճախորդի մեկնաբանությունը", cta: "Քննարկել նման նախագիծ", website: "Բացել կայքը" }
      : { all: "All projects", essence: "Project overview", impact: "Business impact", made: "What the team delivered", challenge: "Challenge", solution: "Solution", tech: "Technology", duration: "Delivery time", gallery: "Desktop project view", comment: "Client comment", cta: "Discuss a similar project", website: "Visit website" };

  return (
    <article className="case-page case-page-clean shell">
      <header className="case-clean-head">
        <div><Link href={`/${locale}/projects`} className="case-back"><span aria-hidden="true">←</span>{labels.all}</Link><span>{project.category}</span></div>
        <h1>{project.title}</h1>
      </header>

      <section className="case-clean-showcase">
        <aside className="case-clean-identity">
          {project.logo ? <div className={`case-clean-logo logo-${project.slug}`}><Image src={project.logo} alt={`${project.title} logo`} fill sizes="(max-width: 760px) 220px, 300px" priority /></div> : <strong className="case-clean-wordmark">{project.title}</strong>}
          <div className="case-clean-essence">
            <h2>{labels.essence}</h2>
            <p>{project.lead} {project.description}</p>
          </div>
        </aside>
        <div className="case-clean-media" aria-label={labels.gallery}>
          {project.image ? <figure className="case-clean-desktop"><Image src={project.image} alt={`${project.title} — desktop`} fill sizes="(max-width: 760px) 94vw, 72vw" priority /></figure> : <div className="case-clean-product"><ProductVisual product={project.slug} /></div>}
        </div>
      </section>

      <section className="case-clean-priority">
        <h2>{labels.impact}</h2>
        <p>{[project.result, ...project.benefits].join(" ")}</p>
      </section>

      <section className="case-clean-story">
        <section className="case-clean-delivery">
          <span>01</span>
          <h2>{labels.made}</h2>
          <p>{project.description}</p>
          <ul>{project.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <aside className="case-clean-support">
          <section><span>{labels.challenge}</span><p>{project.challenge}</p></section>
          <section><span>{labels.solution}</span><p>{project.solution}</p></section>
          <dl className="case-clean-meta">
            {project.duration ? <div><dt>{labels.duration}</dt><dd>{project.duration}</dd></div> : null}
            <div><dt>{labels.tech}</dt><dd>{project.tech.join(" · ")}</dd></div>
          </dl>
        </aside>
      </section>

      <nav className="case-clean-actions" aria-label="Project actions">
        {project.website ? <a className="case-clean-site" href={project.website} target="_blank" rel="noreferrer">{labels.website}<span>↗</span></a> : null}
        <Link className="case-clean-similar" href={`/${locale}/contacts?project=${project.slug}`}>{labels.cta}<span>→</span></Link>
      </nav>

      <blockquote className="case-clean-comment">
        <small>{labels.comment}</small>
        <p>“{project.testimonial}”</p>
        <footer>{project.title}</footer>
      </blockquote>
    </article>
  );
}
