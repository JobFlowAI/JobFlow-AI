import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  deadline?: string | null;
  country?: string | null;
  category?: string | null;
  subcategory?: string | null;
  contact_email?: string | null;
  original_language?: string | null;
  is_translated?: boolean;
  translated_from?: string | null;
}

/**
 * Uses OpenAI to translate and categorize jobs in batches.
 */
async function enrichJobsWithAI(jobs: NormalizedJob[]): Promise<NormalizedJob[]> {
  if (!process.env.OPENAI_API_KEY || jobs.length === 0) return jobs;
  console.log(`Enriching batch of ${jobs.length} jobs...`);

  const prompt = `You are a job data expert. For each job listed below, perform the following:
1. If the title or description contains ANY non-English text (even if mixed), translate it ENTIRELY to English.
2. Specifically, translate German suffixes like "(m/w/d)" to "(m/f/d)" or "(Male/Female/Diverse)".
3. Tell me the original language name (e.g. "German", "Spanish", "French").
4. Categorize the job into one of these top-level categories: Technology, Healthcare, Finance, Marketing, Design, Education, Engineering, Sales, Operations, Legal, HR & Recruiting, Customer Support, Construction, Hospitality, Media & Entertainment, Science & Research, Nonprofit, Government.
5. Provide a specific subcategory (e.g. "Frontend Engineering", "Nursing", "Accounting").
6. Extract a contact email if mentioned in the description.

Respond ONLY in a JSON array of objects with these keys: 
"id" (the job index), "translatedTitle", "translatedDescription", "originalLanguage", "category", "subcategory", "contactEmail", "isTranslated" (boolean - set to true if YOU translated or modified any text).

Jobs:
${jobs.map((j, i) => `[Job ${i}]
Title: ${j.title}
Description: ${j.description}
`).join("\n")}
`;

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = aiResponse.choices[0].message.content;
    if (!content) return jobs;

    const results = (JSON.parse(content).jobs || JSON.parse(content).results || Object.values(JSON.parse(content))[0]) as Record<string, unknown>[];
    
    if (!Array.isArray(results)) return jobs;

interface AIEnrichmentResult {
  id: number;
  isTranslated: boolean;
  originalLanguage: string;
  translatedTitle: string;
  translatedDescription: string;
  category: string;
  subcategory: string;
  contactEmail: string;
}

    return jobs.map((job, i) => {
      const enrichment = (results as unknown as AIEnrichmentResult[]).find((r) => r.id === i);
      if (!enrichment) return job;

      const isNonEnglish = enrichment.originalLanguage && enrichment.originalLanguage.toLowerCase() !== "english";
      
      return {
        ...job,
        // Always use AI version if provided, as it might have cleaned up the text
        title: enrichment.translatedTitle || job.title,
        description: enrichment.translatedDescription || job.description,
        is_translated: !!(enrichment.isTranslated || isNonEnglish),
        translated_from: isNonEnglish ? String(enrichment.originalLanguage) : null,
        category: enrichment.category ? String(enrichment.category) : job.category,
        subcategory: enrichment.subcategory ? String(enrichment.subcategory) : job.subcategory,
        contact_email: (enrichment.contactEmail ? String(enrichment.contactEmail) : null) || job.contact_email,
      };
    });
  } catch (error) {
    console.error("AI Enrichment Error:", error);
    return jobs;
  }
}
/**
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
      country: "Remote",
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
      country: "Remote",
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
      country: "Germany",
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
 * Fetch from The Muse API (no auth required)
 */
async function fetchTheMuse(): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      "https://www.themuse.com/api/public/jobs?page=0&limit=20",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).map((job: any) => ({
      external_id: String(job.id),
      source: "themuse",
      title: job.name,
      company: job.company?.name || "Unknown",
      company_logo: null,
      location: job.locations?.[0]?.name || "Remote",
      country: job.locations?.[0]?.name?.split(", ").pop() || "USA",
      employment_type: "Full-time",
      description: job.contents || "",
      salary: null,
      tags: job.categories?.map((c: any) => c.name) || [],
      apply_url: job.refs?.landing_page || null,
      posted_at: job.publication_date || null,
    }));
  } catch (err) {
    console.error("The Muse fetch error:", err);
    return [];
  }
}

/**
 * Fetch from Adzuna API (requires keys)
 */
