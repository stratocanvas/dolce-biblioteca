import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // Fetch user's favourited novels with novels data
  const { data: favourites } = await supabase
    .from('favourite')
    .select(`
      novel_id,
      novel (
        novel_id,
        title,
        author(name),
        tags
      )
    `)
    .eq('user_id', user.id)

  // Fetch user's bookmarked episodes with novel data
  const { data: bookmarksRaw } = await supabase
    .from('bookmark')
    .select(`
      id,
      episode!inner (
        episode_id,
        title,
        index,
        novel!inner (
          novel_id,
          title,
          author(name),
          tags
        )
      )
    `)
    .eq('user_id', user.id)
  // Transform bookmarks data
  const validBookmarksRaw = (bookmarksRaw as any[])?.filter(b => 
    b?.episode?.novel?.novel_id && 
    b?.episode?.title
  )

  const bookmarks = validBookmarksRaw.reduce((acc, bookmark) => {
    const novel = bookmark.episode.novel
    const episode = {
      episode_id: bookmark.episode.episode_id,
      title: bookmark.episode.title,
      index: bookmark.episode.index,
      bookmark_id: bookmark.id
    }
    
    const existingNovel = acc.find(n => n.novel_id === novel.novel_id)
    if (existingNovel) {
      existingNovel.episodes.push(episode)
      return acc
    }

    return [...acc, {
      novel_id: novel.novel_id,
      title: novel.title,
      author: novel.author.name,
      tags: novel.tags || [],
      episodes: [episode]
    }]
  }, [] as any[])

  // Fetch user's read novels and last read episodes
  const { data: lastReadRaw } = await supabase
    .from('last_read')
    .select(`
      episode_id,
      scroll_position,
      timestamp,
      episode (
        episode_id,
        title,
        index,
        novel_id,
        novel (
          novel_id,
          title,
          author(name),
          tags
        )
      )
    `)
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })

  // Get the most recent read episode for "Continue Reading"
  const validLastRead = (lastReadRaw as any[])?.filter(l => 
    l?.episode?.novel?.novel_id && 
    l?.episode?.novel?.title && 
    l?.episode?.title
  )

  const lastRead = validLastRead.map(l => ({
    episode_id: l.episode_id,
    scroll_position: l.scroll_position,
    timestamp: l.timestamp,
    episode: {
      episode_id: l.episode.episode_id,
      title: l.episode.title,
      index: l.episode.index,
      novel_id: l.episode.novel_id,
      novel: {
        id: l.episode.novel.novel_id,
        title: l.episode.novel.title,
        author: l.episode.novel.author.name,
        tags: l.episode.novel.tags || [],
        cover_url: '',
      }
    }
  }))

  // Process lastRead to get unique novels for "Recently Read"
  const recentlyRead = validLastRead.reduce((acc, read) => {
    const novel = read.episode.novel
    if (acc.some(n => n.id === novel.novel_id)) return acc
    
    return [...acc, {
      id: novel.novel_id,
      title: novel.title,
      author: novel.author.name,
      tags: novel.tags || [],
      cover_url: '',
    }]
  }, [] as any[])

  // Filter out any null relationships and transform data
  const validFavourites = (favourites as any[])?.filter(f => 
    f?.novel?.novel_id && 
    f?.novel?.title
  ).map(f => ({
    novel_id: f.novel_id,
    novel: {
      id: f.novel.novel_id,
      title: f.novel.title,
      author: f.novel.author.name,
      tags: f.novel.tags || [],
      cover_url: '',
    }
  })) || []

  return NextResponse.json({
    favourites: validFavourites,
    bookmarks,
    lastRead,
    recentlyRead,
  })
} 