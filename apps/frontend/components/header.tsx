"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { localeNames, locales, type Locale } from "@/lib/i18n";

type Nav = { services: string; about: string; calculator: string; contacts: string; cta: string };

function CartIcon() {
  return <svg className="cart-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h2l1.5 9h9.8l2.1-6.2H6.1M9 19a1.35 1.35 0 1 0 0 .1M16 19a1.35 1.35 0 1 0 0 .1" /></svg>;
}

const languageMeta: Record<Locale, { name: string }> = {
  ru: { name: "Русский" },
  en: { name: "English" },
  ka: { name: "ქართული" },
  hy: { name: "Հայերեն" },
  bg: { name: "Български" },
};

export function Header({ locale, nav }: { locale: Locale; nav: Nav }) {
  const [open, setOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const languageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const routeWithoutLocale = pathname.replace(/^\/(ru|en|ka|hy|bg)(?=\/|$)/, "") || "/";
  const links = [
    ["services", nav.services],
    ["about", nav.about],
    ["calculator", nav.calculator],
    ["contacts", nav.contacts],
  ];

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); setLanguageOpen(false); } };
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  useEffect(() => {
    const syncCart = () => {
      try {
        const value = JSON.parse(window.localStorage.getItem("agile-service-cart-v1") ?? "[]");
        setCartCount(Array.isArray(value) ? value.length : 0);
      } catch {
        setCartCount(0);
      }
    };
    syncCart();
    window.addEventListener("storage", syncCart);
    window.addEventListener("agile-cart-change", syncCart);
    return () => {
      window.removeEventListener("storage", syncCart);
      window.removeEventListener("agile-cart-change", syncCart);
    };
  }, []);

  useEffect(() => {
    if (!languageOpen) return;
    const closeLanguageMenu = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };
    document.addEventListener("pointerdown", closeLanguageMenu);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeLanguageMenu);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [languageOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand href={`/${locale}`} />
        <Link className="header-cart header-cart-mobile" href={`/${locale}/cart`} onClick={() => setOpen(false)} aria-label={locale === "ru" ? `Корзина: ${cartCount}` : `Cart: ${cartCount}`}><CartIcon /><b>{cartCount}</b></Link>
        <button className="menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <div id="main-menu" className={`header-panel${open ? " is-open" : ""}`}>
          <nav className="main-nav" aria-label="Main navigation">
            {links.map(([slug, label]) => <Link key={slug} className={pathname === `/${locale}/${slug}` ? "active" : ""} href={`/${locale}/${slug}`} onClick={() => setOpen(false)}>{label}</Link>)}
          </nav>
          <div className={`language-menu${languageOpen ? " is-open" : ""}`} ref={languageRef}>
            <button className="language-trigger" type="button" aria-label="Language selection" aria-haspopup="menu" aria-expanded={languageOpen} onClick={() => setLanguageOpen((current) => !current)}>
              <span className="language-current"><strong>{localeNames[locale]}</strong></span><i aria-hidden="true">⌄</i>
            </button>
            <div className="language-options" role="menu">
              {locales.map((item) => (
                <Link key={item} role="menuitem" aria-current={item === locale ? "page" : undefined} className={item === locale ? "active" : ""} href={`/${item}${routeWithoutLocale === "/" ? "" : routeWithoutLocale}`} hrefLang={item} onClick={() => { setOpen(false); setLanguageOpen(false); }}>
                  <span><strong>{languageMeta[item].name}</strong></span><small>{localeNames[item]}</small>
                </Link>
              ))}
            </div>
          </div>
          <div className="header-quick-actions">
            <Link className="header-cart" href={`/${locale}/cart`} onClick={() => setOpen(false)} aria-label={locale === "ru" ? `Корзина: ${cartCount}` : `Cart: ${cartCount}`}><CartIcon /><b>{cartCount}</b></Link>
            <a className="header-phone" href="tel:+79636177373" aria-label="+7 963 617-73-73"><Image src="/social/phone.svg" alt="" width={20} height={20} /></a>
            <Link className="header-account" href={`/${locale}/account`} onClick={() => setOpen(false)} aria-label={locale === "ru" ? "Личный кабинет" : locale === "hy" ? "Անձնական հաշիվ" : "Client account"}><Image src="/icons/account.svg" alt="" width={24} height={24} /></Link>
            <Link className="button button-small" href={`/${locale}/contacts`} onClick={() => setOpen(false)}>{nav.cta}</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
