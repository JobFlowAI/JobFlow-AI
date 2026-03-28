"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center min-h-[90vh]">
      {/* Subtle modern background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-foreground/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">Revolutionize your job search</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[1.05] mb-8">
            The resume that <br className="hidden md:block" />
            <span className="text-muted-foreground">gets you hired.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Stop being ignored by ATS systems. JobFlow AI optimizes your resume,
            matches you to jobs, and automates your outreach with unprecedented precision.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-semibold text-[1.05rem] shadow-xl hover:shadow-2xl transition-all"
              >
                Start for free <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/features">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-secondary/50 backdrop-blur-md text-foreground font-semibold text-[1.05rem] border border-border/50 hover:bg-secondary transition-all"
              >
                See how it works
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Abstract App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative mx-auto max-w-4xl"
        >
          <div className="aspect-[16/9] rounded-2xl overflow-hidden glass-card border border-border/40 shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-10 bg-secondary/80 border-b border-border/40 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-gold/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            {/* Mockup content */}
            <div className="pt-16 p-8 h-full flex flex-col md:flex-row gap-6 bg-background dark:bg-card">
              {/* Sidebar Mockup */}
              <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div>
                  <div className="text-sm font-bold text-foreground mb-1">Senior Frontend Developer</div>
                  <div className="text-xs text-muted-foreground">TechCorp Inc. • Remote</div>
                </div>
                
                <div className="space-y-4 flex-1">
                   <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                     <div className="text-xs font-semibold text-foreground mb-2">Required Skills</div>
                     <div className="flex flex-wrap gap-2">
                       <span className="px-2 py-1 rounded bg-foreground/10 text-xs font-medium text-foreground">React</span>
                       <span className="px-2 py-1 rounded bg-foreground/10 text-xs font-medium text-foreground">Next.js</span>
                       <span className="px-2 py-1 rounded bg-foreground/10 text-xs font-medium text-foreground">TypeScript</span>
                     </div>
                   </div>
                   <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="w-2 h-2 rounded-full bg-success"></span>
                       <div className="text-xs font-bold text-success">ATS Optimized</div>
                     </div>
                     <div className="text-xs text-success/80">Formatting passed all checks.</div>
                   </div>
                </div>
              </div>
              
              {/* Main Content Mockup */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex-1 rounded-xl bg-foreground/5 border border-border/50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-success/40 via-success to-success/40" />
                  <div className="w-24 h-24 rounded-full bg-background shadow-lg border-4 border-success/20 flex items-center justify-center mb-4 z-10">
                    <span className="text-success font-black text-3xl">96%</span>
                  </div>
                  <div className="text-lg font-bold text-foreground transition-all">Match Score</div>
                  <div className="text-sm text-muted-foreground mt-1">Highly likely to interview</div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-xl bg-secondary/30 border border-border/50 shadow-inner flex flex-col justify-between">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Missing Keywords</span>
                     <span className="text-xl font-bold text-foreground">0</span>
                  </div>
                  <div className="flex-1 p-4 rounded-xl bg-foreground text-background shadow-lg shadow-foreground/10 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                     <span className="font-bold">Generate Outreach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
