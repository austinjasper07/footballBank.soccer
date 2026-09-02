import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import PricingClient from "./PricingClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: dict.pricing.title,
    description: dict.pricing.subtitle,
    keywords: [
      "football subscription plans",
      "soccer talent platform pricing",
      "football agent services",
      "player profile subscription",
      "footballbank pricing",
      "soccer recruitment platform"
    ],
    url: `/${lang}/pricing`,
    locale: lang,
  });
}

export default async function PricingPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return <PricingClient lang={lang} dict={dict} />;
}