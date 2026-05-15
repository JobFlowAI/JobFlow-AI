import { getAIClient, getDefaultModel, hasAIKey } from "@/lib/ai/openrouter";

export interface JDParsedData {
  skills: string[];
  tools: string[];
  experienceLevel: string;
  responsibilities: string[];
  topKeywords: string[];
}

/**
 * Step 1: Job Description Parsing (NLP Layer)
 * Extracts key requirements from a JD text using OpenAI.
 */
export async function parseJobDescription(jdText: string): Promise<JDParsedData> {
  const prompt = `
    Extract the following information from the job description below to optimize for an Applicant Tracking System (ATS):
    1. Core Technical Skills (Hard skills, programming languages, methodologies, industial knowlodge, domain knowledge, soft skills, etc)
    2. Tools, Frameworks, and Technologies (Specific software, platforms, etc)
    3. Experience Level (e.g., Junior, Mid-level, Senior, Lead)
    4. Key Responsibilities (Action-oriented bullet points, most important responsibilities first, highest priority first)
    5. Top 20 high-impact keywords (required skills and tools) that an ATS will scan for.

    Job Description:
    """
    ${jdText}
    """

    Respond strictly in JSON format with the following keys:
    {
      "skills": ["skill1", "skill2"],
      "tools": ["tool1", "tool2"],
      "experienceLevel": "Senior",
      "responsibilities": ["resp1", "resp2"],
      "topKeywords": ["keyword1", "keyword2"]
    }
  `;

  try {
    if (!hasAIKey()) {
      console.log("No OPENROUTER_API_KEY configured, returning mock JD parsed data.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        skills: ["React", "TypeScript", "Node.js", "System Architecture", "Agile"],
        tools: ["Git", "Docker", "AWS", "Jira"],
        experienceLevel: "Senior",
        responsibilities: [
          "Lead frontend architecture and development.",
          "Mentor junior engineers.",
          "Optimize application performance."
        ],
        topKeywords: ["React", "TypeScript", "Node.js", "System Architecture", "Performance Optimization", "AWS", "Docker", "Mentoring"]
      };
    }

    const response = await getAIClient().chat.completions.create({
      model: getDefaultModel(),
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from LLM");

    return JSON.parse(content) as JDParsedData;
  } catch (error) {
    console.error("Error parsing JD:", error);
    throw new Error("Failed to parse the job description.");
  }
}
