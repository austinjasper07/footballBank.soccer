/* eslint-disable @typescript-eslint/no-unused-vars */
// app/blog/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/schemas";
import { formatFullDate, formatTimeAgo } from "@/utils/dateHelper";
import {
  generateMetadata as generateSEOMetadata,
  generateStructuredData,
} from "@/lib/seo";
import Head from "next/head";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { FaSquareXTwitter } from "react-icons/fa6";
import dbConnect from "@/lib/mongodb";

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const postId = (await params).id;

  // Ensure database connection
  await dbConnect();

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return {
        title: "Blog Article Not Found | FootballBank",
        description: "The requested blog article could not be found.",
      };
    }

    return generateSEOMetadata({
      title: post.title,
      description: post.summary || post.content.substring(0, 160),
      keywords: [
        post.title,
        "football blog",
        "soccer news",
        "football insights",
      ],
      image: post.imageUrl,
      url: `/blog/${postId}`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      author: post.author || "FootballBank Team",
      section: "Football",
    });
  } catch (error) {
    return {
      title: "Blog Article | FootballBank",
      description: "FootballBank Blog Article",
    };
  }
}

export default async function BlogArticlePage({ params }) {
  const postId = (await params).id;
  
  // Ensure database connection
  await dbConnect();
  
  let post;
  try {
    post = await Post.findById(postId);
    if (!post) {
      notFound();
    }
  } catch (error) {
    notFound();
  }

  // Fetch additional data for sidebar
  let allPosts = [];
  try {
    allPosts = await Post.find({}).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error('Error fetching all posts:', error);
    allPosts = [];
  }
  const recentPosts = allPosts.slice(0, 4).map((p) => ({
    id: p._id.toString(),
    title: p.title,
    createdAt: p.createdAt.toISOString(),
  }));

  // Get unique categories with counts
  const categoryCounts = {};
  allPosts.forEach((p) => {
    const category = p.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  // Get unique tags from all posts
  const allTags = [];
  allPosts.forEach((p) => {
    if (p.tags && Array.isArray(p.tags)) {
      allTags.push(...p.tags);
    }
  });
  const uniqueTags = [...new Set(allTags)].slice(0, 8);

  // Generate structured data for the article
  const articleStructuredData = generateStructuredData("article", post);

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
      </Head>
      <main className="w-full">
        {/* Breadcrumb Section */}
        <section className="w-full h-72 relative flex items-center justify-center py-16 overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/blog-breadcrumb.jpg')] ">
          {/* Background overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-black/80"></div>

          {/* Content */}
          <div className="relative z-10">
            <div className="container mx-auto px-4 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">{post.title}</h1>
            </div>
          </div>
        </section>
        <section className="bg-gray-100 py-4">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <nav className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/" className="hover:text-blue-600">
                  Home
                </Link>
                <span className="text-gray-400">-</span>
                <Link href="/blog" className="hover:text-blue-600">
                  Blog
                </Link>
                <span className="text-gray-400">-</span>
                <span className="text-gray-900">{post.title}</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-gray-100 px-3 py-1 rounded text-sm font-medium text-gray-700">
                    {post.category || "Sport"}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatFullDate(post.createdAt)}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                  {post.title}
                </h1>
              </header>

              {/* Featured Image Carousel */}
              <div className="mb-8">
                <ImageCarousel
                  images={(() => {
                    const imageArray = Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl];
                    return imageArray.filter(img => img && img.trim() !== '');
                  })()}
                  alt={post.title}
                  className="w-full"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100">
                <article dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-bold text-lg">
                      {post.author ? post.author.charAt(0) : "A"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {post.author || "Admin"}
                    </p>
                    <p className="text-sm text-gray-500">Author</p>
                  </div>
                </div>
              </div>
                </div>

                {/* Right Sidebar - Exact match to reference design */}
                <div className="lg:col-span-1 bg-white p-4 max-h-fit">
                  <div className="space-y-4">
                    {/* Search Widget */}
                    <div className="bg-gray-100 border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Search</h3>
                      <form className="relative">
                        <input
                          type="text"
                          placeholder="Search posts..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent-red text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </button>
                      </form>
                    </div>

                    {/* Categories Widget */}
                    <div className="bg-gray-100 border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Categories</h3>
                      <ul className="space-y-3">
                        {Object.entries(categoryCounts).map(([category, count], index, array) => (
                          <li key={category} className={index < array.length - 1 ? "border-b border-gray-100 pb-2" : ""}>
                            <a href={`/blog?category=${encodeURIComponent(category)}`} className="text-gray-600 hover:text-blue-600 flex items-center justify-between text-sm">
                              <span>{category}</span>
                              <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs">{count}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recent Posts Widget */}
                    <div className="bg-gray-100 border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Posts</h3>
                      <div className="space-y-4">
                        {recentPosts.map((recentPost, index) => (
                          <div key={recentPost.id} className={`flex gap-3 ${index < recentPosts.length - 1 ? "pb-3 border-b border-gray-100" : ""}`}>
                            <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0"></div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 mb-1 leading-tight">
                                <Link href={`/blog/${recentPost.id}`} className="hover:text-blue-600">
                                  {recentPost.title}
                                </Link>
                              </h4>
                              <p className="text-xs text-gray-500">{formatTimeAgo(recentPost.createdAt)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags Widget */}
                    <div className="bg-gray-100 border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {uniqueTags.length > 0 ? (
                          uniqueTags.map((tag) => (
                            <a 
                              key={tag} 
                              href={`/blog?tag=${encodeURIComponent(tag)}`} 
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              {tag}
                            </a>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No tags available</p>
                        )}
                      </div>
                    </div>

                    {/* Social Media Widget */}
                    <div className="bg-gray-100 border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900">Follow Us</h3>
                      <div className="flex space-x-3">
                        <a href="https://x.com/footballbankhq" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white border border-gray-300 text-white rounded-full flex items-center justify-center  transition-colors">
                          <FaSquareXTwitter className="w-5 h-5 text-black" />
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61580081775450" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                        <a href="https://www.instagram.com/footballbank.soccer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white rounded-full flex items-center justify-center hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 transition-all">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                        <a href="http://www.youtube.com/@footballbank.soccer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                          </svg>
                        </a>
                       
                        <a href="http://www.tiktok.com/@footballbank.soccer" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
