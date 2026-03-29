import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RewriteData {
  jd: string;
  userProfile: any;
  optimizedKeywords: {
    skills: string[];
    experience: string[];
  };
}

/**
 * Step 5: LLM Resume Rewriting Engine
 * Uses structured prompt engineering for high-end ATS-optimized rewriting.
 */
export async function rewriteResume(data: RewriteData): Promise<string> {
  const { jd, userProfile, optimizedKeywords } = data;

  const prompt = `
    Create a high-end, ATS-optimized resume based on the user's profile and the job description (JD) below.

    Job Description:
    """
    ${jd}
    """

    User Current Profile:
    ${JSON.stringify(userProfile, null, 2)}

    Target Keywords to Incorporate:
    Skills: ${optimizedKeywords.skills.join(", ")}
    Concepts/Experience: ${optimizedKeywords.experience.join(", ")}

    FORMATTING RULES (CRITICAL):
    1. Use a clean, professional, and standard ATS format.
    2. Headers must be in ALL CAPS and clearly defined (e.g., PROFESSIONAL SUMMARY, SKILLS, PROFESSIONAL EXPERIENCE, EDUCATION).
    3. Use a standard bullet point (•) for experience.
    4. NO conversational text, NO markdown bolding within sections (except for headers if needed), NO fancy graphics.
    5. Ensure a logical hierarchy and consistent white space.

    WRITING RULES:
    1. Professional Summary: 3-4 sentence impactful summary that highlights the match for the role and includes 2-3 top keywords.
    2. SkillsSection: Group technical skills logically. Ensure ALL target skill keywords are included here.
    3. Professional Experience: Tailor bullet points to reflect the JD's responsibilities. Integrate core keywords naturally while focusing on quantifiable achievements (e.g., "Improved performance by 20%").
    4. Use strong active verbs (e.g., Developed, Orchestrated, Optimized, Spearheaded).
    5. If some tools/skills from the JD are missing in the user's profile but the user has related experience, map those concepts gracefully without lying.

    Output the full resume in a clean, plain text format optimized for ATS parsing.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5, // Lower temperature for more professional consistency
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from OpenAI");

    // Clean up any potential markdown wrapper from the LLM
    return content.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
  } catch (error) {
    console.error("Error rewriting resume:", error);
    throw new Error("Failed to rewrite the resume.");
  }
}
