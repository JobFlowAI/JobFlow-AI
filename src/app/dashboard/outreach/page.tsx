"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, X, Briefcase, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const jobMatches = [
  { id: 1, title: "Senior Frontend Engineer", company: "Stripe", location: "San Francisco, CA", score: 92, posted: "2 days ago", salary: "$180k–$220k" },
  { id: 2, title: "Full Stack Developer", company: "Vercel", location: "Remote", score: 85, posted: "3 days ago", salary: "$150k–$190k" },
  { id: 3, title: "React Developer", company: "Linear", location: "New York, NY", score: 78, posted: "1 day ago", salary: "$140k–$175k" },
  { id: 4, title: "Software Engineer II", company: "Notion", location: "San Francisco, CA", score: 88, posted: "5 days ago", salary: "$160k–$200k" },
  { id: 5, title: "Frontend Architect", company: "Figma", location: "Remote", score: 81, posted: "1 week ago", salary: "$190k–$240k" },
];

export default function Outreach() {
  const [emailModal, setEmailModal] = useState<typeof jobMatches[0] | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Outreach Hub</h1>
        <p className="text-muted-foreground">Your matched jobs and one-click personalized outreach.</p>
      </div>

      <div className="space-y-3">
        {jobMatches.map((job, i) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card-elevated p-5 flex items-center justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  job.score >= 85 ? "bg-success/10 text-success" : "bg-gold/10 text-gold"
                }`}>
                  {job.score}% fit
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.company}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.posted}</span>
                <span className="font-medium text-foreground">{job.salary}</span>
              </div>
            </div>
            <button
              onClick={() => setEmailModal(job)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <Mail className="w-4 h-4" /> Send Email
            </button>
          </motion.div>
        ))}
      </div>

      {/* Glass Email Modal */}
      <AnimatePresence>
        {emailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setEmailModal(null)}
          >
            <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card relative w-full max-w-lg p-6 z-10"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)" }}
            >
              <button
                onClick={() => setEmailModal(null)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
              <h3 className="text-lg font-bold text-foreground mb-1">Email Preview</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Personalized outreach to {emailModal.company} — 1 credit
              </p>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <p className="text-sm text-foreground">recruiting@{emailModal.company.toLowerCase()}.com</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subject</label>
                  <p className="text-sm text-foreground">Application: {emailModal.title} — Experienced React Developer</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Body</label>
                  <div className="mt-1 p-4 rounded-xl bg-secondary text-sm text-foreground leading-relaxed">
                    <p className="mb-3">Dear Hiring Team at {emailModal.company},</p>
                    <p className="mb-3">
                      I'm writing to express my strong interest in the {emailModal.title} position.
                      With over 5 years of experience building production React applications, I believe
                      my skills in TypeScript, performance optimization, and component architecture
                      align perfectly with this role.
                    </p>
                    <p className="mb-3">
                      At my current company, I led the migration of a legacy frontend to React,
                      resulting in a 40% improvement in load times and a 25% increase in user engagement.
                    </p>
                    <p>I'd love to discuss how I can contribute to your team. Looking forward to hearing from you.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEmailModal(null)}
                  className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    toast.success(`Email sent to ${emailModal.company}! 1 credit used.`);
                    setEmailModal(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
