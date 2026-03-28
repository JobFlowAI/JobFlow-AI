"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Calendar, User, ArrowRight, Search, Tag } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { useRouter } from "next/navigation";

import { blogPosts } from "@/data/blogPosts";

const categories = ["All", "AI Trends", "Career Advice", "Networking", "Product Updates", "Success Stories"];

export default function Blog() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main>
        {/* Hero */}
        <section className="py-20 bg-card border-b border-border">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">The JobFlow <span className="text-foreground">Blog</span></h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Insights, tips, and trends to help you navigate the modern, AI-driven hiring landscape.
              </p>
            </motion.div>
            
            <div className="max-w-xl mx-auto mt-10 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-background sticky top-[72px] z-30 border-b border-border transition-colors">
          <div className="max-w-6xl mx-auto px-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-4 min-w-max">
              <div className="flex items-center gap-2 text-muted-foreground mr-4 font-medium">
                <Tag className="w-4 h-4" /> Categories:
              </div>
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                    selectedCategory === cat 
                    ? "bg-foreground border-primary text-background" 
                    : "border-border hover:border-primary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Post Grid */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/50 transition-colors cursor-pointer"
                  >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-foreground text-background text-xs font-bold leading-none">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <Calendar className="w-3.5 h-3.5" /> {post.date}
                      </div>
                      <div className="flex items-center gap-1.5 line-clamp-1">
                        <User className="w-3.5 h-3.5" /> {post.author}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 leading-tight group-hover:text-foreground transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{post.readTime}</span>
                      <div className="flex items-center gap-1.5 text-foreground font-bold">
                        Read More <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/5 text-foreground mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory("All");}}
                  className="mt-6 text-foreground font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
            </div>
            
            <div className="mt-20 text-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold hover:border-primary transition-colors inline-flex items-center gap-2"
              >
                Load More Articles
              </motion.button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-3xl bg-foreground/5 border border-primary/20 p-10 md:p-16 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Stay Informed</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Get the latest career tips and AI trends delivered straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="flex-grow bg-background border border-border rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                />
                <button className="px-8 py-3 rounded-xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
