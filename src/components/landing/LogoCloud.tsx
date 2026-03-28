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

function LogoRow() {
  const allItems = [...partners, ...techStack];
  return (
    <>
      {allItems.map((name, idx) => (
        <div
          key={`${name}-${idx}`}
          className="text-xl md:text-2xl font-bold text-foreground/40 tracking-tight select-none whitespace-nowrap"
        >
          {name}
        </div>
      ))}
    </>
  );
}

export default function LogoCloud() {
  return (
    <section className="py-12 border-y border-border/30 bg-muted/20 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold text-muted-foreground mb-8 tracking-widest uppercase">
          Trusted by professionals from
        </p>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="flex gap-12 marquee" aria-hidden="true">
            <LogoRow />
            <LogoRow />
            <LogoRow />
            <LogoRow />
          </div>
        </div>
      </div>
    </section>
  );
}

