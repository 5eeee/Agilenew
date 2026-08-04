import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

type Project = {
  slug: string;
  title: string;
  category: string;
  image: string;
};

export function ProjectGrid({ projects, locale }: { projects: readonly Project[]; locale: string }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <Link
          className="project-card"
          href={`/${locale}/projects/${project.slug}`}
          key={project.title}
          style={{ "--card-order": index } as CSSProperties}
        >
          <Image src={project.image} alt="" fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" />
          <span className="project-shade" />
          <span className="project-meta">
            <small>{project.category}</small>
            <strong>{project.title}</strong>
          </span>
          <span className="project-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}
