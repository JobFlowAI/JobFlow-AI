import { OpenAI } from "openai";

/**
 * Shared OpenRouter client for all server-side LLM calls.
 *
 * OpenRouter is OpenAI-API-compatible, so we reuse the official `openai` SDK
 * but point its base URL at https://openrouter.ai/api/v1 and authenticate with
 * OPENROUTER_API_KEY.
 *
 * Configure via env:
 *   - OPENROUTER_API_KEY        (required for live calls)
 *   - OPENROUTER_MODEL          (default: openai/gpt-4o-mini)
 *   - OPENROUTER_EMBEDDING_MODEL (default: openai/text-embedding-3-small)
 *   - OPENROUTER_SITE_URL       (optional, sent as HTTP-Referer for analytics)
 *   - OPENROUTER_APP_NAME       (optional, sent as X-Title for analytics)
 */

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

let _client: OpenAI | null = null;

/** Returns true when an OpenRouter API key is configured. */
export function hasAIKey(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

/** Lazy singleton OpenAI-compatible client targeting OpenRouter. */
export function getAIClient(): OpenAI {
  if (_client) return _client;

  const apiKey = process.env.OPENROUTER_API_KEY || "dummy";
  _client = new OpenAI({
    apiKey,
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "https://jobflow.ai",
      "X-Title": process.env.OPENROUTER_APP_NAME || "JobFlow AI",
    },
  });
  return _client;
}

/** Default chat-completion model. Override per-call when needed. */
export function getDefaultModel(): string {
  return process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
}

/** Default embedding model (OpenRouter routes this to OpenAI by default). */
export function getEmbeddingModel(): string {
  return process.env.OPENROUTER_EMBEDDING_MODEL || "openai/text-embedding-3-small";
}
