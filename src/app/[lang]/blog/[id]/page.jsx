/* eslint-disable @typescript-eslint/no-unused-vars */
// app/blog/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { formatFullDate, formatTimeAgo } from '@/utils/dateHelper';
import { generateMetadata as generateSEOMetadata, generateStructuredData } from '@/lib/seo';
import Head from 'next/head';

// Dynamic metadata generation
export async function generateMetadata({ params }) {
  const postId = (await params).id;
  
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`
    );
    const post = res.data;
    
    return generateSEOMetadata({
      title: post.title,
      description: post.summary || post.content.substring(0, 160),
      keywords: [post.title, "football blog", "soccer news", "football insights"],
      image: post.imageUrl,
      url: `/blog/${postId}`,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      author: post.author || "FootballBank Team",
      section: "Football"
    });
  } catch (error) {
    return {
      title: 'Blog Article | FootballBank',
      description: 'FootballBank Blog Article',
    };
  }
}

export default async function BlogArticlePage({ params }) {
  const postId = (await params).id;
  let post;
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`
    );
     post = res.data;
} catch (error) {
    notFound();
  }

  // Generate structured data for the article
  const articleStructuredData = generateStructuredData("article", post);

    return (
      <>
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
          />
        </Head>
        <main className="bg-primary-bg text-primary-text font-inter">
        {/* Breadcrumb */}
        <section className="py-6 border-b border-divider">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm">
              <span className="text-primary-muted hover:text-accent-red cursor-pointer">Home</span>
              <i className="fa-solid fa-chevron-right text-primary-muted text-xs" />
              <span className="text-primary-muted hover:text-accent-red cursor-pointer">Blog</span>
              <i className="fa-solid fa-chevron-right text-primary-muted text-xs" />
              <span className="text-primary-text">{post.title}</span>
            </div>
          </div>
        </section>

        {/* Article */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <header className="mb-12">
                <div className="flex items-center gap-4 mb-4 text-sm text-primary-muted">
                  <span>📅 {formatFullDate(post.createdAt)}</span>
                  <span>🕒 {formatTimeAgo(post.createdAt)}</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                  {post.title}
                </h1>
              </header>

              {post.imageUrl.length > 0 && (
                <div className="mb-12">
                  <Image
                    src={post.imageUrl[0]}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="w-full h-[400px] object-cover rounded-xl"
                  />
                </div>
              )}

              <article className="prose prose-invert max-w-none text-lg leading-relaxed space-y-6">
                {post.content.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </article>
            </div>
          </div>
        </section>
      </main>
      </>
    );
  
}
