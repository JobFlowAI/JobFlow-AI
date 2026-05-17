"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  Sparkles,
  Briefcase,
  X,
  ChevronRight,
  Loader2,
  Globe,
  AlertCircle,
  FileText,
  DollarSign,
  Tag,
  CheckCircle2,
  Mail,
  Radar,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface JobListing {
  id: string;
  external_id: string;
  source: string;
  source_type?: string | null;
  source_domain?: string | null;
  canonical_url?: string | null;
  title: string;
  company: string;
  company_logo: string | null;
  location: string | null;
  employment_type: string | null;
  description: string;
  salary: string | null;
  tags: string[];
  apply_url: string | null;
  posted_at: string | null;
  closing_at?: string | null;
  fetched_at: string;
  hiring_email?: string | null;
  contact_email?: string | null;
  extraction_confidence?: number | null;
  posting_classification?: string | null;
}

interface ExtractedJob {
  title: string;
  company: string;
  location: string | null;
  employmentType: string | null;
  description: string;
  salary: string | null;
  requirements: string[];
  applyUrl: string | null;
}

/* ─── Source badge colors ─── */
const sourceConfig: Record<string, { label: string; color: string }> = {
  remotive: { label: "Remotive", color: "bg-emerald-500/10 text-emerald-600" },
  himalayas: { label: "Himalayas", color: "bg-violet-500/10 text-violet-600" },
  arbeitnow: { label: "Arbeitnow", color: "bg-amber-500/10 text-amber-600" },
  themuse: { label: "The Muse", color: "bg-pink-500/10 text-pink-600" },
  adzuna: { label: "Adzuna", color: "bg-cyan-500/10 text-cyan-600" },
  jsearch: { label: "JSearch", color: "bg-indigo-500/10 text-indigo-600" },
  scraped: { label: "Scraped", color: "bg-fuchsia-500/10 text-fuchsia-600" },
};

/* ─── Filter types ─── */
type WorkMode = "remote" | "hybrid" | "onsite";
type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance";
type ExperienceLevel = "entry" | "mid" | "senior" | "lead";
type DatePosted = "any" | "24h" | "week" | "month";

interface DiscoverFilters {
  work_modes: WorkMode[];
  job_types: JobType[];
  experience_levels: ExperienceLevel[];
  date_posted: DatePosted;
}

