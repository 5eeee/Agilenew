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
  modeOne: string;
  modeTwo: string;
};

export function AnimatedHero({
  title,
  terms,
  text,
  primary,
  secondary,
  primaryHref,
  secondaryHref,
  modeOne,
  modeTwo,
}: AnimatedHeroProps) {
  const [activeTerm, setActiveTerm] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTerm((current) => (current + 1) % terms.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [terms.length]);

  return (
    <section className="home-hero shell">
      <div className="home-hero-content">
        <div className="hero-message">
          <h1>
            {title}{" "}
            <span className="rotating-term" key={terms[activeTerm]}>{terms[activeTerm]}</span>
          </h1>
          <p>{text}</p>
          <div className="hero-actions">
            <Link className="button" href={primaryHref}>{primary}</Link>
            <Link className="text-link" href={secondaryHref}>{secondary}<span>↗</span></Link>
          </div>
        </div>
        <div className="hero-modes">
          <p><span>01</span><strong>{modeOne}</strong></p>
          <p><span>02</span><strong>{modeTwo}</strong></p>
        </div>
      </div>
    </section>
  );
}
