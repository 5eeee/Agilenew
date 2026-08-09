"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

type Service = readonly [string, string, string];
type Step = readonly [string, string];
type Project = { slug: string; title: string; description: string; image: string };

type PresentationHomeProps = {
  locale: string;
  title: string;
  terms: readonly string[];
  outcomes: readonly string[];
  text: string;
  primary: string;
  secondary: string;
  servicesTitle: string;
  servicesText: string;
  services: readonly Service[];
  methodTitle: string;
  steps: readonly Step[];
  projects: readonly Project[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

function SectionBar({ left = "AGILE BUSINESS", right = "People | Process | Technology" }: { left?: string; right?: string }) {
  return <div className="pres-section-bar"><span>{left}</span><span>{right}</span></div>;
}

function WaveField() {
  return <div className="pres-fold-field" aria-hidden="true">
    <div className="pres-fold-track">
      {Array.from({ length: 44 }, (_, index) => <i key={index} style={{ "--fold": index, "--delay": `${-index * 0.19}s` } as CSSProperties} />)}
    </div>
  </div>;
}

export function PresentationHome(props: PresentationHomeProps) {
  const [term, setTerm] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setTerm((current) => (current + 1) % props.outcomes.length), 3200);
    return () => window.clearInterval(timer);
  }, [props.outcomes.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setProjectIndex((current) => (current + 1) % props.projects.length), 2600);
    return () => window.clearInterval(timer);
  }, [props.projects.length]);

  const activeProject = props.projects[projectIndex];

  return <main className="presentation-home">
    <div className="presentation-shell">
      <section className="pres-block pres-hero">
        <SectionBar />
        <div className="pres-hero-stage">
          <div className="pres-curtain" aria-hidden="true"><WaveField /></div>
          <div className="pres-hero-copy">
            <p>{props.text}</p>
            <h1>{props.title}</h1>
          </div>
          <div className="pres-hero-footer"><span>Strategy</span><span>Design</span><span>Technology</span></div>
        </div>
      </section>

      <section className="pres-block pres-spheres">
        <SectionBar left="СФЕРЫ КОМПАНИИ" right="Expertise | Systems | Growth" />
        <div className="pres-spheres-stage">
          <span className="pres-spheres-index">0{term + 1} / 0{props.outcomes.length}</span>
          <p>Соединяем экспертизу в единый рабочий контур</p>
          <h2 key={props.terms[term % props.terms.length]}>{props.terms[term % props.terms.length]}</h2>
          <h3 key={props.outcomes[term]}>Увеличиваем {props.outcomes[term]}</h3>
          <div className="pres-spheres-progress"><i style={{ "--progress-index": term } as CSSProperties} /></div>
        </div>
      </section>

      <section className="pres-block pres-feature">
        <SectionBar left="УСЛУГИ" />
        <div className="pres-services-layout">
          <header><span className="pres-red-label">Business solutions</span><h2>{props.servicesTitle}</h2><p>{props.servicesText}</p><Link href={`/${props.locale}/services`}>Все услуги <i>↗</i></Link></header>
          <div className="pres-services-grid">
            {props.services.map((service, index) => <article key={service[0]}><span>0{index + 1}</span><h3>{service[1]}</h3><p>{service[2]}</p><Link href={`/${props.locale}/services`}>Подробнее <i>↗</i></Link></article>)}
          </div>
        </div>
      </section>

      <section className="pres-block pres-portfolio pres-work-showcase">
        <SectionBar left="НАШИ РАБОТЫ" right="Clients | Products | Platforms" />
        <div className="pres-work-showcase-grid">
          <div className="pres-work-logo-window" aria-label="Проекты Agile Business">
            <div className="pres-work-logo-track" style={{ "--project-index": projectIndex } as CSSProperties}>
              {props.projects.map((project, index) => <div className="pres-work-logo-slide" key={project.slug}><span>0{index + 1}</span><strong>{project.title}</strong><small>Agile Business / Project</small></div>)}
            </div>
            <div className="pres-work-progress">{props.projects.map((project, index) => <i className={index === projectIndex ? "active" : ""} key={project.slug} />)}</div>
          </div>
          <Link className="pres-work-project-window" href={`/${props.locale}/projects/${activeProject.slug}`}>
            <div className="pres-work-project-frame" key={activeProject.slug}>
              <Image src={activeProject.image} alt={`${activeProject.title} interface`} fill sizes="(max-width: 760px) 96vw, 66vw" priority={projectIndex === 0} />
              <div className="pres-work-project-caption"><span>0{projectIndex + 1} / 0{props.projects.length}</span><div><strong>{activeProject.title}</strong><p>{activeProject.description}</p></div><i>↗</i></div>
            </div>
          </Link>
        </div>
      </section>

      <section className="pres-block pres-process">
        <SectionBar right="How we work" />
        <h2>{props.methodTitle}</h2>
        <ol>{props.steps.map((step, index) => <li key={step[0]}><span>0{index + 1}</span><h3>{step[0]}</h3><p>{step[1]}</p></li>)}</ol>
      </section>

      <section className="pres-block pres-final">
        <SectionBar right="Start a project" />
        <div><h2>{props.ctaTitle}</h2><p>{props.ctaText}</p><Link href={`/${props.locale}/contacts`}>{props.ctaButton}<i>↗</i></Link></div>
      </section>
    </div>
  </main>;
}
