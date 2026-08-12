import Image from "next/image";
import type { Locale } from "@/lib/i18n";

export function ContactChannels({ locale }: { locale: Locale }) {
  const labels = locale === "hy" ? { email: "Էլ. փոստ", action: "Գրել", phone: "Զանգահարել" } : locale === "ru" ? { email: "Почта", action: "Написать", phone: "Позвонить" } : { email: "Email", action: "Message", phone: "Call" };
  const channels = [
    { name: locale === "ru" ? "Телефон" : locale === "hy" ? "Հեռախոս" : "Phone", detail: "+7 963 617-73-73", action: labels.phone, href: "tel:+79636177373", icon: "/social/phone.svg", kind: "phone" },
    { name: labels.email, detail: "info@agile-business-pro.com", action: labels.action, href: "mailto:info@agile-business-pro.com", icon: "/social/mailru.svg", kind: "mail" },
    { name: "Telegram", detail: "@agilebusiness", action: labels.action, href: "https://t.me/agilebusiness", icon: "/social/telegram.svg", kind: "telegram" },
    { name: "WhatsApp", detail: "+7 963 617-73-73", action: labels.phone, href: "https://wa.me/79636177373", icon: "/social/whatsapp.svg", kind: "whatsapp" },
  ];

  return <div className="contact-channels">{channels.map((channel) => <a className={`channel-${channel.kind}`} key={channel.name} href={channel.href} target={channel.href.startsWith("http") ? "_blank" : undefined} rel={channel.href.startsWith("http") ? "noreferrer" : undefined}><span className="channel-icon"><Image src={channel.icon} alt="" width={26} height={26} /></span><span><strong>{channel.name}</strong><small>{channel.detail}</small></span><em>{channel.action} ↗</em></a>)}</div>;
}
