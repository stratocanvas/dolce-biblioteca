import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // API 요청이 아닌 경우나 GET 요청은 바로 처리
  if (!request.nextUrl.pathname.startsWith('/api/') || request.method !== 'POST') {
    return await updateSession(request)
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/my/:path*',
    '/login',
    '/api/bookmark',
    '/api/favourite',
    '/api/delete-user'
  ],
}