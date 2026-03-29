"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  Crown,
  Calendar,
  ArrowUpRight,
  User,
  Mail,
  Save,
  Shield,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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

const tabs = [
  { id: "general", label: "General", icon: User },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "security" ? "security" : "general";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Security state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.full_name || "");
        setEmail(user.email || "");
      }
    }
    loadUser();
  }, [supabase.auth]);

  // Sync tab with URL params
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "security") setActiveTab("security");
  }, [searchParams]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });
    setIsSaving(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Profile updated successfully!");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    setIsUpdatingPassword(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm.');
      return;
    }

    toast.error("Account deletion requires admin action. Please contact support@jobflow.ai");
    setShowDeleteConfirm(false);
    setDeleteConfirmText("");
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security, and subscription.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ──── General Tab ──── */}
      {activeTab === "general" && (
        <motion.div
          key="general"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Settings */}
          <div className="border border-border/40 bg-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
              <User className="w-5 h-5 text-foreground" />
              <h2 className="text-base font-semibold text-foreground">Profile Settings</h2>
            </div>

            <div className="grid gap-5 max-w-lg">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-muted/30"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="pl-10 bg-muted/30 opacity-60"
                    placeholder="Email"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
              </div>

              <div className="flex justify-start pt-3 border-t border-border/30 mt-1">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="gap-2 px-6 rounded-xl"
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
          </div>

          {/* Current Plan */}
          <div className="border border-border/40 bg-card rounded-xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-foreground" />
                  <h2 className="text-base font-semibold text-foreground">Pro Plan</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-3">200 credits/month • $10/month</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Next billing: Apr 15, 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" /> •••• 4242
                  </span>
                </div>
              </div>
              <Button
                onClick={() => toast.info("Upgrade flow coming soon!")}
                variant="default"
                className="flex items-center gap-2 rounded-xl"
              >
                Upgrade <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Usage History */}
          <div className="border border-border/40 bg-card rounded-xl p-6">
            <h2 className="text-base font-semibold text-foreground mb-4 border-b border-border/30 pb-4">
              Usage History
            </h2>
            <div className="overflow-hidden rounded-lg border border-border/30">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Action</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Date</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden sm:table-cell">Time</th>
                    <th className="text-right px-4 py-2.5 font-medium text-muted-foreground text-xs">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {usageHistory.map((entry, i) => (
                    <tr key={i} className="border-t border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 text-foreground text-sm">{entry.action}</td>
                      <td className="px-4 py-2.5 text-muted-foreground text-sm hidden sm:table-cell">{entry.date}</td>
                      <td className="px-4 py-2.5 text-muted-foreground text-sm hidden sm:table-cell">{entry.time}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-foreground text-sm">{entry.credits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ──── Security Tab ──── */}
      {activeTab === "security" && (
        <motion.div
          key="security"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Update Password */}
          <div className="border border-border/40 bg-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-border/30 pb-4">
              <Lock className="w-5 h-5 text-foreground" />
              <h2 className="text-base font-semibold text-foreground">Update Password</h2>
            </div>

            <div className="grid gap-5 max-w-lg">
              <div className="grid gap-2">
                <Label htmlFor="new-password" className="text-xs font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted/30"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">Minimum 6 characters.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-xs font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-muted/30"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-[11px] text-destructive">Passwords do not match.</p>
                )}
              </div>

              <div className="flex justify-start pt-3 border-t border-border/30 mt-1">
                <Button
                  onClick={handleUpdatePassword}
                  disabled={isUpdatingPassword || !newPassword || newPassword !== confirmPassword}
                  className="gap-2 px-6 rounded-xl"
                >
                  {isUpdatingPassword ? (
                    <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {isUpdatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </div>

          {/* Delete Account */}
          <div className="border border-destructive/20 bg-destructive/5 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h2 className="text-base font-semibold text-destructive">Danger Zone</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. All your data, resumes, and credits will be permanently removed.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive rounded-xl"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3"
              >
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium mb-3">
                    Type <span className="font-bold">DELETE</span> to confirm account deletion:
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE"
                    className="bg-background border-destructive/30 max-w-xs"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirmText !== "DELETE"}
                    className="gap-2 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                    Permanently Delete
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
