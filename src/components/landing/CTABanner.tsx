"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-20 md:py-24 relative z-10 overflow-hidden bg-background">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border border-border bg-card px-10 py-16 text-center shadow-lg sm:p-20"
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Ready to Transform Your
              <br className="hidden sm:block" /> Job Search?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of professionals optimizing their careers with
              JobFlow AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-bold text-base hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
