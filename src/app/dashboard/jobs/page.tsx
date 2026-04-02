"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Link2,
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Briefcase,
  X,
  ChevronRight,
  Loader2,
  Globe,
  ArrowRight,
  AlertCircle,
  FileText,
  DollarSign,
  Tag,
  CheckCircle2,
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
  fetched_at: string;
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
};

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
  const [activeTab, setActiveTab] = useState<"browse" | "import">("browse");

  /* ─── Browse State ─── */
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  /* ─── Import State ─── */
  const [importUrl, setImportUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedJob, setExtractedJob] = useState<ExtractedJob | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ─── Initial load: trigger refresh + load jobs ─── */
  useEffect(() => {
    async function initialLoad() {
      // Trigger cache refresh (will skip if fresh)
      try {
        await fetch("/api/jobs/refresh", { method: "POST" });
      } catch {
        // Silently fail — cache might just be fresh
      }
      // Load initial jobs
      searchJobs("", 1, true);
    }
    initialLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ─── Search jobs from our cached DB ─── */
  const searchJobs = useCallback(
    async (query: string, pageNum: number, isInitial = false) => {
      setIsLoading(true);
      if (!isInitial) setHasSearched(true);

      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        params.set("page", String(pageNum));

        const res = await fetch(`/api/jobs/search?${params.toString()}`);
        if (!res.ok) throw new Error("Search failed");

        const data = await res.json();

        if (pageNum === 1) {
          setJobs(data.jobs || []);
        } else {
          setJobs((prev) => [...prev, ...(data.jobs || [])]);
        }
        setTotalResults(data.totalResults || 0);
        setPage(pageNum);
        setHasMore(data.hasMore || false);
      } catch {
        toast.error("Failed to search jobs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ─── Refresh cache ─── */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/jobs/refresh", { method: "POST" });
      const data = await res.json();
      if (data.skipped) {
        toast.info("Job cache is already fresh.");
      } else {
        toast.success(`Refreshed: ${data.upserted} jobs updated.`);
        searchJobs(searchQuery, 1);
      }
    } catch {
      toast.error("Failed to refresh job listings.");
    } finally {
      setIsRefreshing(false);
    }
  };

  /* ─── Handle search submit ─── */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs(searchQuery, 1);
  };

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
            Browse listings or import from any job board — then generate a
            tailored resume.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 rounded-xl text-xs"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Feed"}
          </Button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border/40 w-fit">
        <button
          onClick={() => setActiveTab("browse")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            activeTab === "browse"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Search className="w-3.5 h-3.5" />
          Browse Jobs
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
        {/* ═══════════════════ TAB 1: BROWSE JOBS ═══════════════════ */}
        {activeTab === "browse" && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, company, or keyword..."
                  className="pl-10 rounded-xl bg-muted/30 border-border/40 h-11"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchJobs("", 1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <Button
                type="submit"
                className="rounded-xl px-6 h-11 gap-2 shadow-sm"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Search
              </Button>
            </form>

            {/* Results Count */}
            {(hasSearched || jobs.length > 0) && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {totalResults > 0 ? (
                    <>
                      Showing{" "}
                      <span className="font-medium text-foreground">
                        {jobs.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-foreground">
                        {totalResults}
                      </span>{" "}
                      jobs
                    </>
                  ) : isLoading ? (
                    "Searching..."
                  ) : (
                    "No jobs found — try a different search term"
                  )}
                </p>
                <div className="flex items-center gap-1.5">
                  {Object.entries(sourceConfig).map(([key, cfg]) => (
                    <span
                      key={key}
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-full",
                        cfg.color
                      )}
                    >
                      {cfg.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Job Cards */}
            {isLoading && jobs.length === 0 ? (
              <div className="grid gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-border/40 bg-card p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-muted" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="h-3 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-full mt-3" />
                        <div className="h-3 bg-muted rounded w-4/5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid gap-3">
                {jobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <button
                      onClick={() => setSelectedJob(job)}
                      className={cn(
                        "w-full text-left rounded-xl border-2 bg-card p-5 transition-all duration-200 group hover:shadow-md",
                        selectedJob?.id === job.id
                          ? "border-foreground/30 shadow-sm"
                          : "border-border/40 hover:border-border/60"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Company Avatar */}
                        <div className="w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center shrink-0 border border-border/30 overflow-hidden">
                          {job.company_logo ? (
                            <img
                              src={job.company_logo}
                              alt={job.company}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-5 h-5 text-muted-foreground/50" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {job.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {job.company}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground shrink-0 transition-colors mt-0.5" />
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mt-2.5">
                            {job.location && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                            )}
                            {job.employment_type && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Briefcase className="w-3 h-3" />
                                {job.employment_type}
                              </span>
                            )}
                            {job.salary && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <DollarSign className="w-3 h-3" />
                                {job.salary}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {timeAgo(job.posted_at)}
                            </span>
                            {sourceConfig[job.source] && (
                              <span
                                className={cn(
                                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                                  sourceConfig[job.source].color
                                )}
                              >
                                {sourceConfig[job.source].label}
                              </span>
                            )}
                          </div>

                          {/* Brief description preview */}
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                            {stripHtml(job.description).slice(0, 200)}...
                          </p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => searchJobs(searchQuery, page + 1)}
                      disabled={isLoading}
                      className="gap-2 rounded-xl"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            ) : !isLoading && hasSearched ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  No results found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try adjusting your search terms, or import a job directly from
                  any URL using the Import tab.
                </p>
              </div>
            ) : !isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Globe className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  No jobs in cache yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  Click &quot;Refresh Feed&quot; to fetch the latest job listings
                  from multiple sources.
                </p>
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="gap-2 rounded-xl shadow-sm"
                >
                  <RefreshCw
                    className={cn(
                      "w-4 h-4",
                      isRefreshing && "animate-spin"
                    )}
                  />
                  {isRefreshing ? "Refreshing..." : "Refresh Feed"}
                </Button>
              </div>
            ) : null}
          </motion.div>
        )}

        {/* ═══════════════════ TAB 2: IMPORT FROM URL ═══════════════════ */}
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
              <div className="px-6 py-4 border-t border-border/30 flex items-center gap-3 shrink-0 bg-card">
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
