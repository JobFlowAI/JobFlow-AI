"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Crown, Calendar, ArrowUpRight, User, Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const usageHistory = [
  { action: "Resume Parse", credits: -2, date: "Mar 24, 2026", time: "2:30 PM" },
  { action: "ATS Analysis", credits: -2, date: "Mar 24, 2026", time: "2:31 PM" },
  { action: "Email Sent — Stripe", credits: -1, date: "Mar 23, 2026", time: "11:15 AM" },
  { action: "Resume Parse", credits: -2, date: "Mar 22, 2026", time: "4:00 PM" },
  { action: "ATS Analysis", credits: -2, date: "Mar 22, 2026", time: "4:02 PM" },
  { action: "Email Sent — Vercel", credits: -1, date: "Mar 21, 2026", time: "9:45 AM" },
  { action: "Job Match Analysis", credits: -3, date: "Mar 20, 2026", time: "3:20 PM" },
  { action: "Email Sent — Linear", credits: -1, date: "Mar 19, 2026", time: "10:00 AM" },
];

export default function SettingsPage() {
  const [name, setName] = useState("Shahroz Imran");
  const [email, setEmail] = useState("shahroz@jobflow.ai");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings & Billing</h1>
        <p className="text-muted-foreground">Manage your account details and subscription preferences.</p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-border bg-card shadow-sm rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
          <User className="w-5 h-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
        </div>
        
        <div className="grid gap-6 max-w-2xl">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="flex justify-start pt-4 border-t border-border/50 mt-2">
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="gap-2 px-6"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-border bg-card shadow-sm rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-semibold text-foreground">Pro Plan</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">200 credits/month • $10/month</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Next billing: Apr 15, 2026
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" /> •••• 4242
              </span>
            </div>
          </div>
          <Button
            onClick={() => toast.info("Upgrade flow coming soon! You'll be able to manage your subscription here.")}
            variant="default"
            className="flex items-center gap-2"
          >
            Upgrade <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Usage History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border border-border bg-card shadow-sm rounded-xl p-6"
      >
        <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border/50 pb-4">Usage History</h2>
        <div className="overflow-hidden rounded-xl border border-border mt-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Time</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Credits</th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.map((entry, i) => (
                <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{entry.action}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{entry.date}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{entry.time}</td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{entry.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
