import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MAX_RESULTS_CAP = 50;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const scraperUrl = process.env.SCRAPER_SERVICE_URL;
    const internalToken = process.env.SCRAPER_INTERNAL_TOKEN;
    if (!scraperUrl || !internalToken) {
      return NextResponse.json(
        { error: "Scraper service is not configured on the server." },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const country = typeof body.country === "string" ? body.country.trim() : "";
    const rawMax = Number.parseInt(String(body.max_results ?? "20"), 10);
    const max_results = Number.isFinite(rawMax)
      ? Math.max(1, Math.min(rawMax, MAX_RESULTS_CAP))
      : 20;

    const VALID_WORK_MODES = ["remote", "hybrid", "onsite"] as const;
    const VALID_JOB_TYPES = ["full_time", "part_time", "contract", "internship", "freelance"] as const;
    const VALID_EXP_LEVELS = ["entry", "mid", "senior", "lead"] as const;
    const VALID_DATE_POSTED = ["any", "24h", "week", "month"] as const;

    const work_modes = Array.isArray(body.filters?.work_modes)
      ? body.filters.work_modes.filter((v: unknown) => VALID_WORK_MODES.includes(v as never))
      : [];
    const job_types = Array.isArray(body.filters?.job_types)
      ? body.filters.job_types.filter((v: unknown) => VALID_JOB_TYPES.includes(v as never))
      : [];
    const experience_levels = Array.isArray(body.filters?.experience_levels)
      ? body.filters.experience_levels.filter((v: unknown) => VALID_EXP_LEVELS.includes(v as never))
      : [];
    const date_posted = VALID_DATE_POSTED.includes(body.filters?.date_posted)
      ? body.filters.date_posted
      : "any";

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Please enter a search query (min 2 characters)." },
        { status: 400 }
      );
    }

    const scraperRes = await fetch(`${scraperUrl.replace(/\/$/, "")}/scrape/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": internalToken,
      },
      body: JSON.stringify({
        query,
        country: country || null,
        max_results,
        user_id: user.id,
        filters: { work_modes, job_types, experience_levels, date_posted },
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!scraperRes.ok) {
      const text = await scraperRes.text().catch(() => "");
      console.error("Scraper service error:", scraperRes.status, text);
      return NextResponse.json(
        { error: "Failed to start discovery run." },
        { status: 502 }
      );
    }

    const data = (await scraperRes.json()) as { run_id: string; status: string };
    return NextResponse.json({ run_id: data.run_id, status: data.status });
  } catch (error: unknown) {
    console.error("Discover route error:", error);
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
