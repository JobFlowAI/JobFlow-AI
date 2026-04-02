import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim() || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const source = searchParams.get("source") || "";
    const employmentType = searchParams.get("type") || "";

    const offset = (page - 1) * PAGE_SIZE;

    // Build base query
    let dbQuery = supabase
      .from("job_listings")
      .select("*", { count: "exact" })
      .order("posted_at", { ascending: false, nullsFirst: false })
      .range(offset, offset + PAGE_SIZE - 1);

    // Full-text search if query provided
    if (query) {
      // Use Supabase textSearch for PostgreSQL full-text search
      dbQuery = dbQuery.textSearch(
        "title",
        query.split(/\s+/).join(" | "),
        { type: "plain", config: "english" }
      );
    }

    // Filter by source
    if (source) {
      dbQuery = dbQuery.eq("source", source);
    }

    // Filter by employment type
    if (employmentType) {
      dbQuery = dbQuery.eq("employment_type", employmentType);
    }

    const { data: jobs, count, error } = await dbQuery;

    if (error) {
      console.error("Job search query error:", error);
      throw new Error("Failed to search jobs.");
    }

    const totalResults = count || 0;

    return NextResponse.json({
      jobs: jobs || [],
      totalResults,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(totalResults / PAGE_SIZE),
      hasMore: offset + PAGE_SIZE < totalResults,
    });
  } catch (error: unknown) {
    console.error("Job search error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
