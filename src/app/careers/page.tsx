"use client";

import { motion } from "framer-motion";
import { Briefcase, Rocket, Heart, Brain, ArrowRight } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";

const perks = [
  { icon: Rocket, title: "Impactful Work", description: "Build AI tools that directly help thousands of job seekers land their dream roles." },
  { icon: Heart, title: "Human-Centric AI", description: "Be part of a team that prioritizes ethics and transparency in machine learning." },
  { icon: Brain, title: "Innovation First", description: "Experiment with the latest LLMs and agentic workflows in a fast-paced environment." },
  { icon: Briefcase, title: "Remote-First", description: "Work from anywhere in the world with a flexible schedule that fits your life." },
];

// No positions available at the moment
const positions: { title: string; department: string; type: string }[] = [];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      
      <main>
        {/* Hero */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />
          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                Build the Future of <span className="text-foreground">Recruiting</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Join a mission-driven team dedicated to making the hiring process fairer, faster, and more human through Artificial Intelligence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Perks */}
        <section className="py-20 bg-card">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Join Us?</h2>
              <p className="text-muted-foreground">We're building more than just a tool; we're building a movement.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {perks.map((perk, i) => (
                <motion.div
                  key={perk.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-elevated p-6 text-center"
                >
                  <perk.icon className="w-10 h-10 text-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground">{perk.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-foreground mb-10">Open Positions</h2>
            <div className="space-y-4">
              {positions.length > 0 ? (
                positions.map((pos, i) => (
                  <motion.div
                    key={pos.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors group cursor-pointer"
                  >
                    <div>
                      <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-foreground transition-colors">{pos.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{pos.department}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{pos.type}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2 text-foreground font-semibold text-sm">
                      View Details <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center justify-center py-16 px-6 rounded-3xl border border-dashed border-border bg-card/30 backdrop-blur-sm text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6">
                    <Briefcase className="w-10 h-10 text-foreground/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No Open Positions</h3>
                  <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
                    We're currently operating at full capacity, but we're always looking for exceptional talent to join our future growth.
                  </p>
                  <a 
                    href="mailto:aifunk63@gmail.com"
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    Apply Spontaneously <ArrowRight className="w-4 h-4" />
                  </a>
                </motion.div>
              )}
            </div>
            <p className="mt-12 text-center text-muted-foreground text-sm">
              Don't see a role that fits? Send your resume to <a href="mailto:aifunk63@gmail.com" className="text-foreground hover:underline">aifunk63@gmail.com</a> and tell us how you can help!
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
