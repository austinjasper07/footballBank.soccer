import  prisma  from "@/lib/prisma"
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

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  }).then((posts) =>
    posts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))
  )

  const featuredPost = await prisma.post.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  }).then((featuredPosts) =>
    featuredPosts.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))
  )

  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category))),
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
            posts={posts}
            featuredPost={featuredPost}
            categories={categories}
          />
        </div>
      </section>
    </main>
  )
}
