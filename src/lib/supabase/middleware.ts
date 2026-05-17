import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Optional: Redirect logged-in users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/forgot-password"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Server-side Onboarding Check (Optimized with Cookie Cache)
  if (user && request.nextUrl.pathname.startsWith("/dashboard")) {
    const isOnboardingPage = request.nextUrl.pathname === "/dashboard/onboarding";
    const hasOnboardedCookie = request.cookies.get("jobflow_onboarded")?.value === "true";

    // 1. Fast Path: Skip DB query if cached
    if (hasOnboardedCookie) {
      if (isOnboardingPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
    } else {
      // 2. Slow Path: Check DB if cookie is missing
      const { data: profile } = await supabase
        .from("profiles")
        .select("completed_onboarding")
        .eq("id", user.id)
        .single();

      if (profile && !profile.completed_onboarding && !isOnboardingPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard/onboarding";
        const redirectRes = NextResponse.redirect(url);
        // Explicitly wipe the cookie just in case
        redirectRes.cookies.set("jobflow_onboarded", "false", { path: "/" });
        return redirectRes;
      }

      if (profile && profile.completed_onboarding) {
        // Cache success in cookie to prevent future DB hits
        supabaseResponse.cookies.set("jobflow_onboarded", "true", {
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year cache
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });

        if (isOnboardingPage) {
          const url = request.nextUrl.clone();
          url.pathname = "/dashboard";
          const redirectRes = NextResponse.redirect(url);
          // Apply cookie directly to redirect payload so it doesn't get lost
          redirectRes.cookies.set("jobflow_onboarded", "true", {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
          });
          return redirectRes;
        }
      }
    }
  }

  return supabaseResponse;
}
