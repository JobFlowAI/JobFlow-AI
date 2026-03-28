"use client";

import { motion } from "framer-motion";
import { Brain, Target, Mail, BarChart3, Shield, Zap, FileText, Users, TrendingUp, Sparkles } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { useRouter } from "next/navigation";


const features = [
  {
    icon: Brain,
    title: "AI-Powered Resume Optimization",
    description: "Our advanced NLP engine analyzes your resume against job descriptions. Identify missing keywords, weak phrases, and formatting issues that cause ATS rejections. Get actionable suggestions that boost your pass rate to 93%.",
    color: "text-foreground",
    bg: "bg-foreground/10",
  },
  {
    icon: Target,
    title: "Smart Job Matching",
    description: "Stop scrolling through thousands of irrelevant listings. Our matching algorithm compares your skills, experience, and preferences against open roles to surface only the jobs where you're a strong fit — ranked by compatibility score.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Mail,
    title: "Personalized Outreach Engine",
    description: "Generate tailored emails to hiring managers that reference specific job requirements and your relevant experience. Each email is unique, professional, and designed to land in inboxes — not spam folders.",
    color: "text-foreground",
    bg: "bg-foreground/10",
  },
  {
    icon: BarChart3,
    title: "ATS Fit Score Analysis",
    description: "See exactly how your resume stacks up against any job posting with our real-time fit score. Get a detailed breakdown of keyword matches, skills gaps, and formatting compliance before you hit apply.",
    color: "text-gold",
    bg: "bg-gold/10",
  },
  {
    icon: FileText,
    title: "Resume Version Management",
    description: "Maintain multiple tailored versions of your resume for different roles and industries. Track changes, compare versions, and always send the most optimized version for each application.",
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    icon: Shield,
    title: "Privacy-First Architecture",
    description: "Your resume data and personal information are encrypted at rest and in transit. We never share your data with employers or third parties without your explicit consent. Full GDPR and CCPA compliance.",
    color: "text-foreground",
    bg: "bg-foreground/10",
  },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Active Users" },
  { icon: TrendingUp, value: "93%", label: "ATS Pass Rate" },
  { icon: Sparkles, value: "2.4x", label: "More Interviews" },
  { icon: Zap, value: "< 30s", label: "Analysis Time" },
];

export default function FeaturesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-foreground/5 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/10 text-foreground text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Platform Features
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Everything You Need to <span className="text-foreground">Land Your Dream Job</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From resume optimization to personalized outreach, JobFlow AI provides a complete toolkit
              that transforms your job search from months of frustration into weeks of interviews.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 text-foreground mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated card-hover p-7"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of professionals who've already doubled their interview rate with JobFlow AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/dashboard")}
                className="px-8 py-4 rounded-xl bg-foreground text-background font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Start Free — 20 Credits
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/#pricing")}
                className="px-8 py-4 rounded-xl bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-secondary/80 transition-colors"
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
