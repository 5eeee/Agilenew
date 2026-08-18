"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import type { Project } from "@/lib/projects";

const labels = {
  ru: { all: "Все", caseStudy: "Посмотреть проект", website: "Открыть сайт", result: "Польза бизнесу" },
  en: { all: "All", caseStudy: "View project", website: "Open website", result: "Outcome" },
  ka: { all: "ყველა", caseStudy: "პროექტის ნახვა", website: "საიტის გახსნა", result: "შედეგი" },
  hy: { all: "Բոլորը", caseStudy: "Դիտել նախագիծը", website: "Բացել կայքը", result: "Արդյունք" },
  bg: { all: "Всички", caseStudy: "Вижте проекта", website: "Отворете сайта", result: "Резултат" },
} as const;

export function PortfolioGrid({ projects, locale }: { projects: readonly Project[]; locale: keyof typeof labels }) {
  const t = labels[locale];
  const categories = useMemo(() => [t.all, ...Array.from(new Set(projects.map((project) => project.category)))], [projects, t.all]);
  const [activeCategory, setActiveCategory] = useState<string>(t.all);
  const visibleProjects = activeCategory === t.all ? projects : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      <div className="portfolio-filters" aria-label="Project filters">
        {categories.map((category) => <button className={category === activeCategory ? "active" : ""} type="button" aria-pressed={category === activeCategory} key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}
      </div>
      <div className="portfolio-grid" key={activeCategory}>
        {visibleProjects.map((project, index) => <article className="portfolio-card portfolio-card-direct" key={project.slug} style={{ "--portfolio-order": index } as CSSProperties}>
          <Link className="portfolio-card-visual" href={`/${locale}/projects/${project.slug}`} aria-label={`${t.caseStudy}: ${project.title}`}>
            <span className={`portfolio-card-logo logo-${project.slug}`}>{project.logo ? <Image src={project.logo} alt={`${project.title} logo`} fill sizes="(max-width: 760px) 82vw, 38vw" /> : project.title}</span>
            <span className="portfolio-card-index">{String(index + 1).padStart(2, "0")}</span>
            <span className="portfolio-card-open" aria-hidden="true">↗</span>
            <span className="portfolio-card-caption"><small>{project.category}</small><strong>{project.title}</strong></span>
          </Link>
        </article>)}
      </div>
    </>
  );
}
