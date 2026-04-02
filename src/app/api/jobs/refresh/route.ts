import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Normalized job listing format used across all sources.
 */
interface NormalizedJob {
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
}

/**
 * Fetch from Remotive API (no auth required)
 * https://remotive.com/api/remote-jobs
 */
async function fetchRemotive(): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      "https://remotive.com/api/remote-jobs?limit=50",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.jobs || []).map((job: Record<string, unknown>) => ({
      external_id: String(job.id),
      source: "remotive",
      title: String(job.title || ""),
      company: String(job.company_name || ""),
      company_logo: (job.company_logo as string) || null,
      location: String(job.candidate_required_location || "Remote"),
      employment_type: String(job.job_type || "").replace(/_/g, " "),
      description: String(job.description || ""),
      salary: (job.salary as string) || null,
      tags: Array.isArray(job.tags) ? job.tags.map(String) : [],
      apply_url: (job.url as string) || null,
      posted_at: (job.publication_date as string) || null,
    }));
  } catch (err) {
    console.error("Remotive fetch error:", err);
    return [];
  }
}

/**
 * Fetch from Himalayas API (no auth required)
 * https://himalayas.app/jobs/api
 */
async function fetchHimalayas(): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      "https://himalayas.app/jobs/api?offset=0&limit=20",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.jobs || []).map((job: Record<string, unknown>) => ({
      external_id: String(job.id || job.slug || ""),
      source: "himalayas",
      title: String(job.title || ""),
      company: String(
        (job.companyName as string) ||
          (typeof job.company === "object" && job.company !== null
            ? (job.company as Record<string, unknown>).name
            : "") ||
          ""
      ),
      company_logo:
        (typeof job.company === "object" && job.company !== null
          ? ((job.company as Record<string, unknown>).logo as string)
          : null) || null,
      location: String(
        (job.location as string) || (Array.isArray(job.locationRestrictions) && job.locationRestrictions.length > 0 ? job.locationRestrictions.join(", ") : "Remote")
      ),
      employment_type: (job.type as string) || "full_time",
      description: String(job.description || ""),
      salary: job.minSalary
        ? `$${job.minSalary}${job.maxSalary ? ` - $${job.maxSalary}` : ""}`
        : null,
      tags: Array.isArray(job.categories)
        ? job.categories.map(String)
        : Array.isArray(job.tags)
        ? job.tags.map(String)
        : [],
      apply_url: (job.applicationLink as string) || (job.url as string) || null,
      posted_at: (job.pubDate as string) || (job.publishedAt as string) || null,
    }));
  } catch (err) {
    console.error("Himalayas fetch error:", err);
    return [];
  }
}

/**
 * Fetch from Arbeitnow API (no auth required)
 * https://www.arbeitnow.com/api/job-board-api
 */
async function fetchArbeitnow(): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      "https://www.arbeitnow.com/api/job-board-api?page=1",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.data || []).map((job: Record<string, unknown>) => ({
      external_id: String(job.slug || job.id || ""),
      source: "arbeitnow",
      title: String(job.title || ""),
      company: String(job.company_name || ""),
      company_logo: (job.company_logo as string) || null,
      location: String(job.location || ""),
      employment_type: (job.job_types as string[])?.join(", ") || null,
      description: String(job.description || ""),
      salary: null,
      tags: Array.isArray(job.tags) ? job.tags.map(String) : [],
      apply_url: (job.url as string) || null,
      posted_at: job.created_at
        ? new Date((job.created_at as number) * 1000).toISOString()
        : null,
    }));
  } catch (err) {
    console.error("Arbeitnow fetch error:", err);
    return [];
  }
}

/**
 * POST /api/jobs/refresh
 * Triggers a cache refresh: fetches from all 3 sources and upserts into Supabase.
 * Protected: requires authenticated user.
 * Implements smart TTL: won't refresh if last refresh was < 1 hour ago.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    // Check last refresh time — skip if less than 1 hour ago
    const { data: latestJob } = await supabase
      .from("job_listings")
      .select("fetched_at")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single();

    if (latestJob?.fetched_at) {
      const lastRefresh = new Date(latestJob.fetched_at).getTime();
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (lastRefresh > oneHourAgo) {
        return NextResponse.json({
          message: "Cache is fresh (last refreshed less than 1 hour ago).",
          skipped: true,
        });
      }
    }

    // Fetch from all sources in parallel
    const [remotiveJobs, himalayasJobs, arbeitnowJobs] =
      await Promise.allSettled([
        fetchRemotive(),
        fetchHimalayas(),
        fetchArbeitnow(),
      ]);

    const allJobs: NormalizedJob[] = [
      ...(remotiveJobs.status === "fulfilled" ? remotiveJobs.value : []),
      ...(himalayasJobs.status === "fulfilled" ? himalayasJobs.value : []),
      ...(arbeitnowJobs.status === "fulfilled" ? arbeitnowJobs.value : []),
    ];

    // Filter out jobs with missing essential fields
    const validJobs = allJobs.filter(
      (j) =>
        j.external_id &&
        j.title &&
        j.company &&
        j.description &&
        j.description.length > 20
    );

    if (validJobs.length === 0) {
      return NextResponse.json({
        message: "No valid jobs fetched from any source.",
        sources: {
          remotive: remotiveJobs.status,
          himalayas: himalayasJobs.status,
          arbeitnow: arbeitnowJobs.status,
        },
      });
    }

    // Upsert in batches of 50 to avoid payload limits
    const batchSize = 50;
    let upsertedCount = 0;

    for (let i = 0; i < validJobs.length; i += batchSize) {
      const batch = validJobs.slice(i, i + batchSize).map((job) => ({
        ...job,
        fetched_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("job_listings")
        .upsert(batch, { onConflict: "source,external_id" });

      if (error) {
        console.error(`Upsert batch error (offset ${i}):`, error);
      } else {
        upsertedCount += batch.length;
      }
    }

    // Clean up old listings (older than 30 days)
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();
    await supabase
      .from("job_listings")
      .delete()
      .lt("fetched_at", thirtyDaysAgo);

    return NextResponse.json({
      message: `Successfully refreshed job cache.`,
      upserted: upsertedCount,
      sources: {
        remotive:
          remotiveJobs.status === "fulfilled"
            ? remotiveJobs.value.length
            : "failed",
        himalayas:
          himalayasJobs.status === "fulfilled"
            ? himalayasJobs.value.length
            : "failed",
        arbeitnow:
          arbeitnowJobs.status === "fulfilled"
            ? arbeitnowJobs.value.length
            : "failed",
      },
    });
  } catch (error: unknown) {
    console.error("Job refresh error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
