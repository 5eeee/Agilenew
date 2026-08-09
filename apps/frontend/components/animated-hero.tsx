"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AnimatedHeroProps = {
  title: string;
  terms: readonly string[];
  text: string;
  primary: string;
  secondary: string;
  primaryHref: string;
  secondaryHref: string;
  kpiLabel: string;
  kpiNote: string;
  kpis?: readonly {
    label: string;
    value: string;
    note: string;
  }[];
  primaryHint?: string;
};

type Point = readonly [number, number];

function gaussian(value: number, center: number, spread: number) {
  return Math.exp(-((value - center) ** 2) / spread);
}

function smoothPath(points: readonly Point[]) {
  if (points.length < 2) return "";
  let path = `M ${points[0][0]} ${points[0][1]}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const afterNext = points[Math.min(points.length - 1, index + 2)];
    const controlA = [current[0] + (next[0] - previous[0]) / 6, current[1] + (next[1] - previous[1]) / 6];
    const controlB = [next[0] - (afterNext[0] - current[0]) / 6, next[1] - (afterNext[1] - current[1]) / 6];
    path += ` C ${controlA[0].toFixed(1)} ${controlA[1].toFixed(1)}, ${controlB[0].toFixed(1)} ${controlB[1].toFixed(1)}, ${next[0]} ${next[1]}`;
  }

  return path;
}

function createWaveLine(line: number) {
  const points = Array.from({ length: 49 }, (_, point): Point => {
    const x = -120 + point * 35;
    const phase = line * .19;
    const firstFold = gaussian(x, 245, 115000) * Math.sin(x / 115 + phase) * 82;
    const centerFold = gaussian(x, 785, 175000) * Math.cos(x / 138 - phase * .72) * 108;
    const finalFold = gaussian(x, 1240, 120000) * Math.sin(x / 92 + phase * .55) * 76;
    const drift = Math.sin(x / 260 + phase) * 18 + Math.cos(x / 520 - phase) * 13;
    const y = -55 + line * 21.5 + firstFold + centerFold + finalFold + drift;
    return [Number(x.toFixed(1)), Number(y.toFixed(1))];
  });

  return smoothPath(points);
}

const WAVE_LINES = Array.from({ length: 42 }, (_, line) => createWaveLine(line));

function PremiumContours() {
  return (
    <div className="hero-contours premium-contours" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
        <g className="topo-wave-layer topo-wave-layer-a">
          {WAVE_LINES.filter((_, index) => index % 2 === 0).map((path, index) => <path d={path} key={index} />)}
        </g>
        <g className="topo-wave-layer topo-wave-layer-b">
          {WAVE_LINES.filter((_, index) => index % 2 !== 0).map((path, index) => <path d={path} key={index} />)}
        </g>
      </svg>
    </div>
  );
}

export function AnimatedHero({
  title,
  terms,
  text,
  primary,
  secondary,
  primaryHref,
  secondaryHref,
  kpiLabel,
  kpiNote,
  kpis,
  primaryHint,
}: AnimatedHeroProps) {
  const [activeTerm, setActiveTerm] = useState(0);
  const activeKpi = kpis?.[activeTerm] ?? { label: kpiLabel, value: "+38%", note: kpiNote };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveTerm((current) => (current + 1) % terms.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [terms.length]);

  return (
    <section className="home-hero hero-premium shell">
      <PremiumContours />
      <div className="hero-premium-grain" aria-hidden="true" />
      <div className="home-hero-content">
        <div className="hero-premium-kicker">
          <span>Agile Business / 2026</span>
          <span>Strategy · Design · Technology</span>
        </div>

        <div className="hero-premium-stage">
          <div className="hero-message">
            <h1 aria-label={`${title} ${terms[activeTerm]}`}>
              <span className="hero-title-fixed">{title}</span>
              <span className="hero-title-slot">
                <span className="rotating-term" key={terms[activeTerm]}>{terms[activeTerm]}</span>
              </span>
            </h1>
            <p>{text}</p>
            <div className="hero-actions">
              <Link className="button hero-primary-action" href={primaryHref}>
                <span>{primary}</span>
                {primaryHint ? <small>{primaryHint}</small> : null}
                <i aria-hidden="true">↗</i>
              </Link>
              <Link className="text-link hero-secondary-action" href={secondaryHref}><span>{secondary}</span><i aria-hidden="true">↗</i></Link>
            </div>
          </div>

          <div className="hero-kpi hero-kpi-main" aria-live="polite">
            <div className="hero-kpi-content" key={activeTerm}>
              <span className="hero-kpi-index">0{activeTerm + 1} / 04</span>
              <span className="hero-kpi-label">{activeKpi.label}</span>
              <strong>{activeKpi.value}</strong>
              <i>{activeKpi.note}</i>
            </div>
          </div>
        </div>

        <div className="hero-premium-rail" aria-label="Business outcomes">
          {terms.map((term, index) => (
            <button
              className={index === activeTerm ? "active" : ""}
              key={term}
              onClick={() => setActiveTerm(index)}
              aria-pressed={index === activeTerm}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
