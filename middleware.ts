import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/portal/login', '/portal/verify', '/admin/login', '/admin/verify']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always refresh the session cookie (required by @supabase/ssr)
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Use getSession() in middleware — avoids a live network call to Supabase
  // (getUser() makes a server round-trip which is unreliable on Edge)
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  // Not authenticated → redirect to login
  if (!user && !isPublic) {
    const loginUrl = pathname.startsWith('/admin')
      ? new URL('/admin/login', request.url)
      : new URL('/portal/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Already authenticated and hitting a login page → redirect to dashboard
  if (user && isPublic) {
    const dashUrl = pathname.startsWith('/admin')
      ? new URL('/admin', request.url)
      : new URL('/portal/settings', request.url)
    return NextResponse.redirect(dashUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*'],
}
