"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericPart = target.replace(/[^0-9.]/g, "");
    const num = parseFloat(numericPart);
    const prefix = target.match(/^[^0-9]*/)?.[0] || "";
    const suffixPart = target.match(/[^0-9.]*$/)?.[0] || "";

    if (isNaN(num)) {
      setDisplay(target);
      return;
    }

    const duration = 1500;
    const startTime = Date.now();
    const isFloat = target.includes(".");

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;

      if (isFloat) {
        setDisplay(`${prefix}${current.toFixed(1)}${suffixPart}`);
      } else {
        setDisplay(`${prefix}${Math.round(current)}${suffixPart}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-4xl md:text-6xl font-bold tracking-tighter">
      {display}{suffix}
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    { value: "93%", label: "ATS Pass Rate" },
    { value: "2.4x", label: "More Interviews" },
    { value: "10k+", label: "Users Hired" },
    { value: "< 30s", label: "Analysis Time" },
  ];

  return (
    <section className="py-20 md:py-24 relative z-10 overflow-hidden bg-foreground text-background">
      {/* Subtle glow mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-background/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-background/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter target={s.value} />
              <div className="text-xs md:text-sm font-medium text-background/50 uppercase tracking-widest mt-3">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
