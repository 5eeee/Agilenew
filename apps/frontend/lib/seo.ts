import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n";

export function buildPageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const localizedPath = `/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: Object.fromEntries(locales.map((item) => [item, `/${item}${path}`])),
    },
    openGraph: { title, description, url: localizedPath, locale, type: "website" },
  };
}
