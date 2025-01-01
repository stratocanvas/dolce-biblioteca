'use client'

import { AnimatedButton as Button } from '@/components/animated-button'
import { ChevronLeft, Heart, BookOpen, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { MarqueeText } from '@/components/marquee-text'
import { useRouter, usePathname } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

async function getFavouriteStatus(novelId: string, currentPath: string) {
  try {
    const response = await fetch(`/api/favourite?novel_id=${novelId}&next=${encodeURIComponent(currentPath)}`)
    if (response.redirected) {
      return false
    }
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data.isFavourited
  } catch (error) {
    console.error('Error fetching favourite status:', error)
    return false
  }
}

async function toggleFavourite(novelId: string, currentPath: string) {
  const response = await fetch(`/api/favourite?next=${encodeURIComponent(currentPath)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ novel_id: novelId }),
  })
  if (response.redirected) {
    window.location.href = response.url
    return false
  }
  const data = await response.json()
  if (!response.ok) throw new Error(data.error)
  return data.isFavourited
}

async function getLastReadEpisode(novelId: string) {
  try {
    const response = await fetch(`/api/last-read?novel_id=${novelId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data.lastRead
  } catch (error) {
    console.error('Error fetching last read episode:', error)
    return null
  }
}

function useFavourite(novelId: string) {
  const queryClient = useQueryClient()
  const pathname = usePathname()

  const { data: isFavourited } = useQuery({
    queryKey: ['favourite', novelId],
    queryFn: () => getFavouriteStatus(novelId, pathname),
  })

  const { mutate: toggleFavouriteMutation } = useMutation({
    mutationFn: () => toggleFavourite(novelId, pathname),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['favourite', novelId] })
      const previousValue = queryClient.getQueryData(['favourite', novelId])
      queryClient.setQueryData(['favourite', novelId], (old: boolean) => !old)
      return { previousValue }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['favourite', novelId], context?.previousValue)
      toast.error(err instanceof Error ? err.message : '오류가 발생했습니다.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favourite', novelId] })
    },
  })

  return {
    isFavourited,
    toggleFavourite: () => toggleFavouriteMutation(),
  }
}

interface NovelHeaderProps {
  novel: {
    novel_id: string
    title: string
    author: string
    episode?: {
      episode_id: string
      title: string
      index: number
    }[]
  }
  episode?: {
    episode_id: string
    title: string
    index: number
  }
  isVisible: boolean
  showHeaderButton: boolean
  isEpisodePage: boolean
}

export function NovelHeader({
  novel,
  episode,
  isVisible,
  showHeaderButton,
  isEpisodePage,
}: NovelHeaderProps) {
  const router = useRouter()

  if (!novel?.novel_id || !novel?.title) {
    return null
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="absolute inset-0 h-[100px] bg-gradient-to-b from-articleBackground/98 from-50% via-articleBackground/95 via-80% to-articleBackground/0 to-100% pointer-events-none" />
      <div className="absolute inset-0 h-[100px] backdrop-blur-xl mask-gradient pointer-events-none" />
      <div className="relative">
        <div className="flex items-center max-w-4xl mx-auto px-6 py-4 gap-1 pointer-events-auto">
          <Button
            variant="ghost"
            size="icon"
            shrink={0.9}
            onClick={() => {
              if (isEpisodePage) {
                router.push(`/novel/${novel.novel_id}`)
              } else {
                router.push('/novel')
              }
            }}
          >
            <ChevronLeft />
          </Button>

          <div className="flex-1 h-[42px] text-ellipsis overflow-hidden items-center">
            <NovelInfo
              novel={novel}
              showHeaderButton={showHeaderButton}
              isEpisodePage={isEpisodePage}
              episode={episode}
            />
          </div>

          <NovelActions
            novel={novel}
            showHeaderButton={showHeaderButton}
            isEpisodePage={isEpisodePage}
          />
        </div>
      </div>
    </div>
  )
}

function NovelInfo({
  novel,
  showHeaderButton,
  isEpisodePage,
  episode,
}: Pick<
  NovelHeaderProps,
  'novel' | 'showHeaderButton' | 'isEpisodePage' | 'episode'
>) {
  const buttonVisibility = isEpisodePage ? true : showHeaderButton

  const displayTitle =
    isEpisodePage && episode
      ? `${episode.title}`
      : novel.title

  return (
    <div
      className={`text-ellipsis overflow-hidden px-3 transition-all duration-300 ${
        buttonVisibility
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="relative">
          <div className="transition-transform duration-300 text-left">
            <MarqueeText text={displayTitle} className="text-lg font-medium" />
            <p className="text-sm text-muted-foreground font-medium -mt-1">
              {isEpisodePage ? novel.title : novel.author}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NovelActions({
  novel,
  showHeaderButton,
  isEpisodePage,
}: Pick<NovelHeaderProps, 'novel' | 'showHeaderButton' | 'isEpisodePage'>) {
  const { isFavourited, toggleFavourite } = useFavourite(novel.novel_id)
  const { data: lastReadEpisode, isLoading: isLastReadLoading } = useQuery({
    queryKey: ['lastRead', novel.novel_id],
    queryFn: () => getLastReadEpisode(novel.novel_id),
  })

  if (!novel?.episode) {
    return null
  }

  const firstEpisode =
    novel.episode.find((ep) => ep.index === 1) || novel.episode[0]
  const targetEpisode = lastReadEpisode || firstEpisode
  const isLastRead = lastReadEpisode !== null

  if (!isEpisodePage && targetEpisode) {
    return (
      <>
        <div className="flex-none">
          <div
            className={`transition-all duration-300 ${
              showHeaderButton
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            <Button
              asChild
              variant="default"
              size="sm"
              shrink={0.95}
              className="rounded-full"
            >
              <Link
                href={`/novel/${novel.novel_id}/episode/${isLastReadLoading ? firstEpisode.episode_id : (targetEpisode.episode_id || firstEpisode.episode_id)}`}
              >
                {isLastReadLoading ? (
                  <BookOpen className="w-4 h-4" />
                ) : isLastRead ? (
                  <RotateCcw className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
                {isLastReadLoading ? (
                  '1화'
                ) : isLastRead ? (
                  `${targetEpisode.index}화`
                ) : (
                  '1화'
                )}
              </Link>
            </Button>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          shrink={0.95}
          onClick={() => toggleFavourite()}
          className={isFavourited ? 'text-current' : ''}
        >
          <Heart className={isFavourited ? 'fill-current' : ''} />
        </Button>
      </>
    )
  }

  return null
}
