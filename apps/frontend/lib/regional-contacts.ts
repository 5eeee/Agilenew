export const CONTACT_REGION_COOKIE = "agile-contact-region";

export type ContactRegion = "ru" | "international";

export const regionalContacts = {
  ru: {
    phoneDisplay: "+7 963 617-73-73",
    phoneHref: "tel:+79636177373",
    whatsappHref: "https://wa.me/79636177373",
    email: "info@agile-business-pro.com",
    mailProvider: "Mail.ru",
    mailIcon: "/social/mailru.svg",
  },
  international: {
    phoneDisplay: "+359 88 4034524",
    phoneHref: "tel:+359884034524",
    whatsappHref: "https://wa.me/359884034524",
    email: "agilebusinessofficial@gmail.com",
    mailProvider: "Gmail",
    mailIcon: "/social/gmail.svg",
  },
} as const;

export function contactRegionFromCountry(country: string | null): ContactRegion {
  return country?.toUpperCase() === "RU" ? "ru" : "international";
}