const WORK_MODE_OPTIONS: { value: WorkMode; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const JOB_TYPE_OPTIONS: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const EXP_LEVEL_OPTIONS: { value: ExperienceLevel; label: string }[] = [
  { value: "entry", label: "Entry" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Staff" },
];

const DATE_POSTED_OPTIONS: { value: DatePosted; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "24h", label: "Last 24h" },
  { value: "week", label: "Last week" },
  { value: "month", label: "Last month" },
];

const DEFAULT_FILTERS: DiscoverFilters = {
  work_modes: [],
  job_types: [],
  experience_levels: [],
  date_posted: "any",
};

/* ─── Confidence helpers ─── */
function confidenceBucket(score: number | null | undefined): { label: string; color: string } | null {
  if (score == null) return null;
  if (score >= 0.8) return { label: `${Math.round(score * 100)}% match`, color: "bg-emerald-500/10 text-emerald-600" };
  if (score >= 0.5) return { label: `${Math.round(score * 100)}% match`, color: "bg-amber-500/10 text-amber-600" };
  return { label: `${Math.round(score * 100)}% match`, color: "bg-rose-500/10 text-rose-600" };
}

function sourceTypeBadge(t: string | null | undefined): { label: string; color: string } | null {
  if (!t || t === "api") return null;
  if (t === "scraped") return { label: "Scraped", color: "bg-fuchsia-500/10 text-fuchsia-600" };
  if (t === "imported") return { label: "Imported", color: "bg-sky-500/10 text-sky-600" };
  return { label: t, color: "bg-muted text-muted-foreground" };
}

function gmailComposeUrl(email: string, title: string, company: string): string {
  const subject = `Application: ${title} at ${company}`.slice(0, 180);
  const body = `Hi,\n\nI'd like to be considered for the ${title} role at ${company}. My resume is attached.\n\nBest regards,`;
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: email,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

interface DiscoveryRun {
  id: string;
  query: string;
  country: string | null;
  status: "running" | "done" | "failed";
  total_found: number;
  total_kept: number;
  total_inserted: number;
  started_at: string;
  finished_at: string | null;
  error: string | null;
}

/* ─── Helpers ─── */
function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function FindJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"discover" | "import">("discover");
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  /* ─── Import State ─── */
  const [importUrl, setImportUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedJob, setExtractedJob] = useState<ExtractedJob | null>(null);

  /* ─── Discover State ─── */
  const [discoverQuery, setDiscoverQuery] = useState("");
  const [discoverCountry, setDiscoverCountry] = useState("");
  const [discoverMaxResults, setDiscoverMaxResults] = useState(20);
  const [discoverRun, setDiscoverRun] = useState<DiscoveryRun | null>(null);
  const [discoverJobs, setDiscoverJobs] = useState<JobListing[]>([]);
  const [isStartingDiscover, setIsStartingDiscover] = useState(false);
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const discoverPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ─── Extract job from URL ─── */
  const handleExtract = async () => {
    if (!importUrl.trim()) return;
    setIsExtracting(true);
    setExtractedJob(null);

    try {
      const res = await fetch("/api/jobs/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Extraction failed");
      }

      const data: ExtractedJob = await res.json();
      setExtractedJob(data);
      toast.success("Job details extracted successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to extract job data.";
      toast.error(message);
    } finally {
      setIsExtracting(false);
    }
  };

  /* ─── Discover: start a new run + poll status ─── */
  const stopDiscoverPolling = useCallback(() => {
    if (discoverPollRef.current) {
      clearInterval(discoverPollRef.current);
      discoverPollRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopDiscoverPolling();
  }, [stopDiscoverPolling]);

  const pollDiscover = useCallback(
    async (runId: string) => {
      try {
        const res = await fetch(`/api/jobs/discover/${runId}`);
        if (!res.ok) return;
        const data = (await res.json()) as { run: DiscoveryRun; jobs: JobListing[] };
        setDiscoverRun(data.run);
        setDiscoverJobs(data.jobs || []);
        if (data.run.status !== "running") {
          stopDiscoverPolling();
          if (data.run.status === "done") {
            toast.success(`Discovery complete: ${data.run.total_inserted} jobs saved.`);
          } else if (data.run.error) {
            toast.error(`Discovery failed: ${data.run.error}`);
          }
        }
      } catch {
        // Silently swallow — next poll will retry.
      }
    },
    [stopDiscoverPolling]
  );

  const startDiscover = async () => {
    const q = discoverQuery.trim();
    if (q.length < 2) {
      toast.error("Enter a role or keyword (min 2 characters).");
      return;
    }
    setIsStartingDiscover(true);
    setDiscoverJobs([]);
    setDiscoverRun(null);
    try {
      const res = await fetch("/api/jobs/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          country: discoverCountry.trim() || undefined,
          max_results: discoverMaxResults,
          filters,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to start discovery.");
      }
      const { run_id } = (await res.json()) as { run_id: string };
      toast.success("Discovery started — scanning the web for live jobs.");
      // Kick off polling.
      stopDiscoverPolling();
      await pollDiscover(run_id);
      discoverPollRef.current = setInterval(() => pollDiscover(run_id), 2500);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to start discovery.";
      toast.error(message);
    } finally {
      setIsStartingDiscover(false);
    }
  };

  /* ─── Navigate to resume workspace with pre-filled data ─── */
  const generateResumeFromJob = (job: {
    title: string;
    company: string;
    description: string;
  }) => {
    // Store in sessionStorage so the resume workspace can read it
    sessionStorage.setItem(
      "jobflow_selected_job",
      JSON.stringify({
        targetRole: job.title,
        company: job.company,
        jobDescription: stripHtml(job.description),
      })
    );
    router.push("/dashboard/resume-workspace?fromJob=true");
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Find Jobs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover live jobs or import from any URL — then generate a
            tailored resume.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/40 w-fit">
        <button
          onClick={() => setActiveTab("discover")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === "discover"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Radar className="w-3.5 h-3.5" />
          Discover Live
        </button>
        <button
          onClick={() => setActiveTab("import")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === "import"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Link2 className="w-3.5 h-3.5" />
          Import from URL
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══════════════════ DISCOVER LIVE ═══════════════════ */}
        {activeTab === "discover" && (
          <motion.div
            key="discover"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-1">
                  <Radar className="w-4 h-4 text-primary" />
                  Live Web Discovery
                </h2>
                <p className="text-xs text-muted-foreground">
                  Scrape the live web for fresh job postings on company sites and ATS pages.
                  Each result is AI-classified, structured, deduped, and saved to your Browse feed.
                </p>
              </div>

              <div className="grid sm:grid-cols-[1fr_220px_140px_auto] gap-2">
                <Input
                  value={discoverQuery}
                  onChange={(e) => setDiscoverQuery(e.target.value)}
                  placeholder="Role or keyword (e.g. 'Senior React Engineer')"
                  className="rounded-xl bg-muted/30 border-border/40 h-11"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      startDiscover();
                    }
                  }}
                />
                <Input
                  value={discoverCountry}
                  onChange={(e) => setDiscoverCountry(e.target.value)}
                  placeholder="Country (optional)"
                  className="rounded-xl bg-muted/30 border-border/40 h-11"
                />
                <Input
                  type="number"
                  min={1}
                  max={50}
                  value={discoverMaxResults}
                  onChange={(e) => setDiscoverMaxResults(Math.max(1, Math.min(50, Number(e.target.value) || 20)))}
                  className="rounded-xl bg-muted/30 border-border/40 h-11"
                />
                <Button
                  onClick={startDiscover}
                  disabled={isStartingDiscover || (discoverRun?.status === "running")}
                  className="rounded-xl px-6 h-11 gap-2 shadow-sm"
                >
                  {isStartingDiscover || discoverRun?.status === "running" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {discoverRun?.status === "running" ? "Scanning..." : "Starting..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Start Discovery
                    </>
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-medium">Tips:</span>
                <span className="bg-muted/50 px-2 py-0.5 rounded-full">Be specific ("Backend Python Senior")</span>
                <span className="bg-muted/50 px-2 py-0.5 rounded-full">Country narrows results</span>
                <span className="bg-muted/50 px-2 py-0.5 rounded-full">Max 50 results per run</span>
              </div>

              {/* Filter toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                  {(filters.work_modes.length + filters.job_types.length + filters.experience_levels.length + (filters.date_posted !== "any" ? 1 : 0)) > 0 && (
                    <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                      {filters.work_modes.length + filters.job_types.length + filters.experience_levels.length + (filters.date_posted !== "any" ? 1 : 0)}
                    </span>
                  )}
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showFilters && "rotate-180")} />
                </button>

                {showFilters && (
                  <div className="mt-3 rounded-xl border border-border/40 bg-muted/20 p-4 space-y-4">
                    {/* Work mode */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Work mode</p>
                      <div className="flex flex-wrap gap-2">
                        {WORK_MODE_OPTIONS.map(({ value, label }) => {
                          const active = filters.work_modes.includes(value);
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                setFilters((f) => ({
                                  ...f,
                                  work_modes: active
                                    ? f.work_modes.filter((m) => m !== value)
                                    : [...f.work_modes, value],
                                }))
                              }
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                                active
                                  ? "bg-foreground text-background border-foreground"
                                  : "bg-transparent text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
                              )}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Job type */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Job type</p>
                      <div className="flex flex-wrap gap-2">
                        {JOB_TYPE_OPTIONS.map(({ value, label }) => {
                          const active = filters.job_types.includes(value);
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                setFilters((f) => ({
                                  ...f,
                                  job_types: active
                                    ? f.job_types.filter((t) => t !== value)
                                    : [...f.job_types, value],
                                }))
                              }
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                                active
                                  ? "bg-foreground text-background border-foreground"
                                  : "bg-transparent text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
                              )}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Experience level */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Experience</p>
                      <div className="flex flex-wrap gap-2">
                        {EXP_LEVEL_OPTIONS.map(({ value, label }) => {
                          const active = filters.experience_levels.includes(value);
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() =>
                                setFilters((f) => ({
                                  ...f,
                                  experience_levels: active
                                    ? f.experience_levels.filter((e) => e !== value)
                                    : [...f.experience_levels, value],
                                }))
                              }
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                                active
                                  ? "bg-foreground text-background border-foreground"
                                  : "bg-transparent text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
                              )}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Date posted */}
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Date posted</p>
                      <div className="flex flex-wrap gap-2">
                        {DATE_POSTED_OPTIONS.map(({ value, label }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setFilters((f) => ({ ...f, date_posted: value }))}
                            className={cn(
                              "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                              filters.date_posted === value
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
                            )}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(filters.work_modes.length + filters.job_types.length + filters.experience_levels.length + (filters.date_posted !== "any" ? 1 : 0)) > 0 && (
                      <button
                        type="button"
                        onClick={() => setFilters(DEFAULT_FILTERS)}
                        className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Progress card */}
            {discoverRun && (
              <div className="rounded-xl border border-border/40 bg-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {discoverRun.status === "running" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : discoverRun.status === "done" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {discoverRun.status}
                    </span>
                    <span className="text-xs text-muted-foreground">· &quot;{discoverRun.query}&quot;{discoverRun.country ? ` · ${discoverRun.country}` : ""}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{timeAgo(discoverRun.started_at)}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-muted/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Found</div>
                    <div className="text-lg font-semibold text-foreground">{discoverRun.total_found}</div>
                  </div>
                  <div className="rounded-lg bg-muted/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Kept</div>
                    <div className="text-lg font-semibold text-foreground">{discoverRun.total_kept}</div>
                  </div>
                  <div className="rounded-lg bg-muted/40 px-3 py-2">
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Saved</div>
                    <div className="text-lg font-semibold text-foreground">{discoverRun.total_inserted}</div>
                  </div>
                </div>
                {discoverRun.error && (
                  <p className="text-xs text-destructive">{discoverRun.error}</p>
                )}
              </div>
            )}

            {/* Discovered jobs preview */}
            {discoverJobs.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  New jobs from this run ({discoverJobs.length})
                </h3>
                <div className="grid gap-3">
                  {discoverJobs.map((job) => {
                    const conf = confidenceBucket(job.extraction_confidence);
                    return (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJob(job)}
                        className="text-left rounded-xl border border-border/40 bg-card p-4 hover:border-border/60 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-foreground line-clamp-1">{job.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {job.location && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {job.location}
                                </span>
                              )}
                              {conf && (
                                <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", conf.color)}>
                                  <ShieldCheck className="w-3 h-3" />
                                  {conf.label}
                                </span>
                              )}
                              {job.hiring_email && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                  <Mail className="w-3 h-3" />
                                  {job.hiring_email}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {!discoverRun && !isStartingDiscover && (
              <div className="rounded-xl border border-border/40 bg-muted/20 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Radar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">How discovery works</h4>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Live web search for your role + country</li>
                    <li>AI classifies each result (posting / careers / aggregator / noise)</li>
                    <li>Approved pages are fetched and structured</li>
                    <li>Hiring emails are extracted when present</li>
                    <li>Verified jobs land in your Browse feed automatically</li>
                  </ol>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════ TAB 3: IMPORT FROM URL ═══════════════════ */}
        {activeTab === "import" && (
          <motion.div
            key="import"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* URL Input Card */}
            <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-1">
                  <Link2 className="w-4 h-4 text-primary" />
                  Import Job from Any URL
                </h2>
                <p className="text-xs text-muted-foreground">
                  Paste a link to any job posting — LinkedIn, Indeed, Glassdoor,
                  company career pages, or any other source. Our AI will extract
                  the structured job details.
                </p>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/jobs/view/..."
                    className="pl-10 rounded-xl bg-muted/30 border-border/40 h-11"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleExtract();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleExtract}
                  disabled={!importUrl.trim() || isExtracting}
                  className="rounded-xl px-6 h-11 gap-2 shadow-sm"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Extract Job
                    </>
                  )}
                </Button>
              </div>

              {/* Supported platforms hint */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-medium">Works with:</span>
                {[
                  "LinkedIn",
                  "Indeed",
                  "Glassdoor",
                  "ZipRecruiter",
                  "Company career pages",
                  "Angel.co",
                  "Wellfound",
                  "& more",
                ].map((platform) => (
                  <span
                    key={platform}
                    className="bg-muted/50 px-2 py-0.5 rounded-full"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Extraction Loading */}
            {isExtracting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl border border-border/40 bg-card p-8 flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <div className="w-16 h-16 border-[3px] border-muted rounded-full border-t-foreground animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Extracting job details...
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Fetching the page and using AI to parse the job title, company,
                  description, and requirements.
                </p>
              </motion.div>
            )}

            {/* Extracted Job Preview */}
            {extractedJob && !isExtracting && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border-2 border-foreground/10 bg-card overflow-hidden"
              >
                {/* Success header */}
                <div className="px-6 py-4 bg-foreground/5 border-b border-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      Job Details Extracted
                    </span>
                  </div>
                  <Button
                    onClick={() =>
                      generateResumeFromJob({
                        title: extractedJob.title,
                        company: extractedJob.company,
                        description: extractedJob.description,
                      })
                    }
                    className="gap-2 rounded-xl shadow-sm"
                    size="sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Resume
                  </Button>
                </div>

                <div className="p-6 space-y-4">
                  {/* Title & Company */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {extractedJob.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {extractedJob.company}
                    </p>
                  </div>

                  {/* Meta pills */}
                  <div className="flex flex-wrap gap-2">
                    {extractedJob.location && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-lg">
                        <MapPin className="w-3 h-3" />
                        {extractedJob.location}
                      </span>
                    )}
                    {extractedJob.employmentType && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-lg">
                        <Briefcase className="w-3 h-3" />
                        {extractedJob.employmentType}
                      </span>
                    )}
                    {extractedJob.salary && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-lg">
                        <DollarSign className="w-3 h-3" />
                        {extractedJob.salary}
                      </span>
                    )}
                  </div>

                  {/* Requirements */}
                  {extractedJob.requirements &&
                    extractedJob.requirements.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                          <Tag className="w-3 h-3 text-primary" />
                          Key Requirements
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {extractedJob.requirements
                            .slice(0, 10)
                            .map((req, i) => (
                              <span
                                key={i}
                                className="text-[11px] bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-lg"
                              >
                                {req}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                  {/* Description preview */}
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <FileText className="w-3 h-3 text-primary" />
                      Description
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-6">
                      {stripHtml(extractedJob.description).slice(0, 600)}...
                    </p>
                  </div>

                  {/* Apply link */}
                  {extractedJob.applyUrl && (
                    <a
                      href={extractedJob.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View original posting
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {/* Info callout */}
            {!extractedJob && !isExtracting && (
              <div className="rounded-xl border border-border/40 bg-muted/20 p-5 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    How it works
                  </h4>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>
                      Copy the URL of any job posting from any website
                    </li>
                    <li>
                      Paste it above and click &quot;Extract Job&quot;
                    </li>
                    <li>
                      Our AI reads the page and extracts the job details
                    </li>
                    <li>
                      Click &quot;Generate Resume&quot; to create a tailored
                      resume
                    </li>
                  </ol>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════ JOB DETAIL DRAWER ═══════════════════ */}
      <AnimatePresence>
        {selectedJob && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-card border-l border-border/40 shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/30 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center border border-border/30 overflow-hidden">
                    {selectedJob.company_logo ? (
                      <img
                        src={selectedJob.company_logo}
                        alt={selectedJob.company}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground text-sm line-clamp-1">
                      {selectedJob.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {selectedJob.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                {/* Meta */}
                <div className="flex flex-wrap gap-2">
                  {selectedJob.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-lg">
                      <MapPin className="w-3 h-3" />
                      {selectedJob.location}
                    </span>
                  )}
                  {selectedJob.employment_type && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-lg">
                      <Briefcase className="w-3 h-3" />
                      {selectedJob.employment_type}
                    </span>
                  )}
                  {selectedJob.salary && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-muted/50 px-3 py-1.5 rounded-lg">
                      <DollarSign className="w-3 h-3" />
                      {selectedJob.salary}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {timeAgo(selectedJob.posted_at)}
                  </span>
                  {sourceConfig[selectedJob.source] && (
                    <span
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full",
                        sourceConfig[selectedJob.source].color
                      )}
                    >
                      {sourceConfig[selectedJob.source].label}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {selectedJob.tags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground mb-2">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-primary/5 text-primary border border-primary/10 px-2.5 py-1 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Description */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2">
                    Full Description
                  </h4>
                  <div
                    className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none
                      [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                      [&_li]:mb-1 [&_p]:mb-2 [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-sm [&_h2]:mt-4 [&_h2]:mb-2
                      [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:text-sm [&_h3]:mt-3 [&_h3]:mb-1
                      [&_strong]:text-foreground [&_b]:text-foreground"
                    dangerouslySetInnerHTML={{
                      __html: selectedJob.description,
                    }}
                  />
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-border/30 flex flex-col gap-2 shrink-0 bg-card">
                {(selectedJob.hiring_email || selectedJob.contact_email) && (
                  <a
                    href={gmailComposeUrl(
                      (selectedJob.hiring_email || selectedJob.contact_email) as string,
                      selectedJob.title,
                      selectedJob.company
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full gap-2 rounded-xl shadow-sm">
                      <Mail className="w-3.5 h-3.5" />
                      Email Hiring Contact ({selectedJob.hiring_email || selectedJob.contact_email})
                    </Button>
                  </a>
                )}
                <div className="flex items-center gap-3">
                  {selectedJob.apply_url && (
                    <a
                      href={selectedJob.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full gap-2 rounded-xl"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Apply on {sourceConfig[selectedJob.source]?.label || "Source"}
                      </Button>
                    </a>
                  )}
                  <Button
                    onClick={() => {
                      generateResumeFromJob({
                        title: selectedJob.title,
                        company: selectedJob.company,
                        description: selectedJob.description,
                      });
                    }}
                    className="flex-1 gap-2 rounded-xl shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Generate Resume
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
