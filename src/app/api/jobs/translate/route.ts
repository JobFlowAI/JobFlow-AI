import { NextRequest, NextResponse } from "next/server";
import { getAIClient, getDefaultModel, hasAIKey } from "@/lib/ai/openrouter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = "English" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!hasAIKey()) {
       return NextResponse.json({ translatedText: text, isMock: true });
    }

    const response = await getAIClient().chat.completions.create({
      model: getDefaultModel(),
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the provided text into ${targetLang}. 
Maintain the original tone and formatting (e.g. bullet points, newlines).
If the text is already in ${targetLang}, return it as is.
Identify the original language name.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });

    const translatedText = response.choices[0].message.content;

    return NextResponse.json({
      translatedText,
      originalLanguage: "Detected", // We could extract this more precisely if needed
    });
  } catch (error: any) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
