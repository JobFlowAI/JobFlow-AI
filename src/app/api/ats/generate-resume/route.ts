import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseJobDescription } from "@/lib/ai/services/nlp-parser";
import { computeSimilarity } from "@/lib/ai/services/embedding-engine";
import { analyzeKeywords } from "@/lib/ai/services/keyword-optimizer";
import { rewriteResume } from "@/lib/ai/services/resume-rewriter";
import { calculateAtsScore } from "@/lib/ai/services/scoring-engine";

export async function POST(req: NextRequest) {
  try {
    const { jd, targetRole, company, optimizationType } = await req.json();

    if (!jd || !targetRole) {
      return NextResponse.json({ error: "Job description and target role are required." }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
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

  } catch (error: any) {
    console.error("ATS Pipeline error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred during resume generation." }, { status: 500 });
  }
}
