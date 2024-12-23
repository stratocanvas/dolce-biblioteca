'use client'

import { EpisodeViewerClient } from './viewer'
import { NovelHeader } from '@/components/novel-header'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useScroll } from '@/hooks/use-scroll'
import { Skeleton } from '@/components/ui/skeleton'
import { useSidebar } from '@/components/ui/sidebar'
import { createClient } from '@/utils/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'es-toolkit'
import type { Novel as APINovel, Episode } from '@/app/api/novels/novel'

const supabase = createClient()

async function getLastReadPosition(episodeId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const response = await fetch(`/api/last-read?episode_id=${episodeId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data.scroll_position
  } catch (error) {
    console.error('Error fetching last read position:', error)
    return null
  }
}

async function saveLastReadPosition(episodeId: string, scrollPosition: number, queryClient: any) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const response = await fetch('/api/last-read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        episode_id: episodeId,
        scroll_position: scrollPosition,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to save last read position')
    }

    // Only invalidate readEpisodes to update the episode list UI
    // Don't invalidate lastRead to prevent scroll jumping
    queryClient.invalidateQueries({ queryKey: ['readEpisodes'] })
  } catch (error) {
    console.error('Error saving last read position:', error)
  }
}

interface Novel extends Omit<APINovel, 'episode'> {
  episode?: Episode[]
}

interface EpisodePageProps {
  novel: Novel
  episodeId: string
}

interface EpisodeContentProps extends EpisodePageProps {
  episode: string
}

export function EpisodeHeader({ novel, episodeId }: EpisodePageProps) {
  const { setOpen } = useSidebar()
  const queryClient = useQueryClient()
  const lastSavedRef = useRef<number>(0)
  
  useEffect(() => {
    setOpen(false)
  }, [setOpen])
  
  const [isResizing] = useState(false)
  const { isHeaderVisible, showHeaderButton, scrollProgress } = useScroll({
    isEpisodePage: true,
    isResizing,
  })

  // Save scroll position with debounce and threshold
  const saveScrollPosition = useCallback(
    debounce((progress: number) => {
      // Only save if progress is valid, not near the end, and significantly different from last saved
      if (
        progress > 0 && 
        progress < 95 && 
        Math.abs(progress - lastSavedRef.current) > 1 // Only save if changed by more than 5%
      ) {
        lastSavedRef.current = progress
        saveLastReadPosition(episodeId, Math.floor(progress), queryClient)
      }
    }, 500), // Increased debounce time to 2 seconds
    [episodeId, queryClient]
  )

  // Update scroll position when progress changes
  useEffect(() => {
    // Only save if we have meaningful progress
    if (scrollProgress > 0) {
      saveScrollPosition(scrollProgress)
    }

    // Cleanup
    return () => {
      saveScrollPosition.cancel()
    }
  }, [scrollProgress, saveScrollPosition])

  const episodeInfo = novel?.episode?.find(
    (ep) => Number.parseInt(ep.episode_id) === Number.parseInt(episodeId),
  )

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <NovelHeader
        novel={novel}
        episode={episodeInfo}
        isVisible={isHeaderVisible}
        showHeaderButton={showHeaderButton}
        isEpisodePage={true}
      />
    </div>
  )
}

export function EpisodeContent({
  novel,
  episodeId,
  episode,
}: EpisodeContentProps) {
  const queryClient = useQueryClient()
  const initialLoadRef = useRef(true)
  const { data: lastReadPosition } = useQuery({
    queryKey: ['lastRead', episodeId],
    queryFn: () => getLastReadPosition(episodeId),
  })

  // Add event listener for popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      queryClient.invalidateQueries({ queryKey: ['lastRead'] })
      queryClient.invalidateQueries({ queryKey: ['readEpisodes'] })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [queryClient])

  // Ensure scroll position is restored only on initial load
  useEffect(() => {
    if (initialLoadRef.current && lastReadPosition && lastReadPosition < 95) {
      // First scroll to top instantly to prevent any visual jumps
      window.scrollTo({ top: 0, behavior: 'instant' })

      // Then use RAF to ensure DOM is ready and scroll smoothly
      requestAnimationFrame(() => {
        // Add a small delay to ensure content is rendered and measurements are accurate
        setTimeout(() => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrollPosition = (scrollHeight * lastReadPosition) / 100
          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
          })
          initialLoadRef.current = false
        }, 100)
      })
    }
  }, [lastReadPosition])

  return (
    <EpisodeViewerClient
      novel={novel}
      episodeId={episodeId}
      episode={episode}
      initialScrollPosition={lastReadPosition}
    />
  )
}

export function EpisodeLoading() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 h-screen">
      {/* 에피소드 제목 스켈레톤 */}
      <div className="mt-24 mb-6">
        <Skeleton className="h-8 w-3/4 bg-muted-foreground/20" />
      </div>

      {/* 에피소드 본문 스켈레톤 */}
      <div className="flex flex-col gap-4">
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-11/12 mb-4 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-10/12 mb-4 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-9/12 mb-4 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-11/12 mb-4 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
        <Skeleton className="h-4 w-10/12 mb-4 bg-muted-foreground/20" />
        <Skeleton className="h-4 w-full bg-muted-foreground/20" />
      </div>
    </div>
  )
}
