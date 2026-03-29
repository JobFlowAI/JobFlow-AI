"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      desc: "Essentials for early-stage job hunters.",
      priceMonthly: 0,
      priceYearly: 0,
      featured: false,
      features: [
        "1 AI Resume Optimization",
        "Basic ATS Formatting Check",
        "PDF Export",
      ],
      cta: "Get Started Free",
    },
    {
      name: "Plus",
      desc: "Perfect for active job seekers.",
      priceMonthly: 10,
      priceYearly: 8,
      featured: false,
      features: [
        "10 Auto-Optimizations",
        "Advanced ATS Score Checking",
        "Standard Outreach Templates",
        "Basic Cover Letter Generation",
      ],
      cta: "Start Free Trial",
    },
    {
      name: "Pro",
      desc: "For serious professionals seeking edge.",
      priceMonthly: 29,
      priceYearly: 24,
      featured: true,
      features: [
        "Unlimited Auto-Optimizations",
        "Unlimited ATS Score Checking",
        "Personalized Outreach Engine",
        "Advanced Cover Letter Generation",
        "Priority Support",
      ],
      cta: "Subscribe to Pro",
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 relative z-10 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-5">
            Transparent pricing.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8">
            Invest in your career with a plan that fits. No hidden fees, cancel
            anytime.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-muted rounded-full p-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                !yearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                yearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs text-foreground font-bold">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 items-start max-w-5xl mx-auto">
          {plans.map((plan, i) => {
            const price = yearly ? plan.priceYearly : plan.priceMonthly;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 ${
                  plan.featured
                    ? "border-2 border-foreground bg-card shadow-md mt-0 md:-mt-4 mb-0 md:-mb-4"
                    : "border border-border bg-card hover:border-foreground/50 hover:shadow-sm"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-foreground text-background text-xs font-bold tracking-wide shadow-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1.5">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.desc}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground font-medium text-sm">
                        /mo
                      </span>
                    )}
                  </div>
                  {yearly && price > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Billed annually
                    </p>
                  )}
                </div>

                <div className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-foreground" />
                      </div>
                      <span className="text-sm text-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] ${
                    plan.featured
                      ? "bg-foreground text-background hover:bg-foreground/90 shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
