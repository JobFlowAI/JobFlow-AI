import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import BlogContent from "@/components/blog/BlogContent";
import { blogPosts } from "@/data/blogPosts";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main>
        <BlogContent initialPosts={blogPosts} />

        {/* Newsletter */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <ScrollReveal animationType="fade-up" className="rounded-3xl bg-foreground/5 border border-primary/20 p-10 md:p-16 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Stay Informed</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Get the latest career tips and AI trends delivered straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#">
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="flex-grow bg-background border border-border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                />
                <button className="px-8 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
