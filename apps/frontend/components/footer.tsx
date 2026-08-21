"use client";

import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/components/brand";
import { useRegionalContacts } from "@/components/use-regional-contacts";
import type { Locale } from "@/lib/i18n";

type FooterNav = { services: string; about: string; calculator: string; contacts: string };

export function Footer({ locale, line, privacy, nav }: { locale: Locale; line: string; privacy: string; nav: FooterNav }) {
  const contacts = useRegionalContacts();
  const projectsLabel = locale === "ru" ? "Проекты" : locale === "ka" ? "პროექტები" : locale === "hy" ? "Նախագծեր" : locale === "bg" ? "Проекти" : "Projects";
  const links = [["services", nav.services], ["projects", projectsLabel], ["about", nav.about], ["calculator", nav.calculator], ["contacts", nav.contacts], ["account", locale === "ru" ? "Личный кабинет" : locale === "hy" ? "Անձնական հաշիվ" : "Client account"]];
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand"><Brand href={`/${locale}`} /><p>{line}</p></div>
        <nav className="footer-nav" aria-label="Footer navigation">
          {links.map(([slug, label]) => <Link key={slug} href={`/${locale}/${slug}`}>{label}</Link>)}
        </nav>
        <div className="footer-socials">
          <a className="footer-phone" href={contacts.phoneHref}><Image src="/social/phone.svg" alt="" width={25} height={25} /><strong>{contacts.phoneDisplay}</strong><span>↗</span></a>
          <a className="footer-telegram" href="https://t.me/DevyatovOfficial" target="_blank" rel="noreferrer"><Image src="/social/telegram.svg" alt="" width={25} height={25} /><strong>Telegram</strong><span>↗</span></a>
          <a className="footer-whatsapp" href={contacts.whatsappHref} target="_blank" rel="noreferrer"><Image src="/social/whatsapp.svg" alt="" width={25} height={25} /><strong>WhatsApp</strong><span>↗</span></a>
          <a className="footer-mail" href={`mailto:${contacts.email}`}><Image className="footer-channel-logo" src={contacts.mailIcon} alt="" width={28} height={24} /><strong>{contacts.mailProvider}</strong><span>↗</span></a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Agile Business</span>
        <Link href={`/${locale}/privacy`}>{privacy}</Link>
        <span className="footer-credit">Разработано компанией <Link href={`/${locale}`}>Agile Business</Link></span>
      </div>
    </footer>
  );
}
