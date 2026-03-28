"use client";

import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "JobFlow AI completely changed my approach. Within two weeks of optimizing my resume and using the outreach sequences, I had final round interviews at two FAANG companies.",
      author: "Sarah Jenkins",
      title: "Senior Product Designer",
      company: "Figma"
    },
    {
      quote: "The ATS scoring is terrifyingly accurate. I realized why my old resume wasn't passing automated filters. The rewritten bullet points were punchy and metric-driven.",
      author: "Michael Chen",
      title: "Software Engineer",
      company: "Stripe"
    },
    {
      quote: "I've tried numerous resume builders but none come close to the typography and layout generation here. It feels like an Apple product for job searching.",
      author: "Elena Rodriguez",
      title: "Marketing Director",
      company: "Notion"
    }
  ];

  return (
    <section className="py-32 bg-background relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Don't just take our word for it.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((test, i) => (
            <motion.div
              key={test.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 flex flex-col justify-between hover:border-foreground/20 transition-colors"
            >
              <p className="text-lg font-medium text-foreground leading-relaxed mb-8">
                "{test.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center font-bold text-muted-foreground">
                  {test.author[0]}
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm tracking-tight">{test.author}</div>
                  <div className="text-sm text-muted-foreground">{test.title} @ {test.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
