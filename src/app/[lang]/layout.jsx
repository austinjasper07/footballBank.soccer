// app/[lang]/layout.jsx
import "../globals.css";
import { DM_Serif_Text, Oswald } from "next/font/google";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { getDictionary, locales } from "@/lib/dictionaries";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif-text",
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return generateSEOMetadata({
    title: dict.seo.defaultTitle,
    description: dict.seo.defaultDescription,
    keywords: ["football talent", "soccer players", "football scouts", "player profiles", "football recruitment"],
    url: "/",
  });
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  
  return (
    <ClientLayoutWrapper lang={lang}>{children}</ClientLayoutWrapper>
  );
}
