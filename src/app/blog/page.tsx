import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";

export default function BlogIndexPage() {
  return (
    <main className="flex-1 overflow-hidden relative py-20 px-4">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <BookOpen className="w-5 h-5" />
            <span>Spiritual Articles</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Wisdom Blog
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Explore ancient teachings and modern insights curated by The Gita Guidance Team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <div className="glass p-8 rounded-3xl border border-white/5 shadow-lg hover:-translate-y-1 hover:shadow-primary/20 transition-all group">
                <div className="flex items-center gap-2 text-foreground/50 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:underline">
                  Read Article <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
