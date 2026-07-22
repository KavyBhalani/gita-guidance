import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import { BlogListClient } from "@/components/BlogListClient";

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

      <BlogListClient initialPosts={posts} />
    </main>
  );
}
