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

const presentationCopy = {
  ru: { spheres: "СФЕРЫ КОМПАНИИ", connection: "Соединяем экспертизу в единый рабочий контур", increase: "Увеличиваем", services: "УСЛУГИ", allServices: "Все услуги", details: "Подробнее", works: "НАШИ РАБОТЫ", projects: "Проекты Agile Business", website: "Перейти на сайт" },
  en: { spheres: "COMPANY EXPERTISE", connection: "Connecting expertise into one operating system", increase: "Increasing", services: "SERVICES", allServices: "All services", details: "Learn more", works: "OUR WORK", projects: "Agile Business projects", website: "Visit website" },
  pl: { spheres: "OBSZARY SPECJALIZACJI", connection: "Łączymy kompetencje w jeden sprawny system", increase: "Zwiększamy", services: "USŁUGI", allServices: "Wszystkie usługi", details: "Dowiedz się więcej", works: "NASZE REALIZACJE", projects: "Projekty Agile Business", website: "Przejdź do strony" },
  ka: { spheres: "კომპანიის სფეროები", connection: "ვაერთიანებთ ექსპერტიზას ერთ სამუშაო სისტემაში", increase: "ვზრდით", services: "სერვისები", allServices: "ყველა სერვისი", details: "დეტალურად", works: "ჩვენი ნამუშევრები", projects: "Agile Business-ის პროექტები", website: "საიტზე გადასვლა" },
  hy: { spheres: "ԸՆԿԵՐՈՒԹՅԱՆ ՈԼՈՐՏՆԵՐԸ", connection: "Փորձագիտությունը միավորում ենք մեկ աշխատանքային համակարգում", increase: "Ավելացնում ենք", services: "ԾԱՌԱՅՈՒԹՅՈՒՆՆԵՐ", allServices: "Բոլոր ծառայությունները", details: "Մանրամասն", works: "ՄԵՐ ԱՇԽԱՏԱՆՔՆԵՐԸ", projects: "Agile Business նախագծեր", website: "Բացել կայքը" },
  bg: { spheres: "ОБЛАСТИ НА КОМПАНИЯТА", connection: "Обединяваме експертизата в единна работна система", increase: "Увеличаваме", services: "УСЛУГИ", allServices: "Всички услуги", details: "Повече", works: "НАШИТЕ ПРОЕКТИ", projects: "Проекти на Agile Business", website: "Към сайта" },
} as const;

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
    if (!scene || !stage) return;
    let frame = 0;
    let signatureStartTimer = 0;
    let signatureDrawFrame = 0;
    let lockedY = 0;
    const signatureDrawDuration = 2001;
    const signatureStartDelay = 46;
    const signaturePath = stage.querySelector<SVGPathElement>(".signature-draw-path");
    const signatureLetters = Array.from(stage.querySelectorAll<SVGGElement>(".signature-business-letter"));
    const resetSignature = () => {
      if (signatureDrawFrame) window.cancelAnimationFrame(signatureDrawFrame);
      signatureDrawFrame = 0;
      stage.classList.remove("signature-active");
      signaturePath?.style.setProperty("stroke-dashoffset", "1", "important");
      signatureLetters.forEach((letter) => letter.style.setProperty("opacity", "0", "important"));
    };
    const drawSignature = (onComplete: () => void) => {
      if (!signaturePath) {
        onComplete();
        return;
      }
      const startedAt = window.performance.now();
      const paint = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / signatureDrawDuration);
        const eased = progress * progress * (3 - 2 * progress);
        signaturePath.style.setProperty("stroke-dashoffset", `${1 - eased}`, "important");
        const letterPhase = Math.max(0, Math.min(1, (progress - 0.84) / 0.16));
        signatureLetters.forEach((letter, index) => {
          const opacity = Math.max(0, Math.min(1, letterPhase * signatureLetters.length - index));
          letter.style.setProperty("opacity", `${opacity}`, "important");
        });
        if (progress < 1) {
          signatureDrawFrame = window.requestAnimationFrame(paint);
        } else {
          signatureDrawFrame = 0;
          onComplete();
        }
      };
      signatureDrawFrame = window.requestAnimationFrame(paint);
    };
    signatureCompletedRef.current = false;
    signatureLockRef.current = false;
    resetSignature();
    const blockScroll = (event: Event) => event.preventDefault();
    const keepLockedPosition = () => {
      if (!signatureLockRef.current) return;
      if (Math.abs(window.scrollY - lockedY) > 1) window.scrollTo({ top: lockedY, behavior: "auto" });
    };
    const blockKeys = (event: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) event.preventDefault();
    };
    const unlockSignature = () => {
      if (!signatureLockRef.current) return;
      signatureLockRef.current = false;
      document.documentElement.classList.remove("signature-scroll-lock");
      window.removeEventListener("wheel", blockScroll, true);
      window.removeEventListener("touchmove", blockScroll, true);
      window.removeEventListener("keydown", blockKeys, true);
      window.removeEventListener("scroll", keepLockedPosition, true);
      window.scrollTo({ top: lockedY, behavior: "auto" });
    };
    const updateHero = () => {
      frame = 0;
      if (signatureLockRef.current) return;
      const bounds = scene.getBoundingClientRect();
      const travel = Math.max(scene.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      const compact = window.innerWidth <= 760;
      const compactCopyGrowth = window.innerWidth <= 380 ? 0.06 : 0.08;
      const titleProgress = Math.min(progress / 0.5, 1);
      const whiteProgress = Math.min(1, Math.max(0, (progress - 0.5) / 0.16));
      stage.style.setProperty("--hero-bg-shift", `${progress * (compact ? 28 : 48)}px`);
      stage.style.setProperty("--hero-bg-scale", `${1 + titleProgress * (compact ? 0.14 : 0.2)}`);
      stage.style.setProperty("--hero-copy-shift", `${titleProgress * (compact ? -24 : -42)}px`);
      stage.style.setProperty("--hero-copy-scale", `${1 + titleProgress * (compact ? compactCopyGrowth : 1.05)}`);
      stage.style.setProperty("--hero-copy-opacity", `${1 - whiteProgress}`);
      stage.style.setProperty("--hero-white-opacity", `${whiteProgress}`);
      // The signature starts only after the white layer has fully covered the
      // opening scene. Once started, it owns the viewport until every letter
      // has been drawn.
      const signatureActive = progress >= 0.7;
      if (progress <= 0.54 && signatureCompletedRef.current) {
        signatureCompletedRef.current = false;
        resetSignature();
      }
      if (signatureActive && !signatureCompletedRef.current) {
        signatureCompletedRef.current = true;
        const sceneTop = window.scrollY + bounds.top;
        lockedY = Math.round(sceneTop + travel * 0.7);
        stage.style.setProperty("--hero-copy-opacity", "0");
        stage.style.setProperty("--hero-white-opacity", "1");
        signatureLockRef.current = true;
        document.documentElement.classList.add("signature-scroll-lock");
        window.addEventListener("wheel", blockScroll, { passive: false, capture: true });
        window.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
        window.addEventListener("keydown", blockKeys, { capture: true });
        window.addEventListener("scroll", keepLockedPosition, { passive: true, capture: true });
        window.scrollTo({ top: lockedY, behavior: "auto" });
        // Restart from a guaranteed empty frame. This avoids the SVG appearing
        // already drawn when the browser restores scroll or skips several frames.
        stage.classList.remove("signature-active");
        void stage.offsetWidth;
        signatureStartTimer = window.setTimeout(() => {
          stage.classList.add("signature-active");
          drawSignature(unlockSignature);
        }, signatureStartDelay);
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
      if (signatureDrawFrame) window.cancelAnimationFrame(signatureDrawFrame);
      if (signatureStartTimer) window.clearTimeout(signatureStartTimer);
      unlockSignature();
    };
  }, []);

  useEffect(() => {
    const nodes = [[spheresRef.current, "spheres"], [workRef.current, "work"]] as const;
    if (!("IntersectionObserver" in window)) {
      queueMicrotask(() => setVisibleSections({ spheres: true, work: true }));
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
  const ui = presentationCopy[props.locale as keyof typeof presentationCopy] ?? presentationCopy.en;
  const orderedServices = [...props.services].sort((a, b) => {
    const aIsIt = /^ИТ\b|^IT\b|разработ/i.test(a[1]) ? 1 : 0;
    const bIsIt = /^ИТ\b|^IT\b|разработ/i.test(b[1]) ? 1 : 0;
    return bIsIt - aIsIt;
  });
  const polish = props.locale === "pl";

  return <main className="presentation-home">
    <div className="presentation-shell">
      <section className="pres-block pres-hero" ref={heroSceneRef}>
        <div className="pres-hero-stage" ref={heroStageRef}>
          <div className="pres-curtain" aria-hidden="true"><GradientField /></div>
          <div className="pres-hero-copy">
            <p>{props.text}</p>
            <h1>AGILE BUSINESS</h1>
          </div>
          <div className="pres-hero-footer"><span>{polish ? "Strategia" : "Strategy"}</span><span>{polish ? "Projektowanie" : "Design"}</span><span>{polish ? "Technologia" : "Technology"}</span></div>
          <div className="pres-hero-white-reveal"><SignatureLogo /></div>
        </div>
      </section>

      <section className="pres-block pres-spheres" ref={spheresRef}>
        <SectionBar left={ui.spheres} right={polish ? "Kompetencje | Systemy | Wzrost" : "Expertise | Systems | Growth"} />
        <div className="pres-spheres-stage">
          <span className="pres-spheres-index">0{term + 1} / 0{props.outcomes.length}</span>
          <p>{ui.connection}</p>
          <h2 key={props.terms[term % props.terms.length]}>{props.terms[term % props.terms.length]}</h2>
          <h3 key={props.outcomes[term]}>{ui.increase} {props.outcomes[term]}</h3>
          <div className="pres-spheres-progress"><i style={{ "--progress-index": term } as CSSProperties} /></div>
        </div>
      </section>

      <section className="pres-block pres-feature">
        <SectionBar left={ui.services} />
        <div className="pres-services-layout">
          <header><span className="pres-red-label">{polish ? "Rozwiązania biznesowe" : "Business solutions"}</span><h2>{props.servicesTitle}</h2><p>{props.servicesText}</p><Link href={`/${props.locale}/services`}>{ui.allServices} <i>↗</i></Link></header>
          <div className="pres-services-grid">
            {orderedServices.map((service, index) => <article key={service[0]}><span>0{index + 1}</span><h3>{service[1]}</h3><p>{service[2]}</p><Link href={`/${props.locale}/services`}>{ui.details} <i>↗</i></Link></article>)}
          </div>
        </div>
      </section>

      <section className="pres-block pres-portfolio pres-work-showcase" ref={workRef}>
        <SectionBar left={ui.works} right={polish ? "Klienci | Produkty | Platformy" : "Clients | Products | Platforms"} />
        <div className="pres-work-showcase-grid">
          <div className="pres-work-logo-window" aria-label={ui.projects}>
            <div className="pres-work-logo-track" style={{ "--project-index": projectIndex } as CSSProperties}>
              {props.projects.map((project, index) => <div className={`pres-work-logo-slide logo-${project.slug}`} key={project.slug}><span>0{index + 1}</span><strong>{project.logo ? <Image className="project-site-logo-image" src={project.logo} alt={`${project.title} logo`} width={360} height={190} /> : project.title}</strong></div>)}
            </div>
          </div>
          <div className="pres-work-project-window">
            {props.projects.map((project, index) => <Link className={`pres-work-project-frame ${index === projectIndex ? "is-active" : ""}`} href={`/${props.locale}/projects/${project.slug}`} aria-hidden={index !== projectIndex} tabIndex={index === projectIndex ? 0 : -1} style={{ "--project-backdrop": `url("${project.mobileImage ?? project.image}")` } as CSSProperties} key={project.slug}>
              <Image className="project-shot project-shot-desktop" src={project.image} alt={`${project.title} desktop interface`} fill sizes="(max-width: 760px) 1px, 66vw" priority={index === 0} loading={index === 0 ? undefined : "eager"} />
              {project.mobileImage ? <Image className="project-shot project-shot-mobile" src={project.mobileImage} alt={`${project.title} mobile interface`} fill sizes="(max-width: 760px) 96vw, 1px" quality={92} priority={index === 0} loading={index === 0 ? undefined : "eager"} /> : null}
            </Link>)}
          </div>
          <div className="pres-work-project-footer" key={`footer-${activeProject.slug}`}><a href={activeProject.website} target="_blank" rel="noreferrer">{ui.website} <i>↗</i></a></div>
        </div>
      </section>

      <section className="pres-block pres-process">
        <SectionBar right={polish ? "Jak pracujemy" : "How we work"} />
        <h2>{props.methodTitle}</h2>
        <ol>{props.steps.map((step, index) => <li key={step[0]}><span>0{index + 1}</span><h3>{step[0]}</h3><p>{step[1]}</p></li>)}</ol>
      </section>

      <section className="pres-block pres-final">
        <SectionBar right={polish ? "Rozpocznij projekt" : "Start a project"} />
        <div><h2>{props.ctaTitle}</h2><p>{props.ctaText}</p><Link href={`/${props.locale}/contacts`}>{props.ctaButton}</Link></div>
      </section>
    </div>
  </main>;
}
