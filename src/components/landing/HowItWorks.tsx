"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, Download } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Sync & Analyze",
      description:
        "Upload your existing PDF or connect your LinkedIn profile. Our models instantly extract, categorize, and clean your data.",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Enhancement",
      description:
        "We rewrite bullet points to highlight metrics and adapt formatting to ensure deep compatibility with major ATS platforms.",
    },
    {
      number: "03",
      icon: Download,
      title: "Export & Execute",
      description:
        "Download a pixel-perfect, typography-optimized resume PDF. Then, use the outreach hub to contact recruiters seamlessly.",
    },
  ];

  return (
    <section className="py-20 md:py-24 bg-muted/30 relative z-10 border-y border-border/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5">
            Simplicity at scale.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Three steps. No friction. Designed to reduce cognitive load while
            maximizing output quality.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-border z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              {/* Step circle */}
              <div className="relative mb-8">
                <div className="w-[104px] h-[104px] rounded-3xl bg-card border border-border/50 flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:border-primary/30 transition-all duration-300">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                {/* Step number badge */}
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-sm">
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
