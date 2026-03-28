"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Target,
  TrendingUp,
  User,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Zap,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile, getProfileCompleteness } from "@/lib/profile-store";
import { getResumes, getResumeStats } from "@/lib/resume-store";
import type { GeneratedResume } from "@/lib/resume-store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Sample chart data
const weeklyData = [
  { day: "Mon", resumes: 2 },
  { day: "Tue", resumes: 1 },
  { day: "Wed", resumes: 3 },
  { day: "Thu", resumes: 0 },
  { day: "Fri", resumes: 4 },
  { day: "Sat", resumes: 2 },
  { day: "Sun", resumes: 1 },
];

const scoreDistribution = [
  { range: "60-69", count: 1 },
  { range: "70-79", count: 3 },
  { range: "80-89", count: 5 },
  { range: "90-100", count: 4 },
];

export default function Dashboard() {
  const [profile, setProfile] = useState({ firstName: "", lastName: "" });
  const [completeness, setCompleteness] = useState(0);
  const [resumes, setResumes] = useState<GeneratedResume[]>([]);
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgAtsScore: 0,
    atsResumes: 0,
    creativeResumes: 0,
    activeResumes: 0,
    completedResumes: 0,
  });

  useEffect(() => {
    const p = getProfile();
    setProfile({ firstName: p.firstName, lastName: p.lastName });
    setCompleteness(getProfileCompleteness());
    setResumes(getResumes());
    setStats(getResumeStats());
  }, []);

  const statCards = [
    {
      label: "Total Resumes",
      value: stats.totalResumes.toString(),
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Avg ATS Score",
      value: stats.avgAtsScore > 0 ? `${stats.avgAtsScore}%` : "—",
      icon: Target,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Active Resumes",
      value: stats.activeResumes.toString(),
      icon: TrendingUp,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      label: "Profile Complete",
      value: `${completeness}%`,
      icon: User,
      color: "text-gold",
      bg: "bg-gold/10",
    },
  ];

  const recentResumes = resumes.slice(0, 5);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {profile.firstName
              ? `Welcome back, ${profile.firstName}`
              : "Welcome to JobFlow AI"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s an overview of your resume activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/profile">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/50"
            >
              <User className="w-4 h-4" /> Update Profile
            </Button>
          </Link>
          <Link href="/dashboard/resume-workspace">
            <Button className="gap-2 rounded-xl shadow-sm">
              <Plus className="w-4 h-4" /> Create Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile completeness banner */}
      {completeness < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Complete your profile to generate better resumes
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your profile is {completeness}% complete
              </p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button size="sm" variant="outline" className="rounded-lg gap-1.5 text-xs">
              Complete Profile <ArrowUpRight className="w-3 h-3" />
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/40 bg-card p-5 hover:border-border/60 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div
                className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Activity Chart */}
        <div className="rounded-xl border border-border/40 bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Resume Activity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                This week
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-success font-medium">+12%</span>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="resumes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ATS Score Distribution */}
        <div className="rounded-xl border border-border/40 bg-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                ATS Score Distribution
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Across all resumes
              </p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Resumes Table */}
      <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
          <h3 className="text-sm font-semibold text-foreground">
            Recent Resumes
          </h3>
          <Link
            href="/dashboard/resume-workspace"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {recentResumes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground bg-muted/20 border-b border-border/30">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">
                    Target Role
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Type</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">
                    ATS Score
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Created</th>
                  <th className="px-5 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {recentResumes.map((resume) => (
                  <tr
                    key={resume.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {resume.targetRole}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {resume.company}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          resume.optimizationType === "ats"
                            ? "text-success"
                            : "text-primary"
                        }`}
                      >
                        {resume.optimizationType === "ats" ? (
                          <>
                            <FileText className="w-3 h-3" /> ATS
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3" /> Visual
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                          resume.status === "active"
                            ? "bg-primary/10 text-primary"
                            : resume.status === "complete"
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            resume.status === "active"
                              ? "bg-primary"
                              : resume.status === "complete"
                              ? "bg-success"
                              : "bg-muted-foreground"
                          }`}
                        />
                        {resume.status.charAt(0).toUpperCase() +
                          resume.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-sm font-medium text-foreground">
                      {resume.atsScore ? `${resume.atsScore}%` : "—"}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-muted-foreground/40" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              No resumes yet
            </h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm">
              Create your first AI-optimized resume by pasting a job description
              and letting our engine do the work.
            </p>
            <Link href="/dashboard/resume-workspace">
              <Button className="gap-2 rounded-xl shadow-sm">
                <Plus className="w-4 h-4" /> Create Your First Resume
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
