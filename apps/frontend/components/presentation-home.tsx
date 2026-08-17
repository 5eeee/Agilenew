"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { SignatureLogo } from "@/components/signature-logo";

type Service = readonly [string, string, string];
type Step = readonly [string, string];
type Project = { slug: string; title: string; description: string; image: string; mobileImage?: string; website: string; logo?: string };

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
  const [visibleSections, setVisibleSections] = useState({ spheres: false, work: false });
  const heroSceneRef = useRef<HTMLElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const spheresRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const signatureCompletedRef = useRef(false);
  const signatureLockRef = useRef(false);

  useEffect(() => {
    const scene = heroSceneRef.current;
    const stage = heroStageRef.current;
    if (!scene || !stage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let lastProgress = -1;
    const updateHero = () => {
      frame = 0;
      if (signatureLockRef.current) return;
      const bounds = scene.getBoundingClientRect();
      const travel = Math.max(scene.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      if (Math.abs(progress - lastProgress) < 0.002) return;
      lastProgress = progress;
      const compact = window.innerWidth < 600;
      const titleProgress = Math.min(progress / 0.48, 1);
      const whiteProgress = Math.min(1, Math.max(0, (progress - 0.52) / 0.12));
      stage.style.setProperty("--hero-bg-shift", `${progress * (compact ? 28 : 48)}px`);
      stage.style.setProperty("--hero-bg-scale", `${1 + titleProgress * (compact ? 0.14 : 0.2)}`);
      stage.style.setProperty("--hero-copy-shift", `${titleProgress * (compact ? -20 : -42)}px`);
      stage.style.setProperty("--hero-copy-scale", `${1 + titleProgress * (compact ? 0.72 : 1.05)}`);
      stage.style.setProperty("--hero-copy-opacity", `${1 - whiteProgress}`);
      stage.style.setProperty("--hero-white-opacity", `${whiteProgress}`);
      const signatureActive = progress >= 0.7;
      if (signatureActive && !signatureCompletedRef.current) {
        signatureCompletedRef.current = true;
        signatureLockRef.current = true;
        const sceneTop = window.scrollY + bounds.top;
        const lockY = Math.round(sceneTop + travel * 0.7);
        window.scrollTo({ top: lockY, behavior: "auto" });
        const blockScroll = (event: Event) => event.preventDefault();
        const blockKeys = (event: KeyboardEvent) => {
          if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) event.preventDefault();
        };
        document.body.style.top = `-${lockY}px`;
        document.documentElement.classList.add("signature-scroll-lock");
        window.addEventListener("wheel", blockScroll, { passive: false, capture: true });
        window.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
        window.addEventListener("keydown", blockKeys, { capture: true });
        // Restart from a guaranteed empty frame. This avoids the SVG appearing
        // already drawn when the browser restores scroll or skips several frames.
        stage.classList.remove("signature-active");
        void stage.offsetWidth;
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => stage.classList.add("signature-active")));
        window.setTimeout(() => {
          signatureLockRef.current = false;
          document.documentElement.classList.remove("signature-scroll-lock");
          window.removeEventListener("wheel", blockScroll, true);
          window.removeEventListener("touchmove", blockScroll, true);
          window.removeEventListener("keydown", blockKeys, true);
          document.body.style.top = "";
          window.scrollTo({ top: lockY, behavior: "auto" });
        }, 1500);
      } else if (!signatureCompletedRef.current) {
        stage.classList.remove("signature-active");
      }
    };
    const requestUpdate = () => { if (!frame) frame = window.requestAnimationFrame(updateHero); };
    updateHero();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("signature-scroll-lock");
      document.body.style.top = "";
    };
  }, []);

  useEffect(() => {
    const nodes = [[spheresRef.current, "spheres"], [workRef.current, "work"]] as const;
    if (!("IntersectionObserver" in window)) {
      setVisibleSections({ spheres: true, work: true });
      return;
    }
    const visibility = { spheres: false, work: false };
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const item = nodes.find(([node]) => node === entry.target);
        if (item) visibility[item[1]] = entry.isIntersecting;
      }
      setVisibleSections({
        spheres: visibility.spheres && !document.hidden,
        work: visibility.work && !document.hidden,
      });
    }, { rootMargin: "180px 0px", threshold: 0.01 });
    for (const [node] of nodes) if (node) observer.observe(node);
    const handleVisibility = () => setVisibleSections({
      spheres: visibility.spheres && !document.hidden,
      work: visibility.work && !document.hidden,
    });
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    if (!visibleSections.spheres || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setTerm((current) => (current + 1) % props.outcomes.length), 3200);
    return () => window.clearInterval(timer);
  }, [props.outcomes.length, visibleSections.spheres]);

  useEffect(() => {
    if (!visibleSections.work || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setProjectIndex((current) => (current + 1) % props.projects.length), 2600);
    return () => window.clearInterval(timer);
  }, [props.projects.length, visibleSections.work]);

  const activeProject = props.projects[projectIndex];
  const orderedServices = [...props.services].sort((a, b) => {
    const aIsIt = /^ИТ\b|^IT\b|разработ/i.test(a[1]) ? 1 : 0;
    const bIsIt = /^ИТ\b|^IT\b|разработ/i.test(b[1]) ? 1 : 0;
    return bIsIt - aIsIt;
  });

  return <main className="presentation-home">
    <div className="presentation-shell">
      <section className="pres-block pres-hero" ref={heroSceneRef}>
        <div className="pres-hero-stage" ref={heroStageRef}>
          <div className="pres-curtain" aria-hidden="true"><GradientField /></div>
          <div className="pres-hero-copy">
            <p>{props.text}</p>
            <h1>{props.title}</h1>
          </div>
          <div className="pres-hero-footer"><span>Strategy</span><span>Design</span><span>Technology</span></div>
          <div className="pres-hero-white-reveal"><SignatureLogo /></div>
        </div>
      </section>

      <section className="pres-block pres-spheres" ref={spheresRef}>
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
            {orderedServices.map((service, index) => <article key={service[0]}><span>0{index + 1}</span><h3>{service[1]}</h3><p>{service[2]}</p><Link href={`/${props.locale}/services`}>Подробнее <i>↗</i></Link></article>)}
          </div>
        </div>
      </section>

      <section className="pres-block pres-portfolio pres-work-showcase" ref={workRef}>
        <SectionBar left="НАШИ РАБОТЫ" right="Clients | Products | Platforms" />
        <div className="pres-work-showcase-grid">
          <div className="pres-work-logo-window" aria-label="Проекты Agile Business">
            <div className="pres-work-logo-track" style={{ "--project-index": projectIndex } as CSSProperties}>
              {props.projects.map((project, index) => <div className={`pres-work-logo-slide logo-${project.slug}`} key={project.slug}><span>0{index + 1}</span><strong>{project.logo ? <Image className="project-site-logo-image" src={project.logo} alt={`${project.title} logo`} width={360} height={190} /> : project.title}</strong></div>)}
            </div>
          </div>
          <div className="pres-work-project-window">
            <Link className="pres-work-project-frame" href={`/${props.locale}/projects/${activeProject.slug}`} key={activeProject.slug}>
              <Image className="project-shot project-shot-desktop" src={activeProject.image} alt={`${activeProject.title} desktop interface`} fill sizes="(max-width: 760px) 1px, 66vw" priority />
              {activeProject.mobileImage ? <Image className="project-shot project-shot-mobile" src={activeProject.mobileImage} alt={`${activeProject.title} mobile interface`} fill sizes="(max-width: 760px) 96vw, 1px" priority /> : null}
            </Link>
          </div>
          <div className="pres-work-project-footer" key={`footer-${activeProject.slug}`}><a href={activeProject.website} target="_blank" rel="noreferrer">Перейти на сайт <i>↗</i></a></div>
        </div>
      </section>

      <section className="pres-block pres-process">
        <SectionBar right="How we work" />
        <h2>{props.methodTitle}</h2>
        <ol>{props.steps.map((step, index) => <li key={step[0]}><span>0{index + 1}</span><h3>{step[0]}</h3><p>{step[1]}</p></li>)}</ol>
      </section>

      <section className="pres-block pres-final">
        <SectionBar right="Start a project" />
        <div><h2>{props.ctaTitle}</h2><p>{props.ctaText}</p><Link href={`/${props.locale}/contacts`}>{props.ctaButton}</Link></div>
      </section>
    </div>
  </main>;
}
