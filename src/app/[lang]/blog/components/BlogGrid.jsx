"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatTimeAgo } from "@/utils/dateHelper";
import ImageCarousel from "@/components/ui/ImageCarousel";

export default function BlogGrid({
  posts,
  featuredPost,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!posts || posts.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center mx-auto text-gray-500">
        No posts available
      </div>
    );
  }

  const changePage = (page) => {
    const p = Number(page);
    if (isNaN(p) || p < 1 || p > totalPages) return;

    if (typeof onPageChange === "function") {
      onPageChange(p);
      return;
    }

    // update URL query param while preserving other params
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(p));
    const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
    router.push(`${pathname}?${params.toString()}`);
  };

  // Render a small range of pages around currentPage
  const getPageRange = () => {
    const delta = 2;
    const range = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    for (let i = start; i <= end; i++) range.push(i);
    return range;
  };

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
                <ImageCarousel
                  images={Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl]}
                  alt={post.title}
                  className="h-full"
                />
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
                  {post.summary || post.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-accent-red hover:text-accent-red text-sm font-medium"
                  onClick={(e) => {
                    const link = e.currentTarget;
                    link.style.pointerEvents = "none";
                    setTimeout(() => {
                      link.style.pointerEvents = "auto";
                    }, 100);
                  }}
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
        <nav className="flex items-center gap-2" aria-label="Pagination">
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded disabled:opacity-50"
            aria-label="First page"
          >
            « First
          </button>

          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded disabled:opacity-50"
            aria-label="Previous page"
          >
            ‹ Prev
          </button>

          {getPageRange().map((p) => (
            <button
              key={p}
              onClick={() => changePage(p)}
              aria-current={p === currentPage ? "page" : undefined}
              className={`px-3 py-2 text-sm border rounded ${
                p === currentPage
                  ? "bg-accent-red text-white border-accent-red"
                  : "text-gray-500 hover:text-gray-700 border-gray-300"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded disabled:opacity-50"
            aria-label="Next page"
          >
            Next ›
          </button>

          <button
            onClick={() => changePage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded disabled:opacity-50"
            aria-label="Last page"
          >
            Last »
          </button>
        </nav>
      </div>
    </div>
  );
}
