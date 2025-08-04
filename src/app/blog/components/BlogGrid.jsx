import Image from "next/image";
import Link from "next/link";
import { formatTimeAgo } from "@/utils/dateHelper";

export default function BlogGrid({ posts, featuredPost }) {
  if (!posts || posts.length === 0) {
    return <div className="w-full h-48 flex items-center justify-center mx-auto">No posts available</div>;
  }
  return (
    <div className="space-y-16">
      {/* ✅ Featured Post */}
      { featuredPost && featuredPost.length > 0 ? (
        <section className="bg-primary-white rounded-xl border border-divider shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-64 lg:h-auto">
            <Image
              src={featuredPost[0].imageUrl}
              alt="Featured post"
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-accent-green text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </span>
            </div>
          </div>
          <div className="p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-accent-red text-sm font-medium">
                {featuredPost[0].category || "Spotlight"}
              </span>
              <span className="text-primary-muted text-sm">
                {formatTimeAgo(featuredPost[0].createdAt)}
              </span>
            </div>
            <h2 className="font-poppins font-bold text-2xl lg:text-3xl mb-4">
              {featuredPost[0].title}
            </h2>
            <p className="text-primary-muted mb-6">
              {featuredPost[0].summary || featuredPost[0].content.slice(0, 160)}...
            </p>
            <Link
              href={`/posts/${featuredPost[0].id}`}
              className="bg-accent-red hover:bg-accent-red/90 text-white px-6 py-3 rounded-lg font-medium"
            >
              Read Full Story
            </Link>
          </div>
        </section>
      ): null}

      {/* ✅ Regular Posts Grid */}
      {posts.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      
        { posts.map((post) => (
          <article
            key={post?.id}
            className="bg-primary-white rounded-xl border border-divider shadow-sm hover:shadow-lg hover:border-accent-red transition-all"
          >
            <div className="relative h-48">
              <Image
                src={post.imageUrl[0]}
                alt={post.title}
                fill
                className="object-cover rounded-t-xl"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3 text-sm text-primary-muted">
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>
              <h3 className="font-poppins font-semibold text-lg mb-3 text-primary-text">
                {post.title}
              </h3>
              <p className="text-primary-muted text-sm mb-4">
                {post.summary || post.content.slice(0, 120)}...
              </p>
              <Link
                href={`/posts/${post.id}`}
                className="text-accent-red text-sm font-medium hover:underline"
              >
                Read More
              </Link>
            </div>
          </article>
        ))}
      </div>: (
          <div className="w-full h-48 flex items-center justify-center mx-auto">No posts found</div>
        )}
    </div>
  );
}
