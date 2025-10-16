
import ContactClient from "./ContactClient";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return generateSEOMetadata({
    title: `${dict.contact.title} - ${dict.contact.subtitle}`,
    description: `${dict.contact.title} FootballBank for player representation, scouting services, or partnership opportunities. FIFA licensed, global football talent management.`,
    keywords: [
      "contact footballbank",
      "football agent contact",
      "soccer representation",
      "player management contact",
      "football scouting services",
      "FIFA licensed agent"
    ],
    url: `/${lang}/contact`,
    locale: lang,
  });
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  // Generate structured data for local business
  const localBusinessData = generateStructuredData("localBusiness", {
    url: `/${lang}/contact`
  });
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessData)
        }}
      />
      <ContactClient lang={lang} dict={dict} />
    </>
  );
}

