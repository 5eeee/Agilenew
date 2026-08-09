"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Service = readonly [string, string, string];
type Step = readonly [string, string];
type Project = { slug: string; title: string; description: string; image: string };

type PresentationHomeProps = {
  locale: string;
  title: string;
  terms: readonly string[];
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

function SectionBar({ right = "People | Process | Technology" }: { right?: string }) {
  return <div className="pres-section-bar"><span>AGILE BUSINESS</span><span>{right}</span></div>;
}

function WaveField() {
  const paths = Array.from({ length: 66 }, (_, index) => {
    const x = -130 + index * 24;
    const phase = index * .34;
    const bendA = Math.sin(phase) * 34;
    const bendB = Math.cos(phase * .72) * 58;
    return `M ${x} -70 C ${x + 70 + bendA} 90, ${x - 94 + bendB} 205, ${x + 14} 330 S ${x + 104 - bendA} 555, ${x - 25 + bendB * .28} 780`;
  });

  return <svg className="pres-wave-field" viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="pres-wave-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#240006"><animate attributeName="stop-color" values="#240006;#8d0712;#240006" dur="9s" repeatCount="indefinite" /></stop>
        <stop offset=".48" stopColor="#ff3443"><animate attributeName="stop-color" values="#ff3443;#b50716;#ff5a67;#ff3443" dur="7s" repeatCount="indefinite" /></stop>
        <stop offset="1" stopColor="#510008"><animate attributeName="stop-color" values="#510008;#ec1d2d;#510008" dur="11s" repeatCount="indefinite" /></stop>
      </linearGradient>
    </defs>
    <g>{paths.map((path, index) => <path d={path} key={index} />)}</g>
  </svg>;
}

export function PresentationHome(props: PresentationHomeProps) {
  const [term, setTerm] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setTerm((current) => (current + 1) % props.terms.length), 3200);
    return () => window.clearInterval(timer);
  }, [props.terms.length]);

  return <main className="presentation-home">
    <div className="presentation-shell">
      <section className="pres-block pres-hero">
        <SectionBar />
        <div className="pres-hero-stage">
          <div className="pres-curtain" aria-hidden="true"><WaveField /><i /><i /></div>
          <div className="pres-hero-copy">
            <p>{props.text}</p>
            <h1><span>{props.title}</span><strong key={props.terms[term]}>{props.terms[term]}</strong></h1>
          </div>
          <Link className="pres-round-link" href={`/${props.locale}/calculator`} aria-label={props.primary}>↗</Link>
          <div className="pres-hero-footer"><span>Strategy</span><span>Design</span><span>Technology</span></div>
        </div>
      </section>

      <section className="pres-block pres-feature">
        <SectionBar />
        <div className="pres-feature-grid">
          <div className="pres-feature-copy">
            <span className="pres-red-label">Business solutions</span>
            <div><h2>{props.servicesTitle}</h2><p>{props.servicesText}</p></div>
            <Link href={`/${props.locale}/services`}>{props.secondary}<i>→</i></Link>
          </div>
          <div className="pres-feature-media">
            <Image src={props.projects[0].image} alt={`${props.projects[0].title} project`} fill sizes="(max-width: 760px) 92vw, 62vw" />
            <div className="pres-glass-card"><span>Digital systems</span><strong>Аналитика, дизайн и разработка в одном контуре</strong><Link href={`/${props.locale}/projects/${props.projects[0].slug}`}>Открыть кейс ↗</Link></div>
          </div>
        </div>
      </section>

      <section className="pres-block pres-portfolio">
        <SectionBar />
        <div className="pres-service-mosaic">
          <article className="pres-service-intro"><h2>Service portfolio</h2><p>{props.servicesText}</p><Link href={`/${props.locale}/services`}>{props.secondary} ↗</Link></article>
          <article className="pres-service-image"><Image src={props.projects[1]?.image ?? props.projects[0].image} alt="Agile Business project interface" fill sizes="(max-width: 760px) 92vw, 34vw" /></article>
          {props.services.map((service) => <article className="pres-service-card" key={service[0]}><span>{service[0]}</span><h3>{service[1]}</h3><p>{service[2]}</p><Link href={`/${props.locale}/services`}>↗</Link></article>)}
        </div>
      </section>

      <section className="pres-block pres-work">
        <SectionBar right="Selected work" />
        <div className="pres-work-head"><h2>Проекты, которые работают в бизнесе</h2><Link href={`/${props.locale}/projects`}>Все проекты ↗</Link></div>
        <div className="pres-work-grid">{props.projects.slice(0, 3).map((project, index) => <Link href={`/${props.locale}/projects/${project.slug}`} className="pres-work-card" key={project.slug}><div><Image src={project.image} alt={`${project.title} interface`} fill sizes="(max-width: 760px) 92vw, 31vw" /></div><span>0{index + 1}</span><h3>{project.title}</h3><p>{project.description}</p><i>↗</i></Link>)}</div>
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
