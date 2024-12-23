import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LibraryClient } from './client'

export const dynamic = 'force-dynamic'

interface RawNovel {
  novel_id: string
  title: string
  author: string
  tags: string[]
}

interface RawEpisode {
  episode_id: string
  title: string
  index: number
  novel_id: string
  novel: RawNovel
}

interface RawLastRead {
  episode_id: string
  scroll_position: number
  timestamp: number
  episode: RawEpisode
}

interface RawBookmark {
  id: string
  episode: {
    episode_id: string
    title: string
    index: number
    novel: RawNovel
  }
}

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's favourited novels with novels data
  const { data: favourites, error } = await supabase
    .from('favourite')
    .select(`
      novel_id,
      novel (
        novel_id,
        title,
        author,
        tags
      )
    `)
    .eq('user_id', user.id)

  // Fetch user's bookmarked episodes with novel data
  const { data: bookmarksRaw, error: bookmarkError } = await supabase
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
          author,
          tags
        )
      )
    `)
    .eq('user_id', user.id)

  // Transform bookmarks data
  const validBookmarksRaw = (bookmarksRaw as any[])?.filter(b => 
    b?.episode?.novel?.novel_id && 
    b?.episode?.title
  ) as RawBookmark[]

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
      author: novel.author,
      tags: novel.tags || [],
      episodes: [episode]
    }]
  }, [] as BookmarkedNovel[])

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
          author,
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
  ) as RawLastRead[]

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
        author: l.episode.novel.author,
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
      author: novel.author,
      tags: novel.tags || [],
      cover_url: '',
    }]
  }, [] as RecentlyRead[])

  // Filter out any null relationships and transform data
  const validFavourites = (favourites as any[])?.filter(f => 
    f?.novel?.novel_id && 
    f?.novel?.title
  ).map(f => ({
    novel_id: f.novel_id,
    novel: {
      id: f.novel.novel_id,
      title: f.novel.title,
      author: f.novel.author,
      tags: f.novel.tags || [],
      cover_url: '',
    }
  })) || []
  
  return (
    <LibraryClient 
      favourites={validFavourites}
      bookmarks={bookmarks}
      lastRead={lastRead}
      recentlyRead={recentlyRead}
    />
  )
}

// Types for transformed data
interface BookmarkedNovel {
  novel_id: string
  title: string
  author: string
  tags: string[]
  episodes: {
    episode_id: string
    title: string
    index: number
    bookmark_id: string
  }[]
}

interface RecentlyRead {
  id: string
  title: string
  author: string
  tags: string[]
  cover_url: string
} 