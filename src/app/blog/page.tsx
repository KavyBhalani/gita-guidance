import { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Spiritual Wisdom Blog | Gita Guidance",
  description: "Read in-depth articles, insights, and lessons derived from the Bhagavad Gita.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 mt-12 mb-20 relative z-10">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-primary">Spiritual Wisdom Blog</h1>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          Deep dive into the timeless teachings of the Bhagavad Gita and learn how to apply them to modern life challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="glass rounded-3xl p-6 border border-white/5 hover:-translate-y-2 transition-transform duration-500 group flex flex-col h-full">
            <div className="mb-4">
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <Link href={`/blog/${post.slug}`} className="flex-1">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-foreground/70 line-clamp-3 mb-6">
                {post.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
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
    </main>
  );
}
