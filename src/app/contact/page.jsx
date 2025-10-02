
import ContactClient from "./ContactClient";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Contact Us - Get in Touch",
  description: "Contact FootballBank for player representation, scouting services, or partnership opportunities. FIFA licensed, global football talent management.",
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


export default function ContactPage() {
  return (<ContactClient />)
}

