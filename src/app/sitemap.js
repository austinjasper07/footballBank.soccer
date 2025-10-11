import { getAllProducts } from '@/actions/publicActions';
import { getAllPosts } from '@/actions/publicActions';
import { getAllPlayers } from '@/actions/publicActions';

export default async function sitemap() {
  const baseUrl = 'https://footballbank.soccer';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/players`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agent`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/shop/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/submit-profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/career-tips`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }
  ];

  // Language-specific pages
  const languages = ['en', 'es'];
  const languagePages = [];
  
  languages.forEach(lang => {
    staticPages.forEach(page => {
      if (page.url === baseUrl) {
        languagePages.push({
          url: `${baseUrl}/${lang}`,
          lastModified: new Date(),
          changeFrequency: page.changeFrequency,
          priority: page.priority,
        });
      } else {
        languagePages.push({
          url: `${baseUrl}/${lang}${page.url.replace(baseUrl, '')}`,
          lastModified: new Date(),
          changeFrequency: page.changeFrequency,
          priority: page.priority,
        });
      }
    });
  });

  // Dynamic pages - Products
  let productPages = [];
  try {
    const products = await getAllProducts();
    productPages = products.map(product => ({
      url: `${baseUrl}/shop/products/${product.id}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  // Dynamic pages - Blog posts
  let blogPages = [];
  try {
    const posts = await getAllPosts();
    blogPages = posts.map(post => ({
      url: `${baseUrl}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
  }

  // Dynamic pages - Player profiles
  let playerPages = [];
  try {
    const players = await getAllPlayers();
    playerPages = players.map(player => ({
      url: `${baseUrl}/players/${player.id}`,
      lastModified: new Date(player.updatedAt || player.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error fetching players for sitemap:', error);
  }

  return [
    ...staticPages,
    ...languagePages,
    ...productPages,
    ...blogPages,
    ...playerPages,
  ];
}