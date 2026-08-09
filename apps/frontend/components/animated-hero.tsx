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
};

const FLOW_PATH = Array.from({ length: 48 }, (_, index) => {
  const y = -110 + index * 21;
  const bend = Number((Math.sin(index * 0.42) * 42).toFixed(2));
  const pinch = Number((Math.cos(index * 0.31) * 28).toFixed(2));

  return `M -180 ${y} C 80 ${y - 85 - bend} 250 ${y - 78 + pinch} 430 ${y - 40} C 620 ${y + 10 + bend} 690 ${y + 150 + pinch} 860 ${y + 68} C 1040 ${y - 22 - bend} 1110 ${y - 128 + pinch} 1260 ${y - 72} C 1410 ${y - 10 + bend} 1500 ${y + 32 - pinch} 1620 ${y + 18}`;
}).join(" ");

function HeroContourWaves() {
  return (
    <div className="hero-contours" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="xMidYMid slice">
        <g className="contour-layer contour-flow">
          <path d={FLOW_PATH} />
        </g>
      </svg>
    </div>
  );
}

function SceneArtwork({ variant }: { variant: number }) {
  if (variant === 0) {
    return (
      <div className="scene-art scene-art-web" aria-hidden="true">
        <span className="art-browser"><i /><i /><i /><b /><b /><b /></span>
        <span className="art-web-card art-web-card-a" />
        <span className="art-web-card art-web-card-b" />
      </div>
    );
  }

  if (variant === 1) {
    return (
      <div className="scene-art scene-art-crm" aria-hidden="true">
        <span className="art-crm-board"><i><b /></i><i><b /></i><i><b /></i></span>
        <span className="art-crm-contact"><i /><b /></span>
        <span className="art-crm-signal">+24</span>
      </div>
    );
  }

  if (variant === 2) {
    return (
      <div className="scene-art scene-art-product" aria-hidden="true">
        <span className="art-product-phone"><i /><i /><i /></span>
        <span className="art-product-module art-product-module-a" />
        <span className="art-product-module art-product-module-b" />
        <span className="art-product-orbit"><i /></span>
      </div>
    );
  }

  return (
    <div className="scene-art scene-art-strategy" aria-hidden="true">
      <span className="art-strategy-chart">
        <svg viewBox="0 0 300 190" preserveAspectRatio="none">
          <path d="M12 160 C58 146 72 112 110 120 S164 95 184 78 S230 74 288 20" />
          <circle cx="12" cy="160" r="6" /><circle cx="110" cy="120" r="6" /><circle cx="184" cy="78" r="6" /><circle cx="288" cy="20" r="6" />
        </svg>
      </span>
      <span className="art-strategy-step art-strategy-step-a">01</span>
      <span className="art-strategy-step art-strategy-step-b">02</span>
      <span className="art-strategy-step art-strategy-step-c">03</span>
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
}: AnimatedHeroProps) {
  const [activeTerm, setActiveTerm] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setActiveTerm((current) => (current + 1) % terms.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [terms.length]);

  const sceneNumber = String(activeTerm + 1).padStart(2, "0");

  return (
    <section className="home-hero shell">
      <HeroContourWaves />
      <div className="home-hero-content">
        <div className="hero-stage">
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

          <div className={`hero-scene hero-scene-${activeTerm % 4}`}>
            <div className="hero-scene-topline">
              <span>Agile / digital system</span>
              <strong>{sceneNumber}</strong>
            </div>
            <div className="hero-scene-canvas" key={`scene-${activeTerm}`}>
              <SceneArtwork variant={activeTerm % 4} />
              <span className="scene-cursor">↗</span>
            </div>
            <div className="hero-scene-rail">
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
            <div className="hero-scene-progress"><i style={{ width: `${((activeTerm + 1) / terms.length) * 100}%` }} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
