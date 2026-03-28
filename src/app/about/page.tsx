"use client";

import { motion } from "framer-motion";
import { Heart, Target, Users, Globe, Linkedin, Twitter, ArrowRight } from "lucide-react";
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import { useRouter } from "next/navigation";
import Link from "next/link";


const team = [
  { 
    name: "Shahroz Imran", 
    role: "Founder & Lead Developer", 
    bio: "A BSAI student with a passion for leveraging Artificial Intelligence to solve real-world problems. Shahroz founded JobFlow AI to bridge the gap between talented job seekers and the rigid algorithms of modern hiring systems.", 
    avatar: "SI",
    linkedin: "https://www.linkedin.com/in/shahroz-imran-7403202a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
  { 
    name: "Zamad Shakeel", 
    role: "Lead Developer", 
    bio: "A dedicated software engineer focused on building scalable, high-performance systems. Zamad plays a key role in architecting the core AI engine and ensuring seamless integration across the JobFlow platform.", 
    avatar: "ZS",
    linkedin: "https://www.linkedin.com/in/zamad-gopang?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
  },
];

const values = [
  { icon: Heart, title: "User-First Design", description: "Every feature we build starts with a real pain point. We talk to job seekers weekly to ensure we're solving problems that actually matter." },
  { icon: Target, title: "Radical Transparency", description: "We show you exactly how credits are used, what our AI changes, and why. No black boxes, no hidden fees, no surprises." },
  { icon: Users, title: "Equal Opportunity", description: "We believe talent is universal but opportunity isn't. Our free tier ensures everyone can access basic ATS optimization regardless of budget." },
  { icon: Globe, title: "Continuous Innovation", description: "The hiring landscape evolves constantly. We update our AI models weekly to stay ahead of the latest ATS algorithms and recruiter preferences." },
];

const milestones = [
  { year: "2024", event: "Founded after seeing 75% of qualified resumes get auto-rejected" },
  { year: "2024", event: "Launched beta with 500 users — 2.1x interview rate improvement" },
  { year: "2025", event: "Reached 5,000 users; launched personalized outreach engine" },
  { year: "2025", event: "Raised $4.2M seed round; expanded to 10,000+ users" },
  { year: "2026", event: "Launched Premium tier with bulk outreach and analytics" },
];

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      <LandingNav />

      {/* Hero */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              We're on a Mission to <span className="text-foreground">Fix Hiring</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The hiring process is broken. ATS systems reject 75% of qualified candidates before a human ever sees their resume.
              We built JobFlow AI to give every job seeker a fair shot.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-card">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                JobFlow AI started as a passion project by Shahroz Imran, a BSAI student who witnessed the frustration of 
                talented peers being overlooked by automated hiring systems. He realized that the problem wasn't a lack of 
                skill, but a disconnect between how humans present their value and how machines read it.
              </p>
              <p>
                Combining his deep interest in Artificial Intelligence with a drive to make an impact, Shahroz built 
                the first version of JobFlow AI. His goal was simple: to create a tool that speaks the language of 
                ATS systems while preserving the human element of every professional's story.
              </p>
              <p>
                Today, JobFlow AI is a testament to the power of student-led innovation. It has helped countless 
                professionals optimize their resumes, match with relevant roles, and craft personalized outreach 
                that actually gets responses. Our mission remains the same: to ensure that your potential is 
                never silenced by a machine.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-10 text-center"
          >
            Our Journey
          </motion.h2>
          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-5 items-start"
                >
                  <div className="w-11 h-11 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0 relative z-10">
                    <span className="text-xs font-bold text-foreground">{m.year}</span>
                  </div>
                  <p className="text-muted-foreground pt-2.5">{m.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-foreground mb-10 text-center"
          >
            Our Values
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated p-7"
              >
                <v.icon className="w-8 h-8 text-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet the Team</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Driven by a vision to make hiring fairer and more human-centric through AI.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elevated card-hover p-8 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-foreground mx-auto mb-6 flex items-center justify-center text-background text-2xl font-bold shadow-lg shadow-foreground/20">
                  {person.avatar}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{person.name}</h3>
                <p className="text-sm text-foreground/80 font-semibold uppercase tracking-wider mb-4">{person.role}</p>
                <p className="text-muted-foreground leading-relaxed text-sm h-24 overflow-y-auto custom-scrollbar">
                  {person.bio}
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <a 
                    href={person.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-secondary/50 hover:bg-secondary hover:scale-110 transition-all duration-300"
                  >
                    <Linkedin className="w-5 h-5 text-foreground/70" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold text-foreground mb-4">Join the Movement</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Be part of a community that's changing how people find jobs. Start optimizing today — it's free.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-foreground text-background font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
