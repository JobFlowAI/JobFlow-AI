"use client";

import { motion } from "framer-motion";

const partners = ["STRIPE", "▲ Vercel", "● SQUARE", "Notion", "OpenAI"];
const techStack = [
  "Next.js", 
  "Tailwind CSS", 
  "Framer Motion", 
  "React 18", 
  "TypeScript", 
  "Radix UI", 
  "Lucide React", 
  "TanStack Query", 
  "Zod"
];

export default function LogoCloud() {
  const allItems = [...partners, ...techStack];
  
  // Duplicate items for seamless loop
  const duplicatedItems = [...allItems, ...allItems, ...allItems];

  return (
    <section className="py-12 border-y border-border/40 bg-card/10 backdrop-blur-sm relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center mb-8">
        <p className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase">
          Powered by industry leaders & cutting-edge stack
        </p>
      </div>

      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          animate={{
            x: ["0%", "-33.33%"],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap gap-12 md:gap-24 items-center py-4"
        >
          {duplicatedItems.map((item, index) => (
            <span
              key={index}
              className="text-xl md:text-2xl font-bold text-muted-foreground/30 hover:text-foreground/80 transition-colors cursor-default whitespace-nowrap tracking-tight"
            >
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

