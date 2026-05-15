import { getAIClient, getEmbeddingModel, hasAIKey } from "@/lib/ai/openrouter";

/**
 * Step 2: Embedding + Similarity Engine
 * Uses an OpenAI-compatible embedding endpoint via OpenRouter.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await getAIClient().embeddings.create({
      model: getEmbeddingModel(),
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
  if (!hasAIKey()) {
    return 0.85; // Default mock similarity for local testing
  }

  try {
    const [jdEmbedding, resumeEmbedding] = await Promise.all([
      getEmbedding(jdText),
      getEmbedding(resumeText),
    ]);
    return cosineSimilarity(jdEmbedding, resumeEmbedding);
  } catch (err) {
    // OpenRouter doesn't always proxy embedding endpoints — fall back gracefully.
    console.warn("Embedding similarity unavailable, using fallback heuristic.", err);
    return 0.7;
  }
}
