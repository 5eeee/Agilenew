import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/components/brand";
import type { Locale } from "@/lib/i18n";

type FooterNav = { services: string; about: string; calculator: string; contacts: string };

export function Footer({ locale, line, privacy, nav }: { locale: Locale; line: string; privacy: string; nav: FooterNav }) {
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
          <a className="footer-phone" href="tel:+79636177373"><Image src="/social/phone.svg" alt="" width={25} height={25} /><strong>+7 963 617-73-73</strong><span>↗</span></a>
          <a className="footer-telegram" href="https://t.me/agilebusiness" target="_blank" rel="noreferrer"><Image src="/social/telegram.svg" alt="" width={25} height={25} /><strong>Telegram</strong><span>↗</span></a>
          <a className="footer-whatsapp" href="https://wa.me/79636177373" target="_blank" rel="noreferrer"><Image src="/social/whatsapp.svg" alt="" width={25} height={25} /><strong>WhatsApp</strong><span>↗</span></a>
          <a className="footer-mail" href="mailto:info@agile-business-pro.com"><Image src="/social/mailru.svg" alt="" width={25} height={25} /><strong>Mail.ru</strong><span>↗</span></a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Agile Business</span>
        <Link href={`/${locale}/privacy`}>{privacy}</Link>
        <span>Разработано компанией Agile Business</span>
      </div>
    </footer>
  );
}
