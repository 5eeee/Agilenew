import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";
import { CONTACT_REGION_COOKIE, contactRegionFromCountry } from "@/lib/regional-contacts";

const LOCALE_COOKIE = "agile-locale";
const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
]);

function localeFromCountry(country: string | null) {
  if (!country) return null;
  const code = country.toUpperCase();
  if (code === "RU") return "ru";
  if (code === "PL") return "pl";
  if (code === "GE") return "ka";
  if (code === "AM") return "hy";
  if (EU_COUNTRIES.has(code)) return "en";
  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) return NextResponse.next();

  const country = request.headers.get("x-vercel-ip-country");
  const contactRegion = contactRegionFromCountry(country);
  const respond = (response: NextResponse) => {
    response.cookies.set(CONTACT_REGION_COOKIE, contactRegion, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
    });
    return response;
  };

  const pathLocale = locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const manualLocale = locales.includes(savedLocale as (typeof locales)[number]) ? savedLocale : null;
  const countryLocale = localeFromCountry(country);

  if (pathLocale) {
    if (!manualLocale && countryLocale && pathLocale !== countryLocale) {
      request.nextUrl.pathname = pathname.replace(`/${pathLocale}`, `/${countryLocale}`);
      return respond(NextResponse.redirect(request.nextUrl));
    }
    return respond(NextResponse.next());
  }

  const preferred = request.headers.get("accept-language")?.toLowerCase() || "";
  const browserLocale = locales.find((item) => preferred.includes(item));
  const locale = manualLocale || countryLocale || browserLocale || defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return respond(NextResponse.redirect(request.nextUrl));
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
