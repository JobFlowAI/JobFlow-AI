import { Calendar, User, ArrowLeft, Share2, Bookmark, Clock } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { blogPosts, BlogPostData } from "@/data/blogPosts";
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { notFound } from "next/navigation";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <LandingNav />
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link 
            href="/blog"
            className="flex items-center gap-2 text-foreground font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main className="max-w-4xl mx-auto px-6 py-20 lg:py-28">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <article>
          <ScrollReveal animationType="fade-up">
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-foreground/10 text-foreground text-xs font-bold">
                {post.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-8">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-border mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center text-background font-bold">
                  {post.author[0]}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{post.author}</div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-muted-foreground">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill
                className="object-cover"
                sizes="(max-w-4xl) 100vw, 896px"
                priority
              />
            </div>

            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-blockquote:border-primary prose-blockquote:bg-foreground/5 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </ScrollReveal>
        </article>

        {/* Next Posts CTA */}
        <section className="mt-20 pt-20 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-10">More to Read</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts
              .filter(p => p.slug !== post.slug)
              .slice(0, 2)
              .map(p => (
                <Link 
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="flex gap-6 group cursor-pointer"
                >
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform" sizes="96px" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-foreground transition-colors line-clamp-2 mb-2">
                      {p.title}
                    </h3>
                    <div className="text-sm text-muted-foreground">{p.date}</div>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
