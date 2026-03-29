import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Step 2: Embedding + Similarity Engine
 * Uses OpenAI's text-embedding-3-small to get embeddings.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding.");
  }
}

/**
 * Computes the cosine similarity between two vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  if (magA === 0 || magB === 0) return 0;

  return dotProduct / (magA * magB);
}

/**
 * Orchestrates Step 2 to compute similarity score.
 */
export async function computeSimilarity(jdText: string, resumeText: string): Promise<number> {
  const [jdEmbedding, resumeEmbedding] = await Promise.all([
    getEmbedding(jdText),
    getEmbedding(resumeText),
  ]);

  return cosineSimilarity(jdEmbedding, resumeEmbedding);
}
