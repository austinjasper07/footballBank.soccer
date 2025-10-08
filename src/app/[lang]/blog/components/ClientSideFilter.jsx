"use client";
import { useState, useMemo } from "react";
import BlogTabs from "./BlogTabs";
import BlogSearch from "./BlogSearch";
import BlogGrid from "./BlogGrid";

export default function ClientSideFilter({
  posts,
  featuredPost,
  categories,
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");

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
        <BlogTabs
          categories={categories}
          active={activeTab}
          onChange={setActiveTab}
        />
        <BlogSearch value={query} onChange={setQuery} />
      </div>
      
      {/* Blog Grid */}
      <BlogGrid posts={filteredPosts} featuredPost={featuredPost} />
    </div>
  );
}
