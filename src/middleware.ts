import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Helper to construct the absolute public site URL for redirects
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

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Auth-related pages that should be accessible without authentication
  const publicAuthPaths = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']
  const isAuthRoute = publicAuthPaths.includes(request.nextUrl.pathname)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  // If trying to access admin routes (except auth pages) and not authenticated, redirect to login
  if (isAdminRoute && !isAuthRoute && !user) {
    const redirectUrl = getAbsoluteUrl('/admin/login', request);
    return NextResponse.redirect(redirectUrl)
  }

  // If trying to access login/forgot-password page and already authenticated, redirect to admin dashboard
  // (reset-password is excluded so authenticated users can reset from recovery links)
  if ((request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/forgot-password') && user) {
    const redirectUrl = getAbsoluteUrl('/admin', request);
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
