import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedRoutes = ['/my', '/my/bookmark', '/my/favourite', '/api/favourite', '/api/bookmark', '/api/last-read']

export async function updateSession(request: NextRequest) {
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

  const currentPath = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => currentPath === route || currentPath.startsWith(`${route}/`))
  const next = request.nextUrl.searchParams.get('next') || '/'

  // 로그인된 사용자가 로그인 페이지 접근시 리다이렉트
  if (session && currentPath.startsWith('/login')) {
    return NextResponse.redirect(new URL(next, request.url))
  }

  // 인증되지 않은 사용자의 보호된 경로 접근 처리
  if (!session && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', next)
    
    // API 요청의 경우 401 반환
    if (currentPath.startsWith('/api/')) {
      return NextResponse.redirect(loginUrl)
    }
    
    // 일반 페이지의 경우 로그인 페이지로 리다이렉트
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}