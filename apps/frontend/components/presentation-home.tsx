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
  const paths = Array.from({ length: 28 }, (_, index) => {
    const y = -80 + index * 34;
    const phase = index * 0.48;
    const rise = Math.sin(phase) * 54;
    const fall = Math.cos(phase * 0.74) * 72;
    return `M -220 ${y} C 80 ${y - 125 + rise}, 255 ${y + 145 + fall}, 520 ${y + 18} S 930 ${y - 138 - rise}, 1240 ${y + 8 + fall * 0.35} S 1600 ${y + 120}, 1870 ${y - 18}`;
  });

  return <div className="pres-wave-motion" aria-hidden="true"><svg className="pres-wave-field" viewBox="0 0 1650 900" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="pres-wave-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#310005"><animate attributeName="stop-color" values="#310005;#7b0710;#310005" dur="12s" repeatCount="indefinite" /></stop>
        <stop offset=".3" stopColor="#980b17"><animate attributeName="stop-color" values="#980b17;#ec1d2d;#6b020c;#980b17" dur="9s" repeatCount="indefinite" /></stop>
        <stop offset=".58" stopColor="#ff4f5c"><animate attributeName="stop-color" values="#ff4f5c;#a50714;#ff8790;#ff4f5c" dur="8s" repeatCount="indefinite" /></stop>
        <stop offset="1" stopColor="#470007"><animate attributeName="stop-color" values="#470007;#d01827;#470007" dur="13s" repeatCount="indefinite" /></stop>
      </linearGradient>
      <filter id="pres-wave-soft" x="-20%" y="-30%" width="140%" height="160%"><feGaussianBlur stdDeviation="2.8" /></filter>
    </defs>
    <g filter="url(#pres-wave-soft)">{paths.map((path, index) => <path d={path} key={index} />)}</g>
  </svg></div>;
}

export function PresentationHome(props: PresentationHomeProps) {
  const [term, setTerm] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setTerm((current) => (current + 1) % props.outcomes.length), 3200);
    return () => window.clearInterval(timer);
  }, [props.outcomes.length]);

  return <main className="presentation-home">
    <div className="presentation-shell">
      <section className="pres-block pres-hero">
        <SectionBar />
        <div className="pres-hero-stage">
          <div className="pres-curtain" aria-hidden="true"><WaveField /><i /><i /></div>
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
        <SectionBar left="УСЛУГИ" right="Business solutions" />
        <div className="pres-service-mosaic">
          <article className="pres-service-intro"><h2>Service portfolio</h2><p>{props.servicesText}</p><Link href={`/${props.locale}/services`}>{props.secondary} ↗</Link></article>
          <article className="pres-service-image"><Image src={props.projects[1]?.image ?? props.projects[0].image} alt="Agile Business project interface" fill sizes="(max-width: 760px) 92vw, 34vw" /></article>
          {props.services.map((service) => <article className="pres-service-card" key={service[0]}><span>{service[0]}</span><h3>{service[1]}</h3><p>{service[2]}</p><Link href={`/${props.locale}/services`}>↗</Link></article>)}
        </div>
      </section>

      <section className="pres-block pres-work">
        <SectionBar left="НАШИ РАБОТЫ" right="Selected work" />
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