async function fetchAdzuna(): Promise<NormalizedJob[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  try {
    const res = await fetch(
      `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=20&content-type=application/json`,
      { signal: AbortSignal.timeout(15000) }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.results || []).map((job: any) => ({
      external_id: String(job.id),
      source: "adzuna",
      title: job.title,
      company: job.company?.display_name || "Unknown",
      company_logo: null,
      location: job.location?.display_name || "Remote",
      country: "USA",
      employment_type: job.contract_type || "Full-time",
      description: job.description || "",
      salary: job.salary_min ? `$${job.salary_min} - $${job.salary_max}` : null,
      tags: [job.category?.label].filter(Boolean),
      apply_url: job.redirect_url || null,
      posted_at: job.created || null,
    }));
  } catch (err) {
    console.error("Adzuna fetch error:", err);
    return [];
  }
}
/**
 * Fetch from JSearch (RapidAPI) (requires key)
 * Highly powerful worldwide coverage.
 */
async function fetchJSearch(): Promise<NormalizedJob[]> {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) return [];

  try {
    const res = await fetch(
      "https://jsearch.p.rapidapi.com/search?query=Job&page=1&num_pages=1",
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
        signal: AbortSignal.timeout(15000),
      }
    );
    if (!res.ok) return [];
    const data = await res.json();

    return (data.data || []).map((job: any) => ({
      external_id: String(job.job_id),
      source: "jsearch",
      title: job.job_title,
      company: job.employer_name || "Unknown",
      company_logo: job.employer_logo || null,
      location: `${job.job_city || ""}, ${job.job_country || ""}`,
      country: job.job_country || "Worldwide",
      employment_type: job.job_employment_type || "Full-time",
      description: job.job_description || "",
      salary: job.job_min_salary ? `$${job.job_min_salary} - $${job.job_max_salary}` : null,
      tags: [],
      apply_url: job.job_apply_link || null,
      posted_at: job.job_posted_at_datetime_utc || null,
    }));
  } catch (err) {
    console.error("JSearch fetch error:", err);
    return [];
  }
}

/**
 * POST /api/jobs/refresh
 * Triggers a cache refresh: fetches from all sources and upserts into Supabase.
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
    const [
      remotiveRes,
      himalayasRes,
      arbeitnowRes,
      themuseRes,
      adzunaRes,
      jsearchRes,
    ] = await Promise.allSettled([
      fetchRemotive(),
      fetchHimalayas(),
      fetchArbeitnow(),
      fetchTheMuse(),
      fetchAdzuna(),
      fetchJSearch(),
    ]);

    const allJobs: NormalizedJob[] = [
      ...(remotiveRes.status === "fulfilled" ? remotiveRes.value : []),
      ...(himalayasRes.status === "fulfilled" ? himalayasRes.value : []),
      ...(arbeitnowRes.status === "fulfilled" ? arbeitnowRes.value : []),
      ...(themuseRes.status === "fulfilled" ? themuseRes.value : []),
      ...(adzunaRes.status === "fulfilled" ? adzunaRes.value : []),
      ...(jsearchRes.status === "fulfilled" ? jsearchRes.value : []),
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
      });
    }

    // Process ALL jobs in parallel batches for AI enrichment (translation & categorization)
    console.log(`Deep enriching ${validJobs.length} jobs with AI...`);
    const enrichmentBatchSize = 10;
    const batches: NormalizedJob[][] = [];
    
    for (let i = 0; i < validJobs.length; i += enrichmentBatchSize) {
      batches.push(validJobs.slice(i, i + enrichmentBatchSize));
    }

    // Process all batches in parallel to handle the larger volume without timing out
    // Each batch is an independent OpenAI call
    const enrichedResults = await Promise.all(
      batches.map(async (batch, index) => {
        try {
          console.log(`Starting batch ${index + 1}/${batches.length}...`);
          return await enrichJobsWithAI(batch);
        } catch (err) {
          console.error(`Batch ${index + 1} failed:`, err);
          return batch; // Fallback to original batch if AI fails
        }
      })
    );

    const finalJobs = enrichedResults.flat();
    console.log(`Enrichment complete. Total jobs: ${finalJobs.length}`);

    // Upsert in batches of 50 to avoid payload limits
    const batchSize = 50;
    let upsertedCount = 0;

    for (let i = 0; i < finalJobs.length; i += batchSize) {
      const batch = finalJobs.slice(i, i + batchSize).map((job) => ({
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
        remotive: remotiveRes.status === "fulfilled" ? remotiveRes.value.length : "failed",
        himalayas: himalayasRes.status === "fulfilled" ? himalayasRes.value.length : "failed",
        arbeitnow: arbeitnowRes.status === "fulfilled" ? arbeitnowRes.value.length : "failed",
        themuse: themuseRes.status === "fulfilled" ? themuseRes.value.length : "failed",
        adzuna: adzunaRes.status === "fulfilled" ? adzunaRes.value.length : "failed",
        jsearch: jsearchRes.status === "fulfilled" ? jsearchRes.value.length : "failed",
      },
    });
  } catch (error: unknown) {
    console.error("Job refresh error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
