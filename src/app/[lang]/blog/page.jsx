import { Post } from "@/lib/schemas"
import ClientSideFilterWrapper from "./components/ClientSideFilterWrapper"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata = generateSEOMetadata({
  title: "Football Blog & News",
  description: "Stay updated with the latest football insights, player spotlights, career tips, and industry news. Expert analysis and talent updates from FootballBank.",
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
  url: "/blog",
});

export default async function BlogPage() {
  'use server'

  const posts = await Post.find({}).sort({ createdAt: -1 })
  const formattedPosts = posts.map((post) => ({
    ...post.toObject(),
    id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  const featuredPosts = await Post.find({ featured: true }).sort({ createdAt: -1 })
  const formattedFeaturedPosts = featuredPosts.map((post) => ({
    ...post.toObject(),
    id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  const categories = [
    "All",
    ...Array.from(new Set(formattedPosts.map((p) => p.category))),
  ]

  return (
    <main className="bg-primary-bg text-primary-text">
      <section className="py-16 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className=" font-bold text-4xl md:text-5xl mb-6">
            Football Talent Hub
          </h1>
          <p className="text-primary-muted text-lg mb-8">
            Latest insights, player spotlights, and transfer updates from the
            world of football talent scouting.
          </p>

          <ClientSideFilterWrapper
            posts={formattedPosts}
            featuredPost={formattedFeaturedPosts}
            categories={categories}
          />
        </div>
      </section>
    </main>
  )
}
