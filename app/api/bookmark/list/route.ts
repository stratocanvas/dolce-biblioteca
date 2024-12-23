import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ episodes: [] })
  }

  // Get all bookmarked episodes for this novel
  const { data: bookmarkedEpisodes } = await supabase
    .from('bookmark')
    .select(`
      episode_id,
      episode!inner (
        episode_id,
        novel_id
      )
    `)
    .eq('user_id', user.id)

  if (!bookmarkedEpisodes) {
    return NextResponse.json({ episodes: [] })
  }

  return NextResponse.json({ 
    episodes: bookmarkedEpisodes.map(ep => ({
      episode_id: ep.episode_id
    }))
  })
} 