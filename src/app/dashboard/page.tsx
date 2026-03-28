"use client";

import { motion } from "framer-motion";
import { FileText, Briefcase, TrendingUp, Zap, ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const recentMatches = [
  { title: "Senior Frontend Engineer", company: "Stripe", score: 92, status: "matched" },
  { title: "Full Stack Developer", company: "Vercel", score: 85, status: "matched" },
  { title: "React Developer", company: "Linear", score: 78, status: "analyzing" },
  { title: "Software Engineer II", company: "Notion", score: 88, status: "matched" },
];

const creditBreakdown = [
  { label: "Resume Parsing", cost: 2, used: 12, icon: FileText },
  { label: "ATS Analysis", cost: 2, used: 18, icon: TrendingUp },
  { label: "Email Outreach", cost: 1, used: 7, icon: Zap },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 md:p-8 overflow-hidden">
      {/* Subtle Mesh Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30 -z-10 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, John</h1>
          <p className="text-muted-foreground text-lg tracking-tight">Here's what's happening with your job search today.</p>
        </motion.div>

        {/* Credit Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-background/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-3xl p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Credit Overview</h2>
            <button className="text-sm font-medium text-primary hover:underline underline-offset-4">View History</button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
             {/* Progress Ring */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 filter drop-shadow-sm">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                  strokeDasharray={`${(145 / 200) * 264} 264`}
                  strokeLinecap="round"
                  className="drop-shadow-sm transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold tracking-tighter text-foreground">145</span>
                <span className="text-xs font-medium text-muted-foreground">/ 200</span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              {creditBreakdown.map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-secondary/30 border border-border/40 flex flex-col items-start transition-colors hover:bg-secondary/50">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-background shadow-sm flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold tracking-tight text-foreground">{item.used}</p>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-xs text-muted-foreground/70">{item.cost} credits / action</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => router.push("/dashboard/resume-workspace")}
            className="group relative overflow-hidden bg-background/60 backdrop-blur-xl border border-border/50 shadow-sm hover:shadow-md rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
              <ChevronRight className="w-6 h-6 text-primary" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 shadow-sm border border-primary/20">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Resume Optimization</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm">
              Upload your resume and let our AI tailor it for ATS tracking immediately.
            </p>
            <span className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
              Get Started <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={() => router.push("/dashboard/outreach")}
            className="group relative overflow-hidden bg-background/60 backdrop-blur-xl border border-border/50 shadow-sm hover:shadow-md rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
              <ChevronRight className="w-6 h-6 text-success" />
            </div>
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-6 shadow-sm border border-success/20">
              <Briefcase className="w-7 h-7 text-success" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Automated Outreach</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed max-w-sm">
              Find perfectly matched roles and send personalized connection emails in bulk.
            </p>
            <span className="inline-flex items-center gap-2 text-sm text-success font-semibold">
              Discover Jobs <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>
        </div>

        {/* Recent Matches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background/60 backdrop-blur-xl border border-border/50 shadow-sm rounded-3xl p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Recent Matches</h2>
            <button className="text-sm font-medium text-primary hover:underline underline-offset-4">View All</button>
          </div>
          <div className="space-y-0 divide-y divide-border/40 -mx-4">
            {recentMatches.map((match) => (
              <div
                key={match.title}
                className="flex items-center justify-between px-4 py-4 hover:bg-secondary/30 transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">{match.title}</p>
                  <p className="text-sm text-muted-foreground">{match.company}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    match.status === "matched"
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-gold/10 text-gold border border-gold/20"
                  }`}>
                    {match.score}% fit
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
