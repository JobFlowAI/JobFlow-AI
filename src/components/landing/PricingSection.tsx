"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      desc: "Essentials for early-stage job hunters.",
      price: "$0",
      featured: false,
      features: [
        "1 AI Resume Optimization",
        "Basic ATS Formatting Check",
        "PDF Export",
      ],
      cta: "Get Started Free"
    },
    {
      name: "Plus",
      desc: "Perfect for active job seekers.",
      price: "$10",
      period: "/mo",
      featured: false,
      features: [
        "10 Auto-Optimizations",
        "Advanced ATS Score Checking",
        "Standard Outreach Templates",
        "Basic Cover Letter Generation",
      ],
      cta: "Start Plus Plan"
    },
    {
      name: "Pro",
      desc: "For serious professionals seeking edge.",
      price: "$29",
      period: "/mo",
      featured: true,
      features: [
        "Unlimited Auto-Optimizations",
        "Unlimited ATS Score Checking",
        "Personalized Outreach Engine",
        "Advanced Cover Letter Generation",
        "Priority Support",
      ],
      cta: "Start Pro Trial"
    }
  ];

  return (
    <section id="pricing" className="py-32 relative z-10 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Transparent pricing.
          </h2>
          <p className="text-lg text-muted-foreground">
            Invest in your career with a plan that fits your current trajectory. 
            No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card p-10 flex flex-col h-full ${
                plan.featured 
                  ? "border-foreground/30 shadow-2xl md:scale-105 z-10 bg-secondary/20" 
                  : "bg-background/50 hover:border-foreground/20"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="px-3 py-1 rounded-full bg-foreground text-background text-xs font-bold tracking-widest uppercase shadow-md">
                    Recommended
                  </span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground h-10">{plan.desc}</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold tracking-tighter text-foreground">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground font-medium">{plan.period}</span>
                  )}
                </div>
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex gap-3">
                    <Check className="w-5 h-5 text-foreground shrink-0" />
                    <span className="text-muted-foreground text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  plan.featured
                    ? "bg-foreground text-background hover:bg-foreground/90 shadow-lg"
                    : "bg-secondary text-foreground hover:bg-secondary/80 border border-border/50"
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
