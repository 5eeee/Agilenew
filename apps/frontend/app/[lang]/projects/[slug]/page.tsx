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
    ? { all: "Все проекты", about: "О проекте", challenge: "Задача", solution: "Решение", made: "Что сделали", tech: "Технологическая основа", result: "Результат", cta: "Обсудить похожий проект" }
    : hy
      ? { all: "Բոլոր նախագծերը", about: "Նախագծի մասին", challenge: "Խնդիր", solution: "Լուծում", made: "Ինչ ենք արել", tech: "Տեխնոլոգիական հիմք", result: "Արդյունք", cta: "Քննարկել նման նախագիծ" }
      : { all: "All projects", about: "About the project", challenge: "Challenge", solution: "Solution", made: "What we delivered", tech: "Technology foundation", result: "Outcome", cta: "Discuss a similar project" };

  return (
    <article className="case-page shell">
      <header className="case-head">
        <Link href={`/${locale}/projects`} className="case-back">← {labels.all}</Link>
        <p>{project.category}</p>
        <h1>{project.title}</h1>
        <strong>{project.lead}</strong>
      </header>
      <div className={`case-cover ${project.image ? "case-cover-real" : ""}`}>
        {project.image ? <div className="case-device-preview">
          <div className="case-browser-frame"><span><i /><i /><i /></span><Image src={project.image} alt={`${project.title} — desktop`} fill sizes="(max-width: 760px) 92vw, 78vw" priority /></div>
          {project.mobileImage ? <div className="case-phone-frame"><span /><Image src={project.mobileImage} alt={`${project.title} — mobile`} fill sizes="(max-width: 760px) 120px, 210px" /></div> : null}
        </div> : <ProductVisual product={project.slug} />}
      </div>
      <section className="case-story">
        <div className="case-story-title"><span>01</span><h2>{labels.about}</h2></div>
        <p>{project.description}</p>
      </section>
      <section className="case-decisions">
        <article><span>02 / {labels.challenge}</span><h2>{project.challenge}</h2></article>
        <article><span>03 / {labels.solution}</span><h2>{project.solution}</h2></article>
      </section>
      <section className="case-build">
        <div><span>04</span><h2>{labels.made}</h2></div>
        <ol>{project.deliverables.map((item, index) => <li key={item}><span>0{index + 1}</span><strong>{item}</strong></li>)}</ol>
      </section>
      <section className="case-tech"><p>{labels.tech}</p><div className="tech-stack" aria-label={labels.tech}>{project.tech.map((item) => <span key={item}>{item}</span>)}</div></section>
      <blockquote className="case-result"><span>{labels.result}</span><p>“{project.result}”</p><div className="case-result-actions"><Link className="button" href={`/${locale}/contacts?project=${project.slug}`}>{labels.cta}</Link>{project.website ? <a className="case-website-link" href={project.website} target="_blank" rel="noreferrer">{ru ? "Открыть сайт" : hy ? "Բացել կայքը" : "Visit website"}<span>↗</span></a> : null}</div></blockquote>
      <Link className="case-all-link" href={`/${locale}/projects`}>{labels.all}<span>→</span></Link>
    </article>
  );
}
