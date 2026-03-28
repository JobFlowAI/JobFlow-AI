import { motion } from "framer-motion";

export default function LogoCloud() {
  const logos = ["Stripe", "Vercel", "Linear", "Notion", "Figma", "OpenAI"];

  return (
    <section className="py-16 border-y border-border/40 bg-card/30 backdrop-blur-sm relative z-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-muted-foreground mb-8 tracking-widest uppercase">
          Trusted by professionals from
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 p-4">
          <div className="text-2xl font-black tracking-tighter uppercase">Stripe</div>
          <div className="text-2xl font-bold tracking-tight">▲ Vercel</div>
          <div className="text-2xl font-bold tracking-tight flex items-center gap-1">
             <div className="w-4 h-4 bg-foreground rounded-sm" /> Square
          </div>
          <div className="text-2xl font-serif italic font-bold tracking-tight">Notion</div>
          <div className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">OpenAI</div>
        </div>
      </div>
    </section>
  );
}
