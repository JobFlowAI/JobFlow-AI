import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseJobDescription } from "@/lib/ai/services/nlp-parser";
import { computeSimilarity } from "@/lib/ai/services/embedding-engine";
import { analyzeKeywords } from "@/lib/ai/services/keyword-optimizer";
import { rewriteResume } from "@/lib/ai/services/resume-rewriter";
import { calculateAtsScore } from "@/lib/ai/services/scoring-engine";

// Rate limiting map (UserId -> { count, windowStart })
// TODO: Replace with Redis/Upstash for multi-instance production
const rateLimitMap = new Map<string, { count: number, windowStart: number }>();

const MAX_JD_LENGTH = 15_000; // ~3k tokens

export const dynamic = "force-dynamic";

/** Strip control characters that could be used for prompt injection. */
function sanitizeInput(text: string, maxLength: number): string {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars
    .slice(0, maxLength)
    .trim();
}

/** CSRF origin check. */
function isValidOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin) return true; // server-side or same-origin browser calls
  try {
    const originHost = new URL(origin).host;
    if (originHost === host) return true;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl && new URL(siteUrl).host === originHost) return true;
  } catch { /* invalid URL */ }
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // CSRF protection
    if (!isValidOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const jd = sanitizeInput(body.jd || "", MAX_JD_LENGTH);
    const targetRole = sanitizeInput(body.targetRole || "", 200);
    const company = sanitizeInput(body.company || "", 200);
    const optimizationType = body.optimizationType;

    if (!jd || !targetRole) {
      return NextResponse.json({ error: "Job description and target role are required." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    // In-memory rate limiting (Replace with Redis/Upstash for multi-instance production)
    const now = Date.now();
    const record = rateLimitMap.get(user.id);
    if (!record || (now - record.windowStart) > 60000) {
      rateLimitMap.set(user.id, { count: 1, windowStart: now });
    } else if (record.count >= 5) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    } else {
      record.count += 1;
    }

    // 1. Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Could not fetch user profile." }, { status: 404 });
    }

    // 2. Step 1: Parse JD (NLP Extraction)
    const jdParsed = await parseJobDescription(jd);

    // 3. Step 3 & 4: Keyword Gap Analysis & Optimization (Pre-generation)
    // For analysis, we use the original profile
    const originalProfileText = `
      Professional Summary: ${profile.summary}
      Skills: ${profile.skills.join(", ")}
      Experience: ${JSON.stringify(profile.experience)}
    `;
    const keywordAnalysis = analyzeKeywords(jdParsed.topKeywords, profile.skills, originalProfileText);

    // 4. Step 5: Rewrite Resume (LLM Rewriting)
    // This generates the "Final Output" that will be parsed by ATS
    const generatedContent = await rewriteResume({
      jd,
      userProfile: profile,
      optimizedKeywords: keywordAnalysis.mappedKeywords,
    });

    // 5. Step 2 (Refined): Compute Similarity (Generated Resume vs JD)
    // This measures how well the AI tailores the content to the role.
    const finalSimilarityScore = await computeSimilarity(jd, generatedContent);

    // 6. Step 6: Final ATS Scoring
    // Calculate and verify keyword density and formatting on the final content.
    const atsScore = calculateAtsScore({
      generatedContent,
      jdText: jd,
      topKeywords: jdParsed.topKeywords,
      similarityScore: finalSimilarityScore,
    });

    // 7. Return result
    return NextResponse.json({
      generatedContent,
      atsScore,
      analysis: {
        skills: jdParsed.skills,
        tools: jdParsed.tools,
        missing: keywordAnalysis.missingKeywords,
        weakAreas: keywordAnalysis.weakAreas,
      }
    });

  } catch (error: unknown) {
    console.error("ATS Pipeline error:", error);
    const message = error instanceof Error ? error.message : "An unexpected error occurred during resume generation.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
