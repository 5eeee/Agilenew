"use client";

import Image from "next/image";
import { useRegionalContacts } from "@/components/use-regional-contacts";
import type { Locale } from "@/lib/i18n";

export function ContactChannels({ locale }: { locale: Locale }) {
  const contacts = useRegionalContacts();
  const labels = locale === "hy" ? { email: "Էլ. փոստ", action: "Գրել", phone: "Զանգահարել" } : locale === "ru" ? { email: "Почта", action: "Написать", phone: "Позвонить" } : locale === "pl" ? { email: "E-mail", action: "Napisz", phone: "Zadzwoń" } : { email: "Email", action: "Message", phone: "Call" };
  const channels = [
    { name: contacts.mailProvider, detail: contacts.email, action: labels.action, href: `mailto:${contacts.email}`, icon: contacts.mailIcon, kind: "mail" },
    { name: "Telegram", detail: "@DevyatovOfficial", action: labels.action, href: "https://t.me/DevyatovOfficial", icon: "/social/telegram.svg", kind: "telegram" },
    { name: "WhatsApp", detail: contacts.phoneDisplay, action: labels.phone, href: contacts.whatsappHref, icon: "/social/whatsapp.svg", kind: "whatsapp" },
    { name: locale === "ru" ? "Телефон" : locale === "pl" ? "Telefon" : locale === "hy" ? "Հեռախոս" : "Phone", detail: contacts.phoneDisplay, action: labels.phone, href: contacts.phoneHref, icon: "/social/phone.svg", kind: "phone" },
  ];

  return <div className="contact-channels">{channels.map((channel) => <a className={`channel-${channel.kind}`} key={channel.name} href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel={channel.href.startsWith("http") ? "noreferrer" : undefined}><span className="channel-icon"><Image src={channel.icon} alt="" width={26} height={26} /></span><span><strong>{channel.name}</strong><small>{channel.detail}</small></span><em>{channel.action} ↗</em></a>)}</div>;
}
