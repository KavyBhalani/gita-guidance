import React from "react";
import { Calendar } from "lucide-react";
import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import { BlogBackButton, BlogAuthorLabel } from "@/components/BlogClientUI";

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex-1 overflow-hidden relative py-20 px-4">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <BlogBackButton />

        <article className="glass p-8 md:p-12 rounded-3xl border border-white/5 shadow-lg">
          <header className="mb-10 text-center border-b border-white/10 pb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-2 text-foreground/50 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <BlogAuthorLabel />
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none text-foreground/80 leading-relaxed">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
}
