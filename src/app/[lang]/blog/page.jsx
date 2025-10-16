import Link from "next/link";
import { Post } from "@/lib/schemas"
import ClientSideFilterWrapper from "./components/ClientSideFilterWrapper"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionaries";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return generateSEOMetadata({
    title: dict.blog.title,
    description: dict.blog.subtitle,
    keywords: [
      "football blog",
      "soccer news",
      "player spotlights",
      "football insights",
      "career tips",
      "football industry news",
      "talent updates",
      "football analysis"
    ],
    url: `/${lang}/blog`,
    locale: lang,
  });
}

export default async function BlogPage({ params }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  let posts = [];
  try {
    posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Return empty array if database is not available
    posts = [];
  }
  
  const formattedPosts = posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    summary: post.summary,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    status: post.status,
    featured: post.featured,
    tags: post.tags,
    views: post.views,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  let featuredPosts = [];
  try {
    featuredPosts = await Post.find({ featured: true, status: 'published' }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    featuredPosts = [];
  }
  const formattedFeaturedPosts = featuredPosts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    content: post.content,
    summary: post.summary,
    author: post.author,
    category: post.category,
    imageUrl: post.imageUrl,
    status: post.status,
    featured: post.featured,
    tags: post.tags,
    views: post.views,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  const categories = [
    "All",
    ...Array.from(new Set(formattedPosts.map((p) => p.category))),
  ]

  return (
    <main className="w-full">
      {/* Breadcrumb Section */}
      <section 
        className="w-full h-64 relative py-16 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/blog-breadcrumb.jpg')] " 
      >
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="breadcrumb-content-main">
                <h1 className="text-4xl font-bold text-white mb-6">{dict.blog.title}</h1>
                <div className="breadcrumb-links">
                  <div className="content-inner">
                    <nav className="breadcrumb" aria-labelledby="system-breadcrumb">
                      <ol className="flex items-center gap-2 text-sm text-white">
                        <li>
                          <Link href={`/${lang}`} className="hover:text-blue-300">{dict.navigation.home}</Link>
                          <span className="mx-2">-</span>
                        </li>
                        <li>
                          <span className="text-white">{dict.blog.title}</span>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <ClientSideFilterWrapper
              posts={formattedPosts}
              featuredPost={formattedFeaturedPosts}
              categories={categories}
              lang={lang}
              dict={dict}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
