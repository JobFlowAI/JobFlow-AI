"use client";

import { motion } from "framer-motion";
import { Brain, Target, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesGrid() {
  return (
    <section className="py-24 md:py-32 relative z-10 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
            Everything you need.{" "}
            <br className="hidden md:block" />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            A cohesive suite designed precisely for modern job acquisition,
            bridging the gap between raw talent and automated hiring systems.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {/* Feature 1 — Large card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 group relative rounded-2xl border border-border bg-card p-8 md:p-10 flex flex-col justify-between overflow-hidden hover:border-foreground/20 transition-all duration-300 hover:shadow-lg shadow-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                AI Resume Optimization
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                We parse your unstructured history and map it against target job
                descriptions, uncovering missing keywords and turning weak
                phrases into quantifiable metric statements.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-border/40 relative z-10">
              <Link
                href="/features"
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-80 transition-colors"
              >
                Explore optimization{" "}
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Feature 2 — Small card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative rounded-2xl border border-border bg-card p-8 md:p-10 flex flex-col justify-between overflow-hidden hover:border-foreground/20 transition-all duration-300 hover:shadow-lg shadow-sm"
          >
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-foreground/5 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-info/10 text-info flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                ATS Fit Scoring
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive instant fractional match scores and line-by-line
                formatting compliance checks before applying.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 — Full-width card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 group relative rounded-2xl border border-border bg-card p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 overflow-hidden hover:border-foreground/20 transition-all duration-300 hover:shadow-lg shadow-sm"
          >
            <div className="absolute top-0 left-1/2 w-96 h-48 bg-foreground/5 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="max-w-lg relative z-10">
              <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Personalized Outreach Hub
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                A seamless interface that generates tailored emails to recruiters
                and hiring managers. We cross-reference your resume with their
                specific job posting to ensure your outreach lands.
              </p>
              <div className="mt-6">
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-80 transition-colors"
                >
                  Discover outreach strategies{" "}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* Email preview mockup */}
            <div className="flex-1 w-full rounded-xl border border-border bg-muted/20 p-5 shadow-sm relative z-10">
              <div className="flex gap-3 items-center mb-3 pb-3 border-b border-border">
                <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
                  JD
                </div>
                <div>
                  <div className="font-medium text-foreground text-sm">
                    To: recruitment@techcorp.com
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Subject: Senior Frontend Engineer
                  </div>
                </div>
              </div>
              <div className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                <p>Hi team,</p>
                <p>
                  I noticed your opening for the Senior Frontend Engineer role.
                  My background in React and Next.js aligns perfectly with your
                  requirements.
                </p>
                <p>
                  I recently led a migration that improved performance by 40%.
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <div className="px-5 py-2 rounded-lg bg-foreground text-background text-xs font-semibold shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                  Send
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
