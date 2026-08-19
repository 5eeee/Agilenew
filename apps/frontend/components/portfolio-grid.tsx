"use client";

import Image from "next/image";
import Link from "next/link";
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

  return (
      <div className="portfolio-grid portfolio-logo-grid">
        {projects.map((project) => <article className="portfolio-card portfolio-card-direct" key={project.slug}>
          <Link className="portfolio-card-visual" href={`/${locale}/projects/${project.slug}`} aria-label={`${t.caseStudy}: ${project.title}`}>
            <span className={`portfolio-card-logo logo-${project.slug}`}>{project.logo ? <Image src={project.logo} alt={`${project.title} logo`} fill sizes="(max-width: 760px) 82vw, 38vw" /> : project.title}</span>
          </Link>
        </article>)}
      </div>
  );
}
