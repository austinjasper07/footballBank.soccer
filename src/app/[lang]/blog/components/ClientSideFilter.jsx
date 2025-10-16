"use client";
import { useState, useMemo, useEffect } from "react";
import BlogTabs from "./BlogTabs";
import BlogSearch from "./BlogSearch";
import BlogGrid from "./BlogGrid";

export default function ClientSideFilter({
  posts: initialPosts,
  featuredPost: initialFeaturedPost,
  categories: initialCategories,
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState(initialPosts);
  const [featuredPost, setFeaturedPost] = useState(initialFeaturedPost);
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState(Date.now());

  // Fetch fresh data periodically and on focus
  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        setLoading(true);
        
        // Fetch both posts and featured posts in parallel
        const [postsResponse, featuredResponse] = await Promise.all([
          fetch('/api/blog/posts', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          }),
          fetch('/api/blog/featured', { 
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache' }
          })
        ]);

        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          if (postsData.success) {
            setPosts(postsData.posts);
            // Update categories based on fresh posts
            const newCategories = [
              "All",
              ...Array.from(new Set(postsData.posts.map((p) => p.category))),
            ];
            setCategories(newCategories);
          }
        }

        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json();
          if (featuredData.success) {
            setFeaturedPost(featuredData.posts);
          }
        }

        setLastFetch(Date.now());
      } catch (error) {
        console.error("Error fetching fresh blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch fresh data on component mount
    fetchFreshData();

    // Set up periodic refresh (every 30 seconds)
    const interval = setInterval(fetchFreshData, 30000);

    // Fetch fresh data when window regains focus
    const handleFocus = () => {
      fetchFreshData();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory = activeTab === "All" || post.category === activeTab;
      const matchSearch = post.title
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [posts, activeTab, query]);

  return (
    <div className="space-y-8">
      {/* Filter Controls - Simplified to match reference */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <BlogTabs
            categories={categories}
            active={activeTab}
            onChange={setActiveTab}
          />
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <span>Updating posts...</span>
            </div>
          )}
        </div>
        <BlogSearch value={query} onChange={setQuery} />
      </div>
      
      {/* Last updated indicator */}
      <div className="text-xs text-gray-400 text-right">
        Last updated: {new Date(lastFetch).toLocaleTimeString()}
      </div>
      
      {/* Blog Grid */}
      <BlogGrid posts={filteredPosts} featuredPost={featuredPost} />
    </div>
  );
}
