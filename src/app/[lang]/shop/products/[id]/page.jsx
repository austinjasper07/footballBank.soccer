import { notFound } from 'next/navigation';
import { getProductById } from '@/actions/publicActions';
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import { getDictionary } from '@/lib/dictionaries';
import ProductDetailsClient from './ProductDetailsClient';

export async function generateMetadata({ params }) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang);
  
  try {
    const product = await getProductById(id);
    
    if (!product) {
      return generateSEOMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        noIndex: true
      });
    }

    const finalPrice = product.discount
      ? (product.price - product.price * (product.discount / 100)).toFixed(2)
      : product.price.toFixed(2);

    return generateSEOMetadata({
      title: `${product.name} - Football Gear | FootballBank`,
      description: product.description || `Shop ${product.name} - Premium football gear. ${product.discount ? `Save ${product.discount}% - ` : ''}Only $${finalPrice}. Free shipping available.`,
      keywords: [
        product.name.toLowerCase(),
        "football gear",
        "soccer equipment",
        "football boots",
        "football jerseys",
        "football balls",
        "training gear",
        "football merchandise",
        "sports equipment"
      ],
      url: `/shop/products/${id}`,
      image: product.image[0],
      type: "product"
    });
  } catch (error) {
    return generateSEOMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      noIndex: true
    });
  }
}

export default async function ProductPage({ params }) {
  const { id, lang } = await params;
  
  try {
    const product = await getProductById(id);
    
    if (!product) {
      notFound();
    }

    const dict = await getDictionary(lang);
    
    // Generate structured data for the product
    const structuredData = generateStructuredData("product", {
      name: product.name,
      description: product.description,
      image: product.image[0],
      price: product.discount 
        ? (product.price - product.price * (product.discount / 100)).toFixed(2)
        : product.price.toFixed(2),
      originalPrice: product.discount ? product.price.toFixed(2) : null,
      discount: product.discount,
      availability: product.stock > 0 ? "InStock" : "OutOfStock",
      brand: "FootballBank",
      category: "Sports Equipment",
      sku: product.id,
      url: `/shop/products/${id}`
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        <ProductDetailsClient product={product} lang={lang} dict={dict} />
      </>
    );
  } catch (error) {
    notFound();
  }
}