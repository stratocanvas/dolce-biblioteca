import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/my', '/my/bookmark', '/my/favourite', '/api/favourite', '/api/bookmark', '/api/last-read']

export async function updateSession(request: NextRequest) {
console.log('Middleware - Request URL:', request.url)

  const supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          supabaseResponse.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()


  // Check if the current path is a protected route
  const currentPath = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => currentPath === route || currentPath.startsWith(`${route}/`))

  // Redirect authenticated users away from login page
  if (session && request.nextUrl.pathname.startsWith('/login')) {
    const returnUrl = request.nextUrl.searchParams.get('next') || '/'
    return NextResponse.redirect(new URL(returnUrl, request.url))
  }

  // Redirect unauthenticated users to login for protected routes
  if (!session && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}