import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { projectSlugs } from "@/lib/projects";
import { getServiceCatalog } from "@/lib/service-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://agile-business-pro.com";
  const serviceSlugs = getServiceCatalog("ru").map((service) => service.id);
  const pages = ["", "/services", "/cart", "/about", "/calculator", "/contacts", "/privacy", ...projectSlugs.map((slug) => `/projects/${slug}`), ...serviceSlugs.map((slug) => `/services/${slug}`)];
  return locales.flatMap((locale) => pages.map((page) => ({
    url: `${base}/${locale}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : page.startsWith("/projects/") ? 0.7 : 0.8,
    alternates: { languages: Object.fromEntries(locales.map((item) => [item, `${base}/${item}${page}`])) },
  })));
}
