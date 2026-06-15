import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Auth confirmation route for Supabase email OTP verification.
 * Handles recovery type redirects to reset-password page.
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
 * Auth confirmation route for Supabase email OTP verification.
 * Handles recovery type redirects to reset-password page.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/admin";

  if (token_hash && type) {
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

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // For recovery type, redirect to reset-password page
      if (type === "recovery") {
        const resetPasswordUrl = getAbsoluteUrl('/admin/reset-password', request);
        return NextResponse.redirect(resetPasswordUrl);
      }
      
      const successUrl = getAbsoluteUrl(next, request);
      return NextResponse.redirect(successUrl);
    }
  }

  // Redirect to login with an error if verification fails
  const failureUrl = getAbsoluteUrl('/admin/login?error=verification_failed', request);
  return NextResponse.redirect(failureUrl);
}
