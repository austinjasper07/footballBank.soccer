// app/[lang]/layout.jsx
import "../globals.css";
import { DM_Serif_Text, Funnel_Display } from "next/font/google";
import Script from "next/script";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { NewAuthProvider } from "@/context/NewAuthContext";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/context/CartContext";
import AOSProvider from "@/components/AOSProvider";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { getDictionary, locales } from "@/lib/dictionaries";

const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-funnel-display",
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
