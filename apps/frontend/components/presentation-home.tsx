"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Service = readonly [string, string, string];
type Step = readonly [string, string];
type Project = { slug: string; title: string; description: string; image: string; website: string };

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

function GradientField() {
  return <><div className="pres-gradient-field" aria-hidden="true"><i /><i /><i /></div><div className="pres-ribbed-glass" aria-hidden="true" /></>;
}

export function PresentationHome(props: PresentationHomeProps) {
  const [term, setTerm] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const heroStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = heroStageRef.current;
    if (!stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const updateHero = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / Math.max(stage.offsetHeight, 1)));
      stage.style.setProperty("--hero-bg-shift", `${progress * 38}px`);
      stage.style.setProperty("--hero-bg-scale", `${1 + progress * 0.08}`);
      stage.style.setProperty("--hero-copy-shift", `${progress * -36}px`);
      stage.style.setProperty("--hero-copy-scale", `${1 + progress * 0.14}`);
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(updateHero); };
    updateHero();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

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
        <div className="pres-hero-stage" ref={heroStageRef}>
          <div className="pres-curtain" aria-hidden="true"><GradientField /></div>
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
              {props.projects.map((project, index) => <div className="pres-work-logo-slide" key={project.slug}><span>0{index + 1}</span><strong>{project.title}</strong></div>)}
            </div>
          </div>
          <div className="pres-work-project-window">
            <Link className="pres-work-project-frame" href={`/${props.locale}/projects/${activeProject.slug}`} key={activeProject.slug}>
              <Image src={activeProject.image} alt={`${activeProject.title} interface`} fill sizes="(max-width: 760px) 96vw, 66vw" priority={projectIndex === 0} />
            </Link>
            <div className="pres-work-project-footer" key={`footer-${activeProject.slug}`}><a href={activeProject.website} target="_blank" rel="noreferrer">Перейти на сайт <i>↗</i></a></div>
          </div>
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
