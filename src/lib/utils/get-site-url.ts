import { headers } from "next/headers";

/**
 * Dynamically resolves the site URL from incoming request headers.
 * Works automatically in both development (localhost) and production (Vercel/custom domain).
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL env var (if explicitly set)
 * 2. Vercel's auto-set NEXT_PUBLIC_VERCEL_URL (preview/production)
 * 3. Request host header (dynamic — always matches the actual domain)
 * 4. Fallback to localhost
 */
export async function getSiteUrl(): Promise<string> {
  // If explicitly set, always use it
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Try to detect from request headers (works in both Server Actions and Route Handlers)
  try {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") || headersList.get("host");
    if (host) {
      const protocol = headersList.get("x-forwarded-proto") || "https";
      return `${protocol}://${host}`;
    }
  } catch {
    // headers() may throw if called outside request context
  }

  // Vercel auto-sets this on deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Ultimate fallback
  return "http://localhost:3000";
}
