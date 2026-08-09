"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";

type Service = readonly [string, string, string];

export function KineticServices({
  title,
  text,
  items,
  href,
  linkLabel,
}: {
  title: string;
  text: string;
  items: readonly Service[];
  href: string;
  linkLabel: string;
}) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const resetRows = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    fieldRef.current?.querySelectorAll<HTMLElement>(".kinetic-service-row").forEach((row) => {
      row.style.transform = "";
    });
    fieldRef.current?.style.setProperty("--cursor-x", "50%");
    fieldRef.current?.style.setProperty("--cursor-y", "50%");
  };

  const moveRows = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    const clientX = event.clientX;
    const clientY = event.clientY;
    frameRef.current = requestAnimationFrame(() => {
      const field = fieldRef.current;
      if (!field) return;
      const bounds = field.getBoundingClientRect();
      field.style.setProperty("--cursor-x", `${clientX - bounds.left}px`);
      field.style.setProperty("--cursor-y", `${clientY - bounds.top}px`);

      field.querySelectorAll<HTMLElement>(".kinetic-service-row").forEach((row) => {
        const rowBounds = row.getBoundingClientRect();
        const distance = Math.abs(clientY - (rowBounds.top + rowBounds.height / 2));
        const influence = Math.max(0, 1 - distance / 180);
        const direction = clientX > bounds.left + bounds.width / 2 ? -1 : 1;
        const bend = (clientY - (rowBounds.top + rowBounds.height / 2)) * .025 * influence;
        row.style.transform = `translate3d(${direction * influence * 58}px, ${bend}px, 0) rotate(${bend * .08}deg) scale(${1 + influence * .035})`;
      });
    });
  };

  return (
    <section className="kinetic-services shell">
      <div className="kinetic-services-copy">
        <span>01 / {linkLabel}</span>
        <h2>{title}</h2>
        <p>{text}</p>
        <Link href={href}>{linkLabel}<span>↗</span></Link>
      </div>
      <div className="kinetic-services-field" ref={fieldRef} onMouseMove={moveRows} onMouseLeave={resetRows}>
        <span className="kinetic-cursor" aria-hidden="true" />
        {items.map(([number, itemTitle, itemText]) => (
          <Link className="kinetic-service-row" href={href} key={number}>
            <span>{number}</span>
            <strong>{itemTitle}</strong>
            <p>{itemText}</p>
            <i>↗</i>
          </Link>
        ))}
      </div>
    </section>
  );
}
