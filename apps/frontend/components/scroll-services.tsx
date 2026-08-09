"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Service = readonly [string, string, string];

export function ScrollServices({
  title,
  text,
  items,
  href,
  allLabel,
  orderLabel,
}: {
  title: string;
  text: string;
  items: readonly Service[];
  href: string;
  allLabel: string;
  orderLabel: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncFromScroll = useCallback(() => {
    frameRef.current = null;
    const section = sectionRef.current;
    if (!section || items.length < 2) return;

    const bounds = section.getBoundingClientRect();
    const travel = Math.max(1, bounds.height - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -bounds.top / travel));
    setActiveIndex(Math.round(progress * (items.length - 1)));
  }, [items.length]);

  useEffect(() => {
    const schedule = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(syncFromScroll);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [syncFromScroll]);

  const select = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const top = sectionTop + travel * (index / Math.max(1, items.length - 1));
    window.scrollTo({ top, behavior: "smooth" });
  };

  const active = items[activeIndex] ?? items[0];

  return (
    <section
      ref={sectionRef}
      className="scroll-services"
      style={{ "--service-count": items.length, "--service-active": activeIndex } as CSSProperties}
    >
      <div className="scroll-services-sticky">
        <div className="scroll-services-shell shell">
          <header className="scroll-services-head">
            <div><span>03 / SYSTEM</span><h2>{title}</h2></div>
            <p>{text}</p>
          </header>

          <div className="scroll-services-stage">
            <div className="service-orbit-wheel" aria-label={title}>
              <svg viewBox="0 0 310 650" preserveAspectRatio="none" aria-hidden="true"><path d="M24 8 C205 128 205 522 24 642"/><path className="orbit-progress" d="M24 8 C205 128 205 522 24 642"/></svg>
              <span className="service-orbit-axis" aria-hidden="true">SCROLL</span>
              {items.map(([number, itemTitle], index) => {
                const rawOffset = (index - activeIndex + items.length) % items.length;
                const offset = rawOffset > items.length / 2 ? rawOffset - items.length : rawOffset;
                return (
                <button
                  type="button"
                  className={index === activeIndex ? "active" : ""}
                  style={{ "--orbit-offset": offset, "--orbit-abs": Math.abs(offset) } as CSSProperties}
                  onClick={() => select(index)}
                  aria-current={index === activeIndex ? "step" : undefined}
                  key={number}
                >
                  <span>{number}</span>
                  <strong>{itemTitle}</strong>
                  <i aria-hidden="true">{index === activeIndex ? "●" : "○"}</i>
                </button>
              )})}
            </div>

            <article className="scroll-service-card" key={active[0]}>
              <div className="scroll-service-card-top"><span>{active[0]} / 0{items.length}</span><i>AGILE BUSINESS</i></div>
              <h3>{active[1]}</h3>
              <p>{active[2]}</p>
              <div className="scroll-service-actions">
                <Link className="button" href={`${href}#${active[0]}`}>{orderLabel}<span>↗</span></Link>
                <Link href={href}>{allLabel}<span>→</span></Link>
              </div>
              <div className="scroll-service-meter" aria-hidden="true"><i style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }} /></div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
