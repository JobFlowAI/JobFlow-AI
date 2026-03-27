import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    credits: "20 credits/month",
    features: ["Resume Parsing (2 credits)", "Basic ATS Analysis (2 credits)", "1 Email Send (1 credit)", "Community Support"],
    variant: "default" as const,
  },
  {
    name: "Pro",
    price: "$10",
    period: "/month",
    credits: "200 credits/month",
    features: ["Everything in Free", "Advanced AI Suggestions", "Job Matching Engine", "Priority Support", "Resume Version History"],
    variant: "featured" as const,
  },
  {
    name: "Premium",
    price: "$25",
    period: "/month",
    credits: "600 credits/month",
    features: ["Everything in Pro", "Unlimited AI Rewrites", "Bulk Outreach Campaigns", "Analytics Dashboard", "Dedicated Account Manager"],
    variant: "premium" as const,
  },
];

export default function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20" id="pricing">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free. Scale when you're ready. Every credit counts.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-2xl p-8 relative ${
                plan.variant === "featured"
                  ? "card-elevated border-2 border-primary shadow-lg scale-105"
                  : plan.variant === "premium"
                  ? "gradient-premium text-sidebar-foreground"
                  : "card-elevated"
              }`}
            >
              {plan.variant === "featured" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}
              {plan.variant === "premium" && (
                <Crown className="w-6 h-6 text-gold mb-2" />
              )}
              <h3 className={`text-xl font-bold mb-1 ${plan.variant === "premium" ? "text-sidebar-foreground" : "text-foreground"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-4xl font-extrabold ${plan.variant === "premium" ? "text-gold" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.variant === "premium" ? "text-sidebar-muted" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm font-medium mb-6 ${plan.variant === "premium" ? "text-gold" : "text-primary"}`}>
                {plan.credits}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      plan.variant === "premium" ? "text-gold" : "text-success"
                    }`} />
                    <span className={`text-sm ${plan.variant === "premium" ? "text-sidebar-foreground" : "text-muted-foreground"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  if (plan.price === "$0") {
                    navigate("/dashboard");
                  } else {
                    toast.success(`${plan.name} plan selected! Redirecting to dashboard...`);
                    navigate("/dashboard");
                  }
                }}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.variant === "featured"
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : plan.variant === "premium"
                    ? "bg-gold text-gold-foreground hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {plan.price === "$0" ? "Start Free" : "Subscribe"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
