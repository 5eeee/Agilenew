import { ImageResponse } from "next/og";
import { getDictionary, isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dictionary = getDictionary(isLocale(lang) ? lang : "ru");
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#fff", color: "#121212", padding: 70, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "72%" }}>
        <div style={{ display: "flex", fontSize: 24, fontWeight: 800, letterSpacing: 4, color: "#d81920" }}>AGILE BUSINESS</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 62, fontWeight: 800, lineHeight: 1.05 }}><span>{dictionary.hero.title}</span><span style={{ color: "#d81920" }}>{dictionary.hero.accent}</span></div>
        <div style={{ display: "flex", fontSize: 22, color: "#666" }}>agile-business-pro.com</div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, width: 300, height: 630, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "#d81920", color: "#fff", fontSize: 360, fontWeight: 900, lineHeight: .8 }}>A</div>
    </div>, size,
  );
}
