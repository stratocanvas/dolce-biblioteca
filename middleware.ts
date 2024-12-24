import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // For API routes, only apply middleware on POST requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    if (request.method !== 'POST') {
      return NextResponse.next()
    }
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/my/:path*',
    '/login',
    '/api/bookmark',
    '/api/favourite',
    '/api/last-read',
    '/api/delete-user'
  ],
}