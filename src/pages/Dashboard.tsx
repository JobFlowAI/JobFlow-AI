import { motion } from "framer-motion";
import { FileText, Briefcase, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, John</h1>
        <p className="text-muted-foreground">Here's what's happening with your job search.</p>
      </div>

      {/* Credit Widget */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-elevated p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Credit Usage</h2>
        <div className="flex items-center gap-8 mb-6">
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--primary))" strokeWidth="8"
                strokeDasharray={`${(145 / 200) * 264} 264`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-foreground">145</span>
              <span className="text-xs text-muted-foreground">of 200</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            {creditBreakdown.map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-secondary">
                <item.icon className="w-4 h-4 text-primary mb-1" />
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold text-foreground">{item.used} used</p>
                <p className="text-xs text-muted-foreground">{item.cost} credits each</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/resume-workspace")}
          className="card-elevated card-hover p-6 text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Optimize Resume</h3>
          <p className="text-sm text-muted-foreground mb-4">Upload and enhance your resume with AI-powered ATS optimization.</p>
          <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
            Start Now <ArrowRight className="w-4 h-4" />
          </span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate("/outreach")}
          className="card-elevated card-hover p-6 text-left group"
        >
          <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-success" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Find Job Matches</h3>
          <p className="text-sm text-muted-foreground mb-4">Discover roles that match your skills and send personalized outreach.</p>
          <span className="inline-flex items-center gap-1 text-sm text-success font-medium group-hover:gap-2 transition-all">
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </span>
        </motion.button>
      </div>

      {/* Recent Matches */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Matches</h2>
        <div className="space-y-3">
          {recentMatches.map((match) => (
            <div
              key={match.title}
              className="flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
            >
              <div>
                <p className="font-medium text-foreground">{match.title}</p>
                <p className="text-sm text-muted-foreground">{match.company}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  match.status === "matched"
                    ? "bg-success/10 text-success"
                    : "bg-gold/10 text-gold"
                }`}>
                  {match.score}% fit
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
