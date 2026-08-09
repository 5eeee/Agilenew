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
};

type ContourCluster = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  rings: number;
  phase: number;
};

const CLUSTERS: readonly ContourCluster[] = [
  { cx: 260, cy: 340, rx: 345, ry: 245, rings: 17, phase: .2 },
  { cx: 810, cy: 180, rx: 300, ry: 205, rings: 15, phase: 1.8 },
  { cx: 1260, cy: 500, rx: 390, ry: 270, rings: 19, phase: 3.1 },
];

function createContour({ cx, cy, rx, ry, phase }: ContourCluster, ring: number) {
  const scale = 1 - ring * .047;
  const points = Array.from({ length: 56 }, (_, index) => {
    const angle = (index / 56) * Math.PI * 2;
    const distortion = 1 + Math.sin(angle * 3 + phase + ring * .19) * .055 + Math.cos(angle * 5 - phase) * .025;
    const x = cx + Math.cos(angle) * rx * scale * distortion + Math.sin(angle * 2 + phase) * 18 * scale;
    const y = cy + Math.sin(angle) * ry * scale * distortion + Math.cos(angle * 3 - phase) * 12 * scale;
    return [Number(x.toFixed(1)), Number(y.toFixed(1))] as const;
  });

  return `${points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`).join(" ")} Z`;
}

const CONTOURS = CLUSTERS.map((cluster) =>
  Array.from({ length: cluster.rings }, (_, ring) => createContour(cluster, ring)),
);

function PremiumContours() {
  return (
    <div className="hero-contours premium-contours" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
        {CONTOURS.map((paths, clusterIndex) => (
          <g className={`topo-cluster topo-cluster-${clusterIndex + 1}`} key={CLUSTERS[clusterIndex].cx}>
            {paths.map((path, pathIndex) => <path d={path} key={pathIndex} />)}
          </g>
        ))}
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
}: AnimatedHeroProps) {
  const [activeTerm, setActiveTerm] = useState(0);

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
              <Link className="button" href={primaryHref}>{primary}</Link>
              <Link className="text-link" href={secondaryHref}>{secondary}<span>↗</span></Link>
            </div>
          </div>

          <div className="hero-kpi hero-kpi-main" aria-hidden="true">
            <span>{kpiLabel}</span>
            <strong>+38%</strong>
            <i>{kpiNote}</i>
          </div>
          <div className="hero-kpi hero-kpi-mini" aria-hidden="true">
            <span>01—04</span>
            <strong>BUSINESS<br />SYSTEMS</strong>
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
