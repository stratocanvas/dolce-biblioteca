import { type NextRequest, NextResponse } from 'next/server'
import { getNovels, searchNovels } from '@/app/api/novels/novel'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get('page') || '1')
  const query = searchParams.get('q')
  
  try {
    if (query) {
      const result = await searchNovels(query, page)
      return NextResponse.json(result)
    }
      const result = await getNovels(page)
      return NextResponse.json(result)
    
  } catch (error) {
    console.error('Error fetching novels:', error)
    return NextResponse.json(
      { error: 'Failed to fetch novels' },
      { status: 500 }
    )
  }
} 