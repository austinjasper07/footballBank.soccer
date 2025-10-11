import { getAllProducts } from "@/actions/publicActions";
import { generateMetadata as generateSEOMetadata, generateStructuredData } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";
import ShopPageClient from "./ShopPageClient";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: "Football Shop - Premium Football Gear & Equipment",
    description: "Shop premium football gear, boots, jerseys, balls, and training equipment. Quality football merchandise for players, coaches, and fans worldwide.",
    keywords: [
      "football shop",
      "soccer equipment",
      "football boots",
      "football jerseys",
      "football balls",
      "training gear",
      "football merchandise",
      "soccer gear",
      "football accessories",
      "sports equipment"
    ],
    url: "/shop/products",
    type: "website"
  });
}

export default async function ShopPage({ params }) {
  const { lang } = await params;
  const products = await getAllProducts();
  
  // Generate structured data for the shop collection
  const structuredData = generateStructuredData("collection", {
    name: "Football Shop - Premium Football Gear & Equipment",
    description: "Shop premium football gear, boots, jerseys, balls, and training equipment. Quality football merchandise for players, coaches, and fans worldwide.",
    url: "/shop/products",
    numberOfItems: products.length,
    items: products.slice(0, 20).map(product => ({
      id: product.id,
      name: product.name
    }))
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <ShopPageClient products={products} lang={lang} />
    </>
  );
}
