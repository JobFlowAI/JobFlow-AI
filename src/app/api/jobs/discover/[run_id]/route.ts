import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ run_id: string }> }
) {
  try {
    const { run_id } = await params;
    if (!run_id) {
      return NextResponse.json({ error: "run_id is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: run, error } = await supabase
      .from("job_discovery_runs")
      .select("*")
      .eq("id", run_id)
      .single();

    if (error || !run) {
      return NextResponse.json({ error: "Run not found." }, { status: 404 });
    }

    if (run.user_id && run.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Pull the freshest jobs produced by this run so the UI can preview them.
    const { data: jobs } = await supabase
      .from("job_listings")
      .select(
        "id, title, company, company_logo, location, employment_type, salary, posted_at, closing_at, apply_url, canonical_url, hiring_email, contact_email, extraction_confidence, source, source_type, posting_classification, tags, description"
      )
      .eq("run_id", run_id)
      .order("extraction_confidence", { ascending: false, nullsFirst: false })
      .limit(50);

    return NextResponse.json({ run, jobs: jobs || [] });
  } catch (error: unknown) {
    console.error("Discover status route error:", error);
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
