import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/my', '/my/bookmark', '/my/favourite', '/api/favourite', '/api/bookmark', '/api/last-read']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          supabaseResponse = NextResponse.next({
            request,
          })
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect authenticated users away from login page
  if (user && request.nextUrl.pathname.startsWith('/login')) {
    // Get the 'next' parameter or default to '/'
    const returnUrl = request.nextUrl.searchParams.get('next') || '/'
    return NextResponse.redirect(new URL(returnUrl, request.url))
  }

  // Only redirect to login for protected routes
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (
    !user &&
    isProtectedRoute &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, redirect to login page with return URL
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    
    // For API routes, use the 'next' query parameter if provided
    const nextPath = request.nextUrl.pathname.startsWith('/api/')
      ? request.nextUrl.searchParams.get('next')
      : request.nextUrl.pathname
      
    if (nextPath) {
      url.searchParams.set('next', nextPath)
    }
    
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}