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
    ? { all: "Все проекты", impact: "Польза для бизнеса", made: "Что сделали", tech: "Технологии", duration: "Срок реализации", gallery: "Проект на разных устройствах", comment: "Комментарий заказчика", cta: "Обсудить похожий проект", website: "Перейти на сайт" }
    : hy
      ? { all: "Բոլոր նախագծերը", impact: "Օգուտը բիզնեսին", made: "Ինչ ենք արել", tech: "Տեխնոլոգիաներ", duration: "Իրականացման ժամկետ", gallery: "Նախագիծը տարբեր սարքերում", comment: "Հաճախորդի մեկնաբանությունը", cta: "Քննարկել նման նախագիծ", website: "Բացել կայքը" }
      : { all: "All projects", impact: "Business impact", made: "What we delivered", tech: "Technology", duration: "Delivery time", gallery: "Project across devices", comment: "Client comment", cta: "Discuss a similar project", website: "Visit website" };

  return (
    <article className="case-page case-page-clean shell">
      <header className="case-clean-head">
        <div><Link href={`/${locale}/projects`} className="case-back">← {labels.all}</Link><span>{project.category}</span></div>
        <h1>{project.title}</h1>
        <p>{project.lead}</p>
      </header>

      <section className="case-clean-overview">
        <aside className="case-clean-info">
          {project.logo ? <div className={`case-clean-logo logo-${project.slug}`}><Image src={project.logo} alt={`${project.title} logo`} fill sizes="(max-width: 760px) 220px, 300px" priority /></div> : null}
          <section className="case-clean-benefit"><span>{labels.impact}</span><h2>{project.result}</h2></section>
          <section className="case-clean-delivery">
            <span>{labels.made}</span>
            <p>{project.description}</p>
            <ul>{project.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <dl className="case-clean-meta">
            {project.duration ? <div><dt>{labels.duration}</dt><dd>{project.duration}</dd></div> : null}
            <div><dt>{labels.tech}</dt><dd>{project.tech.join(" · ")}</dd></div>
          </dl>
        </aside>

        <div className="case-clean-media" aria-label={labels.gallery}>
          {project.image ? <figure className="case-clean-desktop"><Image src={project.image} alt={`${project.title} — desktop`} fill sizes="(max-width: 760px) 94vw, 58vw" priority /></figure> : <div className="case-clean-product"><ProductVisual product={project.slug} /></div>}
          {project.mobileImage ? <figure className="case-clean-mobile"><Image src={project.mobileImage} alt={`${project.title} — mobile`} fill sizes="(max-width: 760px) 94vw, 22vw" /></figure> : null}
        </div>
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
