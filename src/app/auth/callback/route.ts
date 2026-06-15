import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Auth callback handler for Supabase Auth.
 * Handles email confirmation, password recovery, and OAuth redirects.
 * Supabase redirects here with a `code` param after email link clicks.
 */
function getAbsoluteUrl(path: string, request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    return `${siteUrl.replace(/\/$/, '')}${path}`;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}${path}`;
  }

  const origin = request.nextUrl.origin;
  if (origin.includes("0.0.0.0") || origin.includes("127.0.0.1") || origin.includes("localhost")) {
    return `https://jaffer-hassan.com${path}`;
  }

  return `${origin}${path}`;
}

/**
 * Auth callback handler for Supabase Auth.
 * Handles email confirmation, password recovery, and OAuth redirects.
 * Supabase redirects here with a `code` param after email link clicks.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Called from Server Component — safe to ignore
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(new URL(next, request.url));
      }
      
      const redirectUrl = getAbsoluteUrl(next, request);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If code exchange fails or no code, redirect to login with error
  const loginErrorUrl = getAbsoluteUrl('/admin/login?error=auth_callback_failed', request);
  return NextResponse.redirect(loginErrorUrl);
}
