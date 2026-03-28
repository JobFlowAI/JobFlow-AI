"use client";

import { motion } from "framer-motion";
import { Brain, Target, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesGrid() {
  return (
    <section className="py-32 relative z-10 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Everything you need. <br className="hidden md:block" />
            <span className="text-muted-foreground">Nothing you don't.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A cohesive suite designed precisely for modern job acquisition,
            bridging the gap between raw talent and automated hiring constraints.
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 glass-card p-8 md:p-12 flex flex-col justify-between group"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mb-6 shadow-sm">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">AI Resume Optimization</h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                We parse your unstructured history and map it against target job descriptions, uncovering missing keywords and turning weak phrases into quantifiable metric statements.
              </p>
            </div>
            
            <div className="mt-10 pt-6 border-t border-border/50">
               <Link href="/features" className="inline-flex items-center gap-2 text-foreground font-semibold group-hover:underline decoration-border/50 underline-offset-4">
                 Explore optimization <ArrowUpRight className="w-4 h-4" />
               </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 md:p-12 flex flex-col justify-between group bg-secondary/30"
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-secondary border border-border/50 flex items-center justify-center mb-6 text-foreground">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">ATS Fit Scoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive instant fractional match scores and line-by-line formatting compliance checks before applying.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 glass-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-10 group"
          >
            <div className="max-w-xl">
              <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center mb-6 shadow-sm">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Personalized Outreach Hub</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A seamless interface that generates tailored emails to recruiters and hiring managers. We cross-reference your resume with their specific job posting to ensure your outreach stands out and lands in the primary inbox.
              </p>
              <div className="mt-8">
               <Link href="/features" className="inline-flex items-center gap-2 text-foreground font-semibold group-hover:underline decoration-border/50 underline-offset-4">
                 Discover outreach strategies <ArrowUpRight className="w-4 h-4" />
               </Link>
              </div>
            </div>
            {/* Visual element */}
            <div className="flex-1 w-full bg-card rounded-2xl border border-border/50 flex flex-col p-6 shadow-lg gap-4 min-h-[250px] relative overflow-hidden">
              <div className="flex gap-4 items-center mb-2 pb-4 border-b border-border/40">
                <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold">JD</div>
                <div>
                  <div className="font-semibold text-foreground text-sm">To: recruitment@techcorp.com</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Subject: Senior Frontend Engineer - John Doe</div>
                </div>
              </div>
              <div className="space-y-3 text-sm text-muted-foreground pt-2">
                <p>Hi team,</p>
                <p>I noticed your opening for the Senior Frontend Engineer role. My background in building responsive web applications using React and Next.js perfectly aligns with the requirements you've listed.</p>
                <p>I recently led a migration that improved performance by 40%. I'd love to chat about how I can bring similar impact to TechCorp.</p>
              </div>
              
              <div className="mt-auto self-end px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold shadow-md hover:scale-105 transition-transform cursor-pointer">
                Send Email
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
