import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/portal/login', '/portal/verify', '/admin/login', '/admin/verify']

// Home page language: Dutch lives at `/`, English at `/en`. A visitor's explicit choice (cookie set by the
// nav switcher) wins; otherwise a first-time visitor whose device prefers another language than Dutch is
// sent to English. Requests without a language header (crawlers) always get the Dutch page.
function homeLanguageRedirect(request: NextRequest) {
  const choice = request.cookies.get('lang')?.value
  let english = choice === 'en'
  if (choice !== 'en' && choice !== 'nl') {
    const header = request.headers.get('accept-language')
    if (header) {
      const prefs = header.split(',')
        .map((part) => {
          const [tag, q] = part.trim().split(';q=')
          return { lang: tag.toLowerCase().split('-')[0], q: q === undefined ? 1 : Number(q) || 0 }
        })
        .sort((a, b) => b.q - a.q)
      const first = prefs.find((p) => p.lang === 'nl' || p.lang === 'en')
      english = first ? first.lang === 'en' : true
    }
  }
  return english ? NextResponse.redirect(new URL('/en', request.url)) : NextResponse.next()
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') return homeLanguageRedirect(request)

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

  // Already authenticated and hitting a login page → redirect to dashboard.
  // Verify the session first: getSession() only reads the cookie, so a session revoked
  // server-side (e.g. signed out elsewhere) would bounce login ↔ dashboard forever.
  if (user && isPublic) {
    const { data: { user: verified } } = await supabase.auth.getUser()
    if (!verified) return supabaseResponse
    const dashUrl = pathname.startsWith('/admin')
      ? new URL('/admin', request.url)
      : new URL('/portal/settings', request.url)
    return NextResponse.redirect(dashUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/', '/portal/:path*', '/admin/:path*'],
}
