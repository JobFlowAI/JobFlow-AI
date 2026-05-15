"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  Zap,
  Gift,
  Mail,
} from "lucide-react";

const perks = [
  { icon: Gift, text: "Lifetime discount for early members" },
  { icon: Zap, text: "Priority access at launch" },
  { icon: Users, text: "Exclusive beta community" },
];

export default function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-background" id="waitlist">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-foreground/[0.03] blur-[120px] rounded-full" />
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-foreground/[0.02] blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-foreground/[0.02] blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-foreground/15 bg-foreground/5 text-xs font-semibold uppercase tracking-widest text-foreground/70 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-pulse" />
            Limited Early Access
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-5">
            Get hired faster.
            <br />
            <span className="text-muted-foreground">Starting day one.</span>
          </h2>

          {/* Sub-copy */}
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            JobFlow AI is rolling out to early members first. Drop your email
            and skip the line — plus unlock a lifetime discount that
            disappears at launch.
          </p>

          {/* Form */}
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-background" />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">You have successfully added to the waitlist!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ll notify you the moment early access opens. Keep an eye on your inbox.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === "loading"}
                    className="w-full h-14 pl-11 pr-4 rounded-2xl border border-border bg-card text-foreground placeholder:text-muted-foreground/50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading" || !email.trim()}
                  className="h-14 px-7 rounded-2xl bg-foreground text-background font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shrink-0 shadow-lg hover:shadow-xl hover:shadow-foreground/10"
                >
                  {status === "loading" ? (
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>
                      Join Waitlist <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error */}
          {status === "error" && (
            <p className="mt-3 text-sm text-destructive font-medium">{message}</p>
          )}

          {/* Perks row */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 text-foreground/60 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Social proof counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-3 px-5 py-3 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm"
          >
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              {["IT", "AM", "SK", "JR"].map((initials, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-foreground/10 border-2 border-background flex items-center justify-center text-[9px] font-bold text-foreground/70"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-foreground leading-tight">
                2,400+ already joined
              </p>
              <p className="text-[11px] text-muted-foreground">Don&apos;t miss your spot</p>
            </div>
            <Sparkles className="w-4 h-4 text-foreground/40 ml-1" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
