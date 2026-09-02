// app/[lang]/layout.jsx
import "../globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { getDictionary, locales } from "@/lib/dictionaries";

export async function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return generateSEOMetadata({
    title: dict.seo.defaultTitle,
    description: dict.seo.defaultDescription,
    keywords: [
      "football talent", 
      "soccer players", 
      "football scouts", 
      "player profiles", 
      "football recruitment",
      "player publication",
      "football agency",
      "football bank",
      "football talent management",
      "soccer agent services",
      "player representation",
      "football career development",
      "soccer talent scouting",
      "football player database",
      "soccer recruitment platform"
    ],
    url: "/",
  });
}

export default async function LangLayout({ children, params }) {
  const { lang } = await params;
  
  return (
    <ClientLayoutWrapper lang={lang}>{children}</ClientLayoutWrapper>
  );
}
