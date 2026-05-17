import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Validates that the request originates from our own site (CSRF protection).
 * Returns true if the origin matches, false otherwise.
 */
function isValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  // Allow requests with no origin (e.g., server-side fetches, curl)
  if (!origin && !referer) return true;

  const allowed = host ? [host] : [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try { allowed.push(new URL(siteUrl).host); } catch { /* ignore */ }
  }

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      return allowed.some(h => h === originHost);
    } catch { return false; }
  }

  if (referer) {
    try {
      const refHost = new URL(referer).host;
      return allowed.some(h => h === refHost);
    } catch { return false; }
  }

  return false;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const isLite = url.searchParams.get("lite") === "true";

    // Omit massive text columns (job_description, generated_content) for lightweight dashboard renders
    const selectStr = isLite 
      ? "id, user_id, target_role, company, optimization_type, ats_score, status, template_id, created_at, updated_at"
      : "*";

    const { data, error } = await supabase
      .from("user_resumes")
      .select(selectStr)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // CSRF protection
    if (!isValidOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();

    // If client provides an ID, verify ownership before allowing upsert
    if (json.id) {
      const { data: existing } = await supabase
        .from("user_resumes")
        .select("id")
        .eq("id", json.id)
        .eq("user_id", user.id)
        .maybeSingle();

      // If a row exists with this ID but doesn't belong to this user, reject
      if (!existing) {
        const { data: anyRow } = await supabase
          .from("user_resumes")
          .select("id")
          .eq("id", json.id)
          .maybeSingle();

        if (anyRow) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
      }
    }

    // Generate server-side ID for new resumes if client didn't provide one
    const resumeId = json.id || `resume_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;

    // Map frontend fields (camelCase) to DB fields (snake_case)
    const payload = {
      id: resumeId,
      user_id: user.id,
      target_role: json.targetRole,
      company: json.company,
      job_description: json.jobDescription,
      optimization_type: json.optimizationType,
      ats_score: json.atsScore,
      status: json.status || 'draft',
      template_id: json.templateId,
      generated_content: typeof json.generatedContent === 'string' 
        ? JSON.parse(json.generatedContent) 
        : json.generatedContent,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("user_resumes")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
