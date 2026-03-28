"use client";

import { motion } from "framer-motion";

export default function StatsSection() {
  const stats = [
    { value: "93%", label: "ATS Pass Rate" },
    { value: "2.4x", label: "More Interviews" },
    { value: "10k+", label: "Users Hired" },
    { value: "< 30s", label: "Analysis Time" },
  ];

  return (
    <section className="py-24 bg-foreground relative z-10 text-background overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-background/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4 text-background">
                {s.value}
              </div>
              <div className="text-sm md:text-base font-medium text-background/60 uppercase tracking-widest">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
