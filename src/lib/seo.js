// SEO Configuration and Utilities
export const siteConfig = {
  name: "FootballBank.soccer",
  title: "FootballBank - Global Football Talent Platform",
  description: "Discover and showcase football talent worldwide. Connect players with scouts, clubs, and opportunities through our comprehensive talent banking platform.",
  url: "https://footballbank.soccer",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://x.com/footballbankhq",
    facebook: "https://www.facebook.com/profile.php?id=61580081775450",
    instagram: "https://www.instagram.com/footballbank.soccer",
    youtube: "http://www.youtube.com/@footballbank.soccer",
    tiktok: "http://www.tiktok.com/@footballbank.soccer"
  },
  keywords: [
    "football talent",
    "soccer players",
    "football scouts",
    "player profiles",
    "football recruitment",
    "soccer talent bank",
    "football opportunities",
    "player showcase",
    "football agent",
    "soccer careers"
  ]
};

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  noIndex = false
}) {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const fullDescription = description || siteConfig.description;
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const fullImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}${siteConfig.ogImage}`;
  const allKeywords = [...siteConfig.keywords, ...keywords].join(", ");

  const metadata = {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: [{ name: author || "FootballBank Team" }],
    creator: "FootballBank",
    publisher: "FootballBank",
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    canonical: fullUrl,
    openGraph: {
      type,
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        }
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
      creator: "@footballbankhq",
      site: "@footballbankhq",
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  // Add article-specific metadata
  if (type === "article") {
    metadata.openGraph.publishedTime = publishedTime;
    metadata.openGraph.modifiedTime = modifiedTime;
    metadata.openGraph.authors = [author || "FootballBank Team"];
    metadata.openGraph.section = section;
  }

  return metadata;
}

export function generateStructuredData(type, data) {
  const baseData = {
    "@context": "https://schema.org",
  };

  switch (type) {
    case "organization":
      return {
        ...baseData,
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-862-372-9817",
          contactType: "customer service",
          email: "contact@footballbank.soccer"
        },
        sameAs: Object.values(siteConfig.links),
        address: {
          "@type": "PostalAddress",
          addressLocality: "New Jersey",
          addressCountry: "US"
        }
      };

    case "person":
      return {
        ...baseData,
        "@type": "Person",
        name: `${data.firstName} ${data.lastName}`,
        description: data.description,
        image: data.imageUrl?.[0],
        nationality: data.country,
        birthDate: data.dob,
        jobTitle: "Football Player",
        sport: "Football/Soccer",
        position: data.position,
        height: data.height,
        weight: data.weight,
        url: `${siteConfig.url}/players/${data.id}`,
        sameAs: data.socialLinks || []
      };

    case "article":
      return {
        ...baseData,
        "@type": "Article",
        headline: data.title,
        description: data.summary,
        image: data.imageUrl,
        author: {
          "@type": "Person",
          name: data.author || "FootballBank Team"
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/logo.png`
          }
        },
        datePublished: data.createdAt,
        dateModified: data.updatedAt || data.createdAt,
        url: `${siteConfig.url}/blog/${data.id}`
      };

    case "website":
      return {
        ...baseData,
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/players?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };

    case "breadcrumb":
      return {
        ...baseData,
        "@type": "BreadcrumbList",
        itemListElement: data.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${siteConfig.url}${item.url}`
        }))
      };

    case "product":
      return {
        ...baseData,
        "@type": "Product",
        name: data.name,
        description: data.description,
        image: data.image,
        brand: {
          "@type": "Brand",
          name: data.brand || "FootballBank"
        },
        category: data.category,
        sku: data.sku,
        url: `${siteConfig.url}${data.url}`,
        offers: {
          "@type": "Offer",
          price: data.price,
          priceCurrency: "USD",
          availability: `https://schema.org/${data.availability}`,
          seller: {
            "@type": "Organization",
            name: siteConfig.name
          },
          ...(data.originalPrice && {
            priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })
        },
        ...(data.discount && {
          additionalProperty: {
            "@type": "PropertyValue",
            name: "discount",
            value: data.discount
          }
        })
      };

    case "collection":
      return {
        ...baseData,
        "@type": "CollectionPage",
        name: data.name,
        description: data.description,
        url: `${siteConfig.url}${data.url}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: data.numberOfItems,
          itemListElement: data.items?.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: item.name,
              url: `${siteConfig.url}/shop/products/${item.id}`
            }
          }))
        }
      };

    default:
      return baseData;
  }
}

export function generateBreadcrumbs(path, customItems = []) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: "Home", url: "/" }];

  let currentPath = "";
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Use custom items if provided
    if (customItems[index]) {
      breadcrumbs.push({
        name: customItems[index],
        url: currentPath
      });
    } else {
      // Default segment naming
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      breadcrumbs.push({
        name,
        url: currentPath
      });
    }
  });

  return breadcrumbs;
}
