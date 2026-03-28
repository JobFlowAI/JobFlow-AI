"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="py-24 relative z-10 overflow-hidden bg-background">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2.5rem] bg-foreground text-background p-12 md:p-20 text-center overflow-hidden"
        >
          {/* subtle background glow inside the banner */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-background/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
              Ready to land your dream role?
            </h2>
            <p className="text-xl text-background/80 mb-10 font-medium">
              Join thousands of professionals optimizing their careers with JobFlow AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background text-foreground font-bold text-lg hover:scale-105 transition-transform shadow-lg">
                  Get Started Now <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
