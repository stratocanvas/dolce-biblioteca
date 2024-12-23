import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const episodeId = searchParams.get('episode_id')

  if (!episodeId) {
    return NextResponse.json({ error: 'Episode ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('bookmark')
    .select('id')
    .eq('episode_id', episodeId)
    .eq('user_id', user.id)
    .single()

  return NextResponse.json({ isBookmarked: !!data })
}

export async function POST(request: Request) {
  const { episode_id } = await request.json()

  if (!episode_id) {
    return NextResponse.json({ error: 'Episode ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: existingBookmark } = await supabase
    .from('bookmark')
    .select('id')
    .eq('episode_id', episode_id)
    .eq('user_id', user.id)
    .single()

  if (existingBookmark) {
    await supabase
      .from('bookmark')
      .delete()
      .eq('id', existingBookmark.id)
    return NextResponse.json({ isBookmarked: false })
  }

  await supabase
    .from('bookmark')
    .insert([{ episode_id, user_id: user.id }])
  return NextResponse.json({ isBookmarked: true })
} 