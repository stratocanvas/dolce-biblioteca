import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const novelId = searchParams.get('novel_id')
  const episodeId = searchParams.get('episode_id')

  if (!novelId && !episodeId) {
    return NextResponse.json({ error: 'Either Novel ID or Episode ID is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ lastRead: null, readEpisodes: [] })
  }

  if (episodeId) {
    // Get specific episode's last read position
    const { data: lastRead } = await supabase
      .from('last_read')
      .select('scroll_position')
      .eq('user_id', user.id)
      .eq('episode_id', episodeId)
      .single()

    return NextResponse.json({ scroll_position: lastRead?.scroll_position || null })
  }

  // Get all read episodes for this novel, ordered by timestamp
  const { data: readEpisodes } = await supabase
    .from('last_read')
    .select(`
      episode_id,
      timestamp,
      episode!inner (
        episode_id,
        index,
        title,
        novel_id
      )
    `)
    .eq('user_id', user.id)
    .eq('episode.novel_id', novelId)
    .order('timestamp', { ascending: false })

  if (!readEpisodes || readEpisodes.length === 0) {
    return NextResponse.json({ lastRead: null, readEpisodes: [] })
  }

  // First episode is the last read (since we ordered by timestamp desc)
  const lastRead = readEpisodes[0]

  return NextResponse.json({ 
    lastRead: {
      episode_id: lastRead.episode.episode_id,
      index: lastRead.episode.index,
      title: lastRead.episode.title,
      timestamp: lastRead.timestamp
    },
    readEpisodes: readEpisodes.map(ep => ({
      episode_id: ep.episode_id,
      timestamp: ep.timestamp
    }))
  })
}

export async function POST(request: Request) {
  const { episode_id, scroll_position } = await request.json()

  if (!episode_id || typeof scroll_position !== 'number') {
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
  }

  // Don't save if scroll position is over 95%
  if (scroll_position > 95) {
    return NextResponse.json({ success: true })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: existingRecord } = await supabase
    .from('last_read')
    .select('id')
    .eq('episode_id', episode_id)
    .eq('user_id', user?.id)
    .single()

  if (existingRecord) {
    await supabase
      .from('last_read')
      .update({ 
        scroll_position,
        timestamp: Math.floor(Date.now() / 1000)
      })
      .eq('id', existingRecord.id)
  } else {
    await supabase
      .from('last_read')
      .insert([{ 
        episode_id, 
        user_id: user?.id,
        scroll_position,
        timestamp: Math.floor(Date.now() / 1000)
      }])
  }

  return NextResponse.json({ success: true })
} 