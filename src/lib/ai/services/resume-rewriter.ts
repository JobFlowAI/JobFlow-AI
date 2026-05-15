import { getAIClient, hasAIKey } from "@/lib/ai/openrouter";

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

    CRITICAL INSTRUCTION: You MUST return your response as a valid JSON object.
    The JSON object MUST EXACTLY MATCH the following structure and keys:
    {
      "personalInfo": {
        "name": "Extract or infer from profile",
        "email": "Extract or infer",
        "phone": "Extract or infer",
        "location": "Extract or infer",
        "linkedin": "Extract or infer",
        "github": "Extract or infer"
      },
      "summary": "3-4 sentence impactful professional summary highlighting match for the role and top keywords.",
      "experience": [
        {
          "title": "Job Title",
          "company": "Company Name",
          "location": "Location",
          "dates": "Start Date – End Date",
          "bullets": [
            "Quantifiable, action-oriented bullet point naturally integrating keywords...",
            "Another impact-driven bullet point..."
          ]
        }
      ],
      "education": [
        {
          "degree": "Degree Name",
          "school": "University Name",
          "location": "Location",
          "dates": "Dates or Graduation Year"
        }
      ],
      "skills": [
        "Include ALL target skill keywords here, grouped if necessary", "Skill 2"
      ],
      "certifications": [
        "Certifications if any"
      ]
    }

    WRITING RULES:
    1. Professional Experience: Tailor bullet points to the JD. Focus on quantifiable achievements.
    2. Use strong active verbs (e.g., Developed, Orchestrated, Optimized).
    3. Output valid JSON only, no markdown wrapping.
  `;

  try {
    if (!hasAIKey()) {
      console.log("No OPENROUTER_API_KEY configured, returning mock resume JSON.");
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return JSON.stringify({
        personalInfo: {
          name: userProfile.first_name ? `${userProfile.first_name} ${userProfile.last_name || ""}`.trim() : "Demo User",
          email: userProfile.email || "demo@example.com",
          phone: userProfile.phone || "555-0100",
          location: userProfile.location || "San Francisco, CA",
          linkedin: userProfile.linkedin_url || "linkedin.com/in/demo",
          github: userProfile.portfolio_url || "github.com/demo"
        },
        summary: `Result-driven professional with expertise targeting the key responsibilities of the role. Proven ability to leverage ${optimizedKeywords.skills[0] || "industry skills"} to deliver robust solutions. Adept at driving impact in fast-paced environments.`,
        experience: [
          {
            title: "Senior Role",
            company: "Tech Corp",
            location: "Remote",
            dates: "2020 – Present",
            bullets: [
              `Spearheaded major initiatives utilizing ${optimizedKeywords.skills[1] || "key tools"} to achieve a 30% increase in efficiency.`,
              `Collaborated cross-functionally to implement ${optimizedKeywords.experience[0] || "best practices"}.`
            ]
          }
        ],
        education: [
          {
            degree: "B.S. Computer Science",
            school: "State University",
            location: "Anytown",
            dates: "2016 – 2020"
          }
        ],
        skills: optimizedKeywords.skills.length > 0 ? optimizedKeywords.skills : ["JavaScript", "React", "Node.js", "System Design"],
        certifications: ["AWS Certified Developer"]
      });
    }

    const response = await getAIClient().chat.completions.create({
      model: process.env.OPENROUTER_REWRITE_MODEL || process.env.OPENROUTER_MODEL || "openai/gpt-4o",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Empty response from LLM");

    // The content is guaranteed to be a JSON string
    return content;
  } catch (error) {
    console.error("Error rewriting resume:", error);
    throw new Error("Failed to rewrite the resume into JSON format.");
  }
}
