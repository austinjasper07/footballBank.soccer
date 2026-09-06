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
      <div className="mx-auto flex h-48 w-full items-center justify-center text-primary-muted">
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
              className="border border-divider bg-primary-card transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageCarousel
                  images={Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl]}
                  alt={post.title}
                  className="h-full"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-sm text-primary-muted">
                  <span className="rounded bg-secondary-bg-alt px-2 py-1 text-xs font-medium text-primary-text">
                    {post.category || "Sport"}
                  </span>
                  <span className="text-primary-muted">-</span>
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
                <h3 className="mb-3 text-lg font-semibold leading-tight text-primary-text">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-primary-muted">
                  {post.summary || post.content.replace(/<[^>]*>/g, "").slice(0, 100)}...
                </p>
                <Link
                  href={`/blog/${post.id}`}
                  className="text-sm font-medium text-primary-action hover:text-primary-action-hover"
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
        <div className="mx-auto flex h-48 w-full items-center justify-center text-primary-muted">
          No posts found
        </div>
      )}

      {/* Pagination - Matching reference design */}
      <div className="flex items-center justify-center mt-12">
        <nav className="flex items-center gap-2" aria-label="Pagination">
          <button
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
            className="rounded border border-divider px-3 py-2 text-sm text-primary-muted hover:border-primary-action hover:text-primary-action disabled:opacity-50"
            aria-label="First page"
          >
            « First
          </button>

          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded border border-divider px-3 py-2 text-sm text-primary-muted hover:border-primary-action hover:text-primary-action disabled:opacity-50"
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
                  ? "border-primary-action bg-primary-action text-primary-text-inverse"
                  : "border-divider text-primary-muted hover:border-primary-action hover:text-primary-action"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded border border-divider px-3 py-2 text-sm text-primary-muted hover:border-primary-action hover:text-primary-action disabled:opacity-50"
            aria-label="Next page"
          >
            Next ›
          </button>

          <button
            onClick={() => changePage(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded border border-divider px-3 py-2 text-sm text-primary-muted hover:border-primary-action hover:text-primary-action disabled:opacity-50"
            aria-label="Last page"
          >
            Last »
          </button>
        </nav>
      </div>
    </div>
  );
}
