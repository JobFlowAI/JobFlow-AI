"use client";

import { motion } from "framer-motion";

const logos = [
  { name: "Stripe", style: "font-black tracking-tighter uppercase" },
  { name: "▲ Vercel", style: "font-bold tracking-tight" },
  { name: "Linear", style: "font-bold tracking-tight" },
  { name: "Notion", style: "font-serif italic font-bold tracking-tight" },
  { name: "Figma", style: "font-bold tracking-tight" },
  { name: "OpenAI", style: "font-bold tracking-tighter" },
];

function LogoRow() {
  return (
    <>
      {logos.map((logo) => (
        <div
          key={logo.name}
          className={`text-xl md:text-2xl text-foreground/40 select-none whitespace-nowrap ${logo.style}`}
        >
          {logo.name}
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
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/20 to-transparent z-10 pointer-events-none" />

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
