import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { marked } from "marked";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import { BlogClientContent } from "@/components/BlogClientContent";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Gita Guidance Blog`,
    description: post.content.substring(0, 150).replace(/<[^>]*>?/gm, '') + '...',
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 150).replace(/<[^>]*>?/gm, ''),
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    }
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Split markdown into blocks (paragraphs, headings, etc.)
  const markdownBlocks = post.content.split(/\n\n+/).filter(c => c.trim().length > 0);
  
  const blocks = markdownBlocks.map(block => {
    return {
      html: marked.parse(block) as string,
      text: block.replace(/<[^>]*>?/gm, '').replace(/[#*_\-~`\[\]]/g, '').trim()
    };
  });
  
  // Calculate read time
  const totalText = blocks.map(b => b.text).join(' ');
  const wordCount = totalText.split(/\s+/g).length;
  const readTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 mt-8 mb-20 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>

      <article className="glass rounded-3xl p-8 md:p-12 border border-white/5">
        <header className="mb-10 pb-10 border-b border-white/10 text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
            {post.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-foreground/60 text-sm font-medium">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </div>
            <div>
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        <BlogClientContent 
          slug={post.slug} 
          blocks={blocks}
        />
        
      </article>

      {/* JSON-LD for the Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "datePublished": post.date,
            "dateModified": post.date,
            "author": [{
                "@type": "Person",
                "name": post.author,
            }]
          })
        }}
      />
    </main>
  );
}
