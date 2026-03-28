"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 lg:pt-40 lg:pb-24 flex flex-col items-center justify-center min-h-[92vh] mesh-bg">
      {/* Decorative animated orbs */}
      <div className="absolute top-20 right-[15%] w-72 h-72 bg-accent-blue/15 blur-[100px] rounded-full pointer-events-none animate-float" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-accent-indigo/10 blur-[120px] rounded-full pointer-events-none animate-float-slow" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-accent-violet/8 blur-[100px] rounded-full pointer-events-none animate-float-lateral" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-blue/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-blue/20 bg-accent-blue/5 text-sm font-medium mb-8 shadow-sm animate-badge-pulse">
            <Sparkles className="w-4 h-4 text-accent-blue" />
            <span className="text-foreground">AI-powered career platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-6">
            The resume that{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text-vibrant">gets you hired.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop being ignored by ATS systems. JobFlow AI crafts optimized
            resumes, scores your fit, and automates outreach — all in one
            intelligent workspace.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full gradient-premium text-white font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-accent-blue/25 transition-all active:scale-[0.98] hover:-translate-y-0.5"
            >
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-semibold text-base border border-border/50 hover:bg-secondary/80 transition-all active:scale-[0.98]"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        {/* App Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 sm:mt-20 relative mx-auto max-w-4xl"
        >
          {/* Glow behind the preview */}
          <div className="absolute -inset-4 bg-gradient-to-r from-accent-blue/10 via-accent-indigo/10 to-accent-violet/10 blur-3xl rounded-3xl pointer-events-none opacity-60" />

          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 shadow-2xl bg-card animate-float-slow">
            {/* Window chrome */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-muted/80 border-b border-border/40 flex items-center px-4 gap-2 z-10">
              <div className="w-3 h-3 rounded-full bg-red-400/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
              <div className="flex-1 mx-12">
                <div className="h-5 rounded-md bg-background/60 border border-border/30 max-w-xs mx-auto" />
              </div>
            </div>

            {/* Mockup content */}
            <div className="pt-14 p-6 h-full flex flex-col md:flex-row gap-4 bg-background">
              {/* Sidebar Mockup */}
              <div className="hidden md:flex w-1/4 flex-col gap-3 border-r border-border/30 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg gradient-premium flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-bold text-foreground">JobFlow AI</span>
                </div>
                {["Dashboard", "Resume AI", "Outreach", "Profile"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className={`text-xs px-3 py-2 rounded-lg font-medium ${
                        i === 1
                          ? "bg-accent-blue/10 text-accent-blue"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>

              {/* Main Content Mockup */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Senior Frontend Developer
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      TechCorp Inc. • Remote
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2.5 py-1 rounded-full bg-success/10 text-success text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      ATS Optimized
                    </div>
                  </div>
                </div>

                <div className="flex-1 rounded-xl bg-muted/30 border border-border/30 p-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 w-full h-1 gradient-premium-wide rounded-full" />
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-card shadow-lg border-4 border-success/20 flex items-center justify-center mb-2 mx-auto">
                      <span className="text-success font-black text-xl">
                        96%
                      </span>
                    </div>
                    <div className="text-sm font-bold text-foreground">
                      Match Score
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Highly likely to interview
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 p-3 rounded-xl bg-muted/30 border border-border/30">
                    <span className="text-[10px] font-medium text-muted-foreground block mb-1">
                      Missing Keywords
                    </span>
                    <span className="text-lg font-bold text-foreground">0</span>
                  </div>
                  <div className="flex-1 p-3 rounded-xl gradient-premium text-white flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-md">
                    <span className="text-xs font-bold">Generate Resume</span>
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
