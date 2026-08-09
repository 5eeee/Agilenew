"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { ProductVisual } from "@/components/product-visual";

type Product = {
  slug: string;
  title: string;
  label: string;
  description: string;
  features: readonly string[];
  more: string;
  image?: string;
  imageMobile?: string;
  url?: string;
  year?: string;
};

type ShowcaseGroup = { id: "products" | "projects"; label: string; intro: string; items: readonly Product[] };

const showcaseCopy = {
  ru: { all: "Все проекты", details: "Подробнее о проекте" },
  en: { all: "All projects", details: "View case study" },
  ka: { all: "ყველა პროექტი", details: "ქეისის ნახვა" },
  hy: { all: "Բոլոր նախագծերը", details: "Դիտել նախագիծը" },
  bg: { all: "Всички проекти", details: "Вижте проекта" },
} as const;

export function ProductShowcase({ locale, groups }: { locale: string; groups: readonly [ShowcaseGroup, ShowcaseGroup] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeGroup, setActiveGroup] = useState<ShowcaseGroup["id"]>(groups[0].id);
  const [activeSlide, setActiveSlide] = useState(0);
  const current = groups.find((group) => group.id === activeGroup) ?? groups[0];
  const labels = showcaseCopy[locale as keyof typeof showcaseCopy] ?? showcaseCopy.en;
  const move = (direction: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.querySelectorAll<HTMLElement>(".product-slide"));
    const next = Math.min(slides.length - 1, Math.max(0, activeSlide + direction));
    const target = slides[next];
    if (!target) return;
    setActiveSlide(next);
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };
  const selectGroup = (id: ShowcaseGroup["id"]) => {
    setActiveGroup(id);
    setActiveSlide(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };

  return (
    <section className="products-showcase shell">
      <header className="products-showcase-head">
        <div>
          <div className="showcase-tabs" role="tablist" aria-label="Agile Business portfolio">
            {groups.map((group) => <button key={group.id} type="button" role="tab" aria-selected={activeGroup === group.id} className={activeGroup === group.id ? "active" : ""} onClick={() => selectGroup(group.id)}>{group.label}</button>)}
          </div>
          <p>{current.intro}</p>
        </div>
        <div className="product-controls">{current.id === "projects" ? <Link className="showcase-all-link" href={`/${locale}/projects`}>{labels.all}<i aria-hidden="true">↗</i></Link> : null}<span>{String(activeSlide + 1).padStart(2, "0")} / {String(current.items.length).padStart(2, "0")}</span><button type="button" disabled={activeSlide === 0} onClick={() => move(-1)} aria-label="Previous item">←</button><button type="button" disabled={activeSlide === current.items.length - 1} onClick={() => move(1)} aria-label="Next item">→</button></div>
      </header>
      <div className="product-track" ref={trackRef} role="tabpanel" key={current.id} onScroll={(event) => {
        const track = event.currentTarget;
        const slides = Array.from(track.querySelectorAll<HTMLElement>(".product-slide"));
        if (!slides.length) return;
        const closest = slides.reduce((best, slide, index) => Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.offsetLeft - track.scrollLeft) ? index : best, 0);
        if (closest !== activeSlide) setActiveSlide(closest);
      }}>
        {current.items.map((product, index) => {
          const desktopImage = product.image?.replace(/-desktop\.jpg$/, "-desktop.png");
          const mobileImage = product.imageMobile ?? product.image?.replace(/-desktop\.jpg$/, "-mobile.png");

          return (
          <article className={`product-slide ${desktopImage ? "product-slide-project" : ""}`} key={product.slug}>
            <div className="product-slide-copy">
              <span>0{index + 1} / {product.label}{product.year ? ` / ${product.year}` : ""}</span>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
              {current.id === "projects"
                ? <Link href={`/${locale}/projects/${product.slug}`}>{labels.details}<i>↗</i></Link>
                : <Link href={`/${locale}/projects/${product.slug}`}>{product.more}<i>↗</i></Link>}
            </div>
            {desktopImage ? (
              <div className="project-device-stack" aria-label={`${product.title} desktop and mobile preview`}>
                <div className="project-browser-preview">
                  <span><i /><i /><i /></span>
                  <Image src={desktopImage} alt={`${product.title} — desktop version`} fill sizes="(max-width: 760px) 88vw, 58vw" />
                </div>
                <div className="project-phone-preview">
                  <span />
                  <Image src={mobileImage ?? desktopImage} alt={`${product.title} — mobile version`} fill sizes="(max-width: 760px) 112px, 168px" />
                </div>
              </div>
            ) : <ProductVisual product={product.slug} />}
          </article>
        )})}
      </div>
    </section>
  );
}
