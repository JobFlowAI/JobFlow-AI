"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  LayoutDashboard,
  TrendingUp,
  Target,
  Clock,
} from "lucide-react";

const advantages = [
  {
    icon: ShieldCheck,
    title: "Beats Every ATS",
    desc: "Our AI rewrites your resume to match each job description — maximizing keyword density and format compliance so you never get filtered out.",
  },
  {
    icon: Target,
    title: "Know Your Fit Score",
    desc: "Get a real-time ATS compatibility score before applying. Know exactly how strong your resume is for any role.",
  },
  {
    icon: Zap,
    title: "Outreach in Seconds",
    desc: "Generate personalized cold emails and LinkedIn messages instantly. Stop staring at a blank screen.",
  },
  {
    icon: LayoutDashboard,
    title: "One Unified Workspace",
    desc: "Resume builder, job tracker, and outreach tools — all connected. No more juggling five different apps.",
  },
  {
    icon: TrendingUp,
    title: "Built on Real Data",
    desc: "Trained on thousands of real job descriptions and successful hires — not generic templates or guesswork.",
  },
  {
    icon: Clock,
    title: "Hours Saved Per Application",
    desc: "What used to take 3 hours now takes 5 minutes. Apply to more roles without burning out.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-background text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            Why JobFlow AI
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            The unfair advantage
            <br />
            <span className="text-muted-foreground">every job seeker deserves.</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            We built the tools we wished existed when we were applying — ruthlessly focused on getting you hired.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {advantages.map(({ icon: Icon, title, desc }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative p-6 rounded-2xl border border-border/60 bg-card hover:border-foreground/20 hover:shadow-md transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border/60 flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:border-foreground transition-all duration-300">
                <Icon className="w-5 h-5 text-foreground/70 group-hover:text-background transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
