export interface ScoringInput {
  generatedContent: string;
  jdText: string;
  topKeywords: string[];
  similarityScore: number;
}

/**
 * Step 6: Advanced ATS Scoring System
 * Calculate a realistic ATS score (out of 100) by analyzing the generated content.
 */
export function calculateAtsScore(input: ScoringInput): number {
  const { generatedContent, jdText, topKeywords, similarityScore } = input;
  const contentLower = generatedContent.toLowerCase();

  // 1. Semantic Similarity (40%)
  // similarityScore is from OpenAI embeddings (0 to 1)
  const similarityWeight = 40;
  const similarityContribution = Math.max(0, similarityScore) * similarityWeight;

  // 2. Keyword Match Density (40%)
  // We check how many of the top keywords are actually present in the generated resume.
  const keywordWeight = 40;
  const foundKeywords = topKeywords.filter(kw => contentLower.includes(kw.toLowerCase()));
  const matchRate = topKeywords.length > 0 ? (foundKeywords.length / topKeywords.length) : 0;
  const keywordContribution = matchRate * keywordWeight;

  // 3. Formatting & Section Check (20%)
  // ATS systems look for standard section headers.
  const sections = ["SUMMARY", "SKILLS", "EXPERIENCE", "EDUCATION"];
  const sectionWeight = 20;
  const foundSections = sections.filter(s => generatedContent.toUpperCase().includes(s));
  const sectionContribution = (foundSections.length / sections.length) * sectionWeight;

  // 4. Final Aggregation
  let finalScore = Math.round(similarityContribution + keywordContribution + sectionContribution);

  // ATS Optimization: If similarity is high (>0.85) and keyword match is high (>0.8), 
  // ensure the score is in the 80-95 range as it's a "high-end" match.
  if (similarityScore > 0.8 && matchRate > 0.7) {
    finalScore = Math.max(finalScore, 82);
  }

  // Clamp score between 0 and 100
  return Math.min(100, Math.max(0, finalScore));
}
