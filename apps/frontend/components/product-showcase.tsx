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
  url?: string;
  year?: string;
};

type ShowcaseGroup = { id: "products" | "projects"; label: string; intro: string; items: readonly Product[] };

export function ProductShowcase({ locale, groups }: { locale: string; groups: readonly [ShowcaseGroup, ShowcaseGroup] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeGroup, setActiveGroup] = useState<ShowcaseGroup["id"]>("products");
  const current = groups.find((group) => group.id === activeGroup) ?? groups[0];
  const move = (direction: number) => trackRef.current?.scrollBy({ left: direction * Math.min(trackRef.current.clientWidth * .82, 900), behavior: "smooth" });
  const selectGroup = (id: ShowcaseGroup["id"]) => {
    setActiveGroup(id);
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
        <div className="product-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous item">←</button><button type="button" onClick={() => move(1)} aria-label="Next item">→</button></div>
      </header>
      <div className="product-track" ref={trackRef} role="tabpanel" key={current.id}>
        {current.items.map((product, index) => (
          <article className={`product-slide ${product.image ? "product-slide-project" : ""}`} key={product.slug}>
            <div className="product-slide-copy">
              <span>0{index + 1} / {product.label}{product.year ? ` / ${product.year}` : ""}</span>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <ul>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
              {product.url
                ? <a href={product.url} target="_blank" rel="noreferrer">{product.more}<i>↗</i></a>
                : <Link href={`/${locale}/projects/${product.slug}`}>{product.more}<i>↗</i></Link>}
            </div>
            {product.image ? (
              <div className="project-device-stack" aria-label={`${product.title} desktop and mobile preview`}>
                <div className="project-browser-preview">
                  <span><i /><i /><i /></span>
                  <Image src={product.image} alt={`${product.title} — desktop version`} fill sizes="(max-width: 760px) 88vw, 58vw" />
                </div>
                <div className="project-phone-preview">
                  <span />
                  <Image src={product.image} alt={`${product.title} — mobile composition`} fill sizes="180px" />
                </div>
              </div>
            ) : <ProductVisual product={product.slug} />}
          </article>
        ))}
      </div>
    </section>
  );
}
