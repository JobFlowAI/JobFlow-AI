"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Sync & Analyze",
      description: "Upload your existing PDF or connect your LinkedIn profile. Our models instantly extract, categorize, and clean your data footprint."
    },
    {
      number: "02",
      title: "Contextual Enhancement",
      description: "We rewrite bullet points to highlight metrics and adapt formatting to ensure deep compatibility with major ATS platforms (Workday, Greenhouse, etc)."
    },
    {
      number: "03",
      title: "Export & Execute",
      description: "Download a pixel-perfect, typography-optimized resume PDF. Then, use the outreach hub to contact recruiters seamlessly."
    }
  ];

  return (
    <section className="py-20 bg-secondary/20 relative z-10 border-y border-border/40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Simplicity at scale.
          </h2>
          <p className="text-lg text-muted-foreground">
            A linear progression designed to reduce cognitive load while maximizing output quality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[44px] left-10 right-10 h-px bg-border/80 z-0" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-[2rem] bg-card border-2 border-background flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all mb-8">
                <span className="text-3xl font-bold tracking-tighter text-foreground font-sans">
                  {step.number}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
