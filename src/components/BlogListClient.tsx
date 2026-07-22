"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";
import { useFavoriteBlogs } from "@/hooks/useFavoriteBlogs";

interface Post {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags?: string[];
  content: string;
}

interface BlogListClientProps {
  initialPosts: Post[];
}

export function BlogListClient({ initialPosts }: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const { isFavorite, toggleFavorite, isLoading } = useFavoriteBlogs();

  // Filter posts based on tab and search
  const filteredPosts = initialPosts.filter(post => {
    // 1. Filter by Tab
    if (activeTab === "favorites" && !isFavorite(post.slug)) {
      return false;
    }

    // 2. Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = post.title.toLowerCase().includes(q);
      const matchesTags = post.tags?.some(tag => tag.toLowerCase().includes(q));
      const matchesContent = post.content.toLowerCase().includes(q);
      
      if (!matchesTitle && !matchesTags && !matchesContent) {
        return false;
      }
    }

    return true;
  });

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Search by title, tag, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'all' ? 'bg-primary text-background shadow-lg' : 'text-foreground/70 hover:text-foreground'}`}
          >
            All Articles
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'favorites' ? 'bg-primary text-background shadow-lg' : 'text-foreground/70 hover:text-foreground'}`}
          >
            <Star className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-background' : ''}`} />
            Favorites
          </button>
        </div>
      </div>

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-foreground/60 text-lg">
            {activeTab === "favorites" 
              ? "You haven't bookmarked any blogs yet." 
              : "No articles found matching your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.slug} className="glass rounded-3xl p-6 border border-white/5 hover:-translate-y-2 transition-transform duration-500 group flex flex-col h-full relative">
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigating when clicking star
                  toggleFavorite(post.slug);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm border border-white/10 transition-colors z-10"
                title={isFavorite(post.slug) ? "Remove Bookmark" : "Bookmark Article"}
              >
                <Star className={`w-4 h-4 transition-colors ${isFavorite(post.slug) ? 'fill-primary text-primary' : 'text-foreground/40 hover:text-primary'}`} />
              </button>

              <div className="mb-4 pr-10">
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <Link href={`/blog/${post.slug}`} className="flex-1">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-foreground/70 line-clamp-3 mb-6">
                  {post.content.replace(/<[^>]*>?/gm, '').replace(/[#*_\-~`>\[\]]/g, '').trim().substring(0, 150)}...
                </p>
              </Link>
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-foreground/50">{post.author}</span>
                <Link href={`/blog/${post.slug}`} className="text-primary font-medium text-sm hover:underline">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
