import Image from "next/image";
import Link from "next/link";
import { formatTimeAgo } from "@/utils/dateHelper";

export default function BlogGrid({ posts, featuredPost }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center mx-auto text-gray-500">
        No posts available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid - Exact match to reference design */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post?.id}
              className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                {(() => {
                  const imageUrl = Array.isArray(post.imageUrl) 
                    ? post.imageUrl[0] 
                    : post.imageUrl;
                  
                  if (imageUrl && imageUrl.trim() !== '') {
                    return (
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    );
                  } else {
                    return (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 text-xs">No Image</p>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {post.category || "Sport"}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 leading-tight">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {post.summary || post.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center mx-auto text-gray-500">
          No posts found
        </div>
      )}

      {/* Pagination - Matching reference design */}
      <div className="flex items-center justify-center mt-12">
        <nav className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
            Current page1
          </button>
          <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
            Page2
          </button>
          <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
            Next page Next ›
          </button>
          <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded">
            Last page Last »
          </button>
        </nav>
      </div>
    </div>
  );
}
