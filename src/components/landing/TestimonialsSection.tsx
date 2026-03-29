"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "JobFlow AI completely changed my approach. Within two weeks of optimizing my resume, I had final round interviews at two FAANG companies.",
      author: "Sarah Jenkins",
      title: "Senior Product Designer",
      company: "Figma",
      stars: 5,
    },
    {
      quote:
        "The ATS scoring is terrifyingly accurate. I realized why my old resume wasn't passing automated filters. The rewritten bullet points were metric-driven.",
      author: "Michael Chen",
      title: "Software Engineer",
      company: "Stripe",
      stars: 5,
    },
    {
      quote:
        "I've tried numerous resume builders but none come close to the quality here. It feels like an Apple product for job searching. Absolutely premium.",
      author: "Elena Rodriguez",
      title: "Marketing Director",
      company: "Notion",
      stars: 5,
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-background relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
            Don&apos;t just take our word for it.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            Hear from professionals who transformed their job search.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((test, i) => (
            <motion.div
              key={test.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-border bg-card p-7 flex flex-col justify-between hover:border-foreground/20 hover:shadow-lg shadow-sm transition-all duration-300 group"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-muted-foreground/10">
                <Quote className="w-10 h-10" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: test.stars }).map((_, si) => (
                  <Star
                    key={si}
                    className="w-4 h-4 text-gold fill-gold"
                  />
                ))}
              </div>

              <p className="text-foreground leading-relaxed mb-8 text-[15px]">
                &ldquo;{test.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center font-bold text-background text-sm">
                  {test.author[0]}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {test.author}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {test.title} @ {test.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
