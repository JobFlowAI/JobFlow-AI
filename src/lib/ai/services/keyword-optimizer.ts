export interface KeywordAnalysis {
  missingKeywords: string[];
  weakAreas: string[];
  frequencyMap: Record<string, number>;
  mappedKeywords: {
    skills: string[];
    experience: string[];
  };
}

/**
 * Step 3: Keyword Gap Analysis & Step 4: Keyword Optimization Engine
 * Identifies missing keywords, calculates frequency/importance, and maps them to sections.
 */
export function analyzeKeywords(jdKeywords: string[], userSkills: string[], userProfileText: string): KeywordAnalysis {
  const lowercaseJdKeywords = jdKeywords.map(k => k.toLowerCase());
  const lowercaseUserSkills = userSkills.map(s => s.toLowerCase());
  const lowercaseProfileText = userProfileText.toLowerCase();

  // Find missing keywords
  const missingKeywords = jdKeywords.filter(k => 
    !lowercaseUserSkills.includes(k.toLowerCase()) && 
    !lowercaseProfileText.includes(k.toLowerCase())
  );

  // Frequency Map (Mock logic for now, using JD repetition)
  const frequencyMap: Record<string, number> = {};
  jdKeywords.forEach(k => {
    frequencyMap[k] = (frequencyMap[k] || 0) + 1; // Simplified repetition
  });

  // Weak Areas (Keywords that are mentioned frequently in JD but missing in profile)
  const weakAreas = missingKeywords.filter(k => (frequencyMap[k] || 0) >= 1);

  // Step 4: Map keywords to sections to avoid stuffing
  const mappedKeywords = {
    skills: missingKeywords.filter(k => 
      // Simple logic: if it's a short keyword, likely a skill/tool
      k.length < 20
    ).slice(0, 5), // Limit to top 5 missing skills
    experience: missingKeywords.filter(k => 
      // Longer fragments might be responsibilities/concepts
      k.length >= 20
    ).slice(0, 3), // Limit to top 3 context gaps
  };

  return {
    missingKeywords,
    weakAreas,
    frequencyMap,
    mappedKeywords,
  };
}
