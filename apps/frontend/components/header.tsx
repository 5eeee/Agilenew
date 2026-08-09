"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";
import { localeNames, locales, type Locale } from "@/lib/i18n";

type Nav = { services: string; about: string; calculator: string; contacts: string; cta: string };

export function Header({ locale, nav }: { locale: Locale; nav: Nav }) {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
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

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand href={`/${locale}`} />
        <Link className="header-cart header-cart-mobile" href={`/${locale}/services#cart`} aria-label={locale === "ru" ? `Корзина: ${cartCount}` : `Cart: ${cartCount}`}><span aria-hidden="true">▱</span><b>{cartCount}</b></Link>
        <button className="menu-button" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="main-menu" onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <div id="main-menu" className={`header-panel${open ? " is-open" : ""}`}>
          <nav className="main-nav" aria-label="Main navigation">
            {links.map(([slug, label]) => <Link key={slug} className={pathname === `/${locale}/${slug}` ? "active" : ""} href={`/${locale}/${slug}`} onClick={() => setOpen(false)}>{label}</Link>)}
          </nav>
          <div className="languages" aria-label="Language selection">
            {locales.map((item) => (
              <Link key={item} className={item === locale ? "active" : ""} href={`/${item}${routeWithoutLocale === "/" ? "" : routeWithoutLocale}`} hrefLang={item} onClick={() => setOpen(false)}>
                {localeNames[item]}
              </Link>
            ))}
          </div>
          <div className="header-quick-actions"><Link className="header-cart" href={`/${locale}/services#cart`} aria-label={locale === "ru" ? `Корзина: ${cartCount}` : `Cart: ${cartCount}`}><span aria-hidden="true">▱</span><b>{cartCount}</b></Link><a className="header-phone" href="tel:+79636177373" aria-label="+7 963 617-73-73"><Image src="/social/phone.svg" alt="" width={20} height={20} /></a><Link className="header-account" href={`/${locale}/account`} aria-label={locale === "ru" ? "Личный кабинет" : locale === "hy" ? "Անձնական հաշիվ" : "Client account"}><Image src="/icons/account.svg" alt="" width={24} height={24} /></Link></div>
          <Link className="button button-small" href={`/${locale}/contacts`} onClick={() => setOpen(false)}>{nav.cta}</Link>
        </div>
      </div>
    </header>
  );
}
