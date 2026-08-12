"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { Project } from "@/lib/projects";

const labels = {
  ru: { all: "Все", caseStudy: "Посмотреть проект", website: "Открыть сайт", result: "Результат" },
  en: { all: "All", caseStudy: "View project", website: "Open website", result: "Outcome" },
  ka: { all: "ყველა", caseStudy: "პროექტის ნახვა", website: "საიტის გახსნა", result: "შედეგი" },
  hy: { all: "Բոլորը", caseStudy: "Դիտել նախագիծը", website: "Բացել կայքը", result: "Արդյունք" },
  bg: { all: "Всички", caseStudy: "Вижте проекта", website: "Отворете сайта", result: "Резултат" },
} as const;

export function PortfolioGrid({ projects, locale }: { projects: readonly Project[]; locale: keyof typeof labels }) {
  const t = labels[locale];
  const categories = useMemo(() => [t.all, ...Array.from(new Set(projects.map((project) => project.category)))], [projects, t.all]);
  const [activeCategory, setActiveCategory] = useState<string>(t.all);
  const [expanded, setExpanded] = useState<string | null>(null);
  const visibleProjects = activeCategory === t.all ? projects : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      <div className="portfolio-filters" aria-label="Project filters">
        {categories.map((category) => <button className={category === activeCategory ? "active" : ""} type="button" aria-pressed={category === activeCategory} key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}
      </div>
      <div className="portfolio-grid" key={activeCategory}>
        {visibleProjects.map((project, index) => <article className={`portfolio-card ${expanded === project.slug ? "expanded" : ""}`} key={project.slug} style={{ "--portfolio-order": index } as CSSProperties}>
          <button className="portfolio-card-visual" type="button" onClick={() => setExpanded((current) => current === project.slug ? null : project.slug)} aria-expanded={expanded === project.slug} aria-label={`${t.caseStudy}: ${project.title}`}>
            {project.image ? <Image src={project.image} alt={`${project.title} — interface preview`} fill sizes="(max-width: 760px) 92vw, (max-width: 1100px) 50vw, 40vw" /> : null}
            <span className="portfolio-card-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="portfolio-card-open" aria-hidden="true">{expanded === project.slug ? "−" : "+"}</span>
          </button>
          <div className="portfolio-card-copy">
            <div><span>{project.category}</span><span>{project.year}</span></div>
            <h2><Link href={`/${locale}/projects/${project.slug}`}>{project.title}</Link></h2>
            <p><span>{t.result}</span>{project.lead}</p>
            <div className="portfolio-card-details" aria-hidden={expanded !== project.slug}>
              <p>{project.result}</p>
              <ul>{project.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="portfolio-card-actions">
              <Link className="portfolio-case-button" href={`/${locale}/projects/${project.slug}`}>{t.caseStudy}<i aria-hidden="true">→</i></Link>
              {project.website ? <a className="portfolio-site-button" href={project.website} target="_blank" rel="noreferrer">{t.website}<i aria-hidden="true">↗</i></a> : null}
            </div>
          </div>
        </article>)}
      </div>
    </>
  );
}
