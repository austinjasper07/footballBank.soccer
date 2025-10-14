
import ContactClient from "./ContactClient";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
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
    url: "/contact",
  });
}

export default async function ContactPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return <ContactClient lang={lang} dict={dict} />
}

