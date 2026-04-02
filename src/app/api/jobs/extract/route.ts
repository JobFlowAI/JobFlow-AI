import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { OpenAI } from "openai";

export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

/**
 * Strips HTML tags and extracts readable text content from raw HTML.
 * Lightweight — no external dependency needed.
 */
function htmlToText(html: string): string {
  return html
    // Remove script and style blocks entirely
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    // Convert block elements to newlines
    .replace(/<\/(p|div|h[1-6]|li|tr|br|section|article|header|footer)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, " ")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Collapse whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n/g, "\n\n")
    .trim()
    // Limit length to avoid token overflow (keep first ~8000 chars)
    .slice(0, 8000);
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
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

    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "A valid URL is required." },
        { status: 400 }
      );
    }

    // Validate and preprocess URL
    let targetUrl = url;
    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }

      // Handle LinkedIn search URLs specifically
      if (
        parsedUrl.hostname.includes("linkedin.com") &&
        parsedUrl.pathname.includes("/jobs/search")
      ) {
        const currentJobId = parsedUrl.searchParams.get("currentJobId");
        if (currentJobId) {
          targetUrl = `https://www.linkedin.com/jobs/view/${currentJobId}`;
        }
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Please provide a valid HTTP(S) URL." },
        { status: 400 }
      );
    }

    // Fetch the page content server-side
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch the page (HTTP ${response.status}). The site may be blocking automated requests.`,
        },
        { status: 422 }
      );
    }

    const html = await response.text();
    const pageText = htmlToText(html);

    if (pageText.length < 100) {
      return NextResponse.json(
        {
          error:
            "Could not extract meaningful content from this page. The page may require JavaScript rendering or login.",
        },
        { status: 422 }
      );
    }

    // Use OpenAI to extract structured job data
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy") {
      // Return mock data for development
      return NextResponse.json({
        title: "Senior Frontend Engineer",
        company: "Example Corp",
        location: "Remote",
        employmentType: "Full-time",
        description:
          "We are looking for a Senior Frontend Engineer to join our team...",
        salary: "$120,000 - $160,000",
        requirements: [
          "5+ years of React experience",
          "TypeScript proficiency",
          "Experience with Next.js",
        ],
        applyUrl: url,
      });
    }

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a job posting data extractor. Given the text content of a web page, extract structured job posting information. 
If the page contains multiple job listings, extract the primary/first one.
If a field cannot be determined, use null.
Always respond in valid JSON.`,
        },
        {
          role: "user",
          content: `Extract the job posting details from this page content:

"""
${pageText}
"""

Respond in this exact JSON format:
{
  "title": "Job Title",
  "company": "Company Name",
  "location": "Location (city, state, country, or Remote)",
  "employmentType": "Full-time | Part-time | Contract | Internship",
  "description": "The FULL job description text including responsibilities and requirements — keep it complete and detailed, do not summarize",
  "salary": "Salary range if mentioned, otherwise null",
  "requirements": ["requirement1", "requirement2", "..."],
  "applyUrl": "Direct application URL if found, otherwise null"
}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
      max_tokens: 4000,
    });

    const content = aiResponse.choices[0].message.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    const extracted = JSON.parse(content);

    // Fallback the apply URL to the original URL if not extracted
    if (!extracted.applyUrl) {
      extracted.applyUrl = url;
    }

    return NextResponse.json(extracted);
  } catch (error: unknown) {
    console.error("Job URL extraction error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
