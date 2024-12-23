'use client'
import { useState, useEffect, useRef } from 'react'
import { Separator } from '@/components/ui/separator'
import {
  PopoverDrawer,
  PopoverDrawerTrigger,
  PopoverDrawerContent,
} from '@/components/popover-drawer'
import { useTheme } from 'next-themes'
import { ScrollArea } from '@/components/ui/scroll-area'
import NumberFlow from '@number-flow/react'
import {
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  Sun,
  Moon,
  TreePine,
  Minus,
  Plus,
  Bookmark,
} from 'lucide-react'
import Link from 'next/link'
import { AnimatedButton as Button } from '@/components/animated-button'
import { useScroll } from '@/hooks/use-scroll'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { motion, AnimatePresence } from 'framer-motion'
import { useNovel } from '@/hooks/use-novel'
import { Switch } from '@/components/ui/switch'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'
import type { Novel, Episode } from '@/app/api/novels/novel'

interface EpisodeViewerClientProps {
  novel: Omit<Novel, 'episode'> & {
    episode?: Episode[]
  }
  episodeId: string
  episode: string
  initialScrollPosition: number | null
}

async function getBookmarkStatus(episodeId: string, currentPath: string) {
  try {
    const response = await fetch(`/api/bookmark?episode_id=${episodeId}&next=${encodeURIComponent(currentPath)}`)
    if (response.redirected) {
      return false
    }
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data.isBookmarked
  } catch (error) {
    console.error('Error fetching bookmark status:', error)
    return false
  }
}

async function toggleBookmark(episodeId: string, currentPath: string) {
  const response = await fetch(`/api/bookmark?next=${encodeURIComponent(currentPath)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ episode_id: episodeId }),
  })
  if (response.redirected) {
    window.location.href = response.url
    return false
  }
  const data = await response.json()
  if (!response.ok) throw new Error(data.error)
  return data.isBookmarked
}

function useBookmark(episodeId: string) {
  const queryClient = useQueryClient()
  const pathname = usePathname()

  const { data: isBookmarked } = useQuery({
    queryKey: ['bookmark', episodeId],
    queryFn: () => getBookmarkStatus(episodeId, pathname),
  })

  const { mutate: toggleBookmarkMutation } = useMutation({
    mutationFn: () => toggleBookmark(episodeId, pathname),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['bookmark', episodeId] })
      const previousValue = queryClient.getQueryData(['bookmark', episodeId])
      queryClient.setQueryData(['bookmark', episodeId], (old: boolean) => !old)
      return { previousValue }
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(['bookmark', episodeId], context?.previousValue)
      toast.error(err instanceof Error ? err.message : '오류가 발생했습니다.')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark'] })
      queryClient.invalidateQueries({ queryKey: ['bookmarkedEpisodes'] })
    },
  })

  useEffect(() => {
    const handlePopState = () => {
      queryClient.invalidateQueries({ queryKey: ['bookmark'] })
      queryClient.invalidateQueries({ queryKey: ['bookmarkedEpisodes'] })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [queryClient])

  return {
    isBookmarked,
    toggleBookmark: () => toggleBookmarkMutation(),
  }
}

export function EpisodeViewerClient({
  novel: initialNovel,
  episodeId,
  episode,
  initialScrollPosition,
}: EpisodeViewerClientProps) {
  const { data: novel } = useNovel(initialNovel.novel_id, initialNovel)
  const [fontSize, setFontSize] = useState(18)
  const [isResizing, setIsResizing] = useState(false)
  const [fontFamily, setFontFamily] = useState('sans')
  const { theme, setTheme } = useTheme()
  const [showNextIndicator, setShowNextIndicator] = useState(false)
  const [pullProgress, setPullProgress] = useState(0)
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const bottomTriggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { isHeaderVisible } = useScroll({
    isEpisodePage: true,
    isResizing,
  })

  useEffect(() => {
    if (!novel) return;

    let scrollTimeout: NodeJS.Timeout
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        
        if (entry.isIntersecting && isAutoScroll) {
          setShowNextIndicator(true)
          // Calculate progress based on intersection ratio
          const progress = Math.min(100, Math.max(0, entry.intersectionRatio * 100))
          setPullProgress(progress)
          
          const nextEpisode = novel.episode
            ? [...novel.episode]
                .sort((a, b) => a.index - b.index)
                .find((ep) => ep.index === (episodeInfo?.index ?? 0) + 1)
            : null
          
          if (entry.intersectionRatio > 0.95 && nextEpisode) {
            clearTimeout(scrollTimeout)
            scrollTimeout = setTimeout(() => {
              window.location.href = `/novel/${novel.novel_id}/episode/${nextEpisode.episode_id}`
            }, 800)
          }
        } else {
          setShowNextIndicator(false)
          setPullProgress(0)
        }
      },
      {
        rootMargin: '50px',
        threshold: Array.from({ length: 20 }, (_, i) => i * 0.05)
      }
    )

    if (bottomTriggerRef.current) {
      observer.observe(bottomTriggerRef.current)
    }

    return () => {
      observer.disconnect()
      clearTimeout(scrollTimeout)
    }
  }, [novel, isAutoScroll])

  if (!novel) {
    return null
  }

  const episodeInfo = novel?.episode?.find(
    (ep: { episode_id: string }) =>
      Number.parseInt(ep.episode_id) === Number.parseInt(episodeId),
  )

  const sortedEpisodes = novel.episode
    ? [...novel.episode].sort((a, b) => a.index - b.index)
    : []
  const currentIndex = sortedEpisodes.findIndex(
    (ep) => ep.episode_id === episodeInfo?.episode_id,
  )
  const prevEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null
  const nextEpisode =
    currentIndex < sortedEpisodes.length - 1
      ? sortedEpisodes[currentIndex + 1]
      : null

  const handleFontSizeChange = (newSize: number) => {
    setIsResizing(true)
    setFontSize(newSize)
    setTimeout(() => setIsResizing(false), 200)
  }

  function renderParagraphs(content: string) {
    const paragraphs = content
      .replace(/\r\n/g, '\n')
      .split('\n\n')
      .filter((para) => para.trim() !== '')

    return paragraphs.map((paragraph, index) => (
      <p
        key={`${index}-${paragraph.slice(0, 20)}`}
        className="font-medium leading-9 mb-7"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: `var(--font-${fontFamily})`,
        }}
      >
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={`${index}-${lineIndex}-${line.slice(0, 20)}`}>
            {lineIndex > 0 && <br />}
            {line}
          </span>
        ))}
      </p>
    ))
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={episodeId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto p-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-24 mb-8 text-2xl font-bold mb-2"
          >
            {episodeInfo?.title}
          </motion.h1>
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="prose max-w-none mb-96"
          >
            {renderParagraphs(episode)}
          </motion.div>
          <div ref={bottomTriggerRef} className="h-24" />
          {bottomNavbar()}
        </div>
        {showNextIndicator && nextEpisode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 flex justify-center items-center z-50 pointer-events-none"
          >
            <div className="relative w-screen h-[2px]">
              <motion.div
                className="absolute h-full bg-zinc-800 dark:bg-zinc-200"
                initial={{ left: '50%', right: '50%' }}
                animate={{
                  left: `${50 - Math.min(50, pullProgress / 2)}%`,
                  right: `${50 - Math.min(50, pullProgress / 2)}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )

  function bottomNavbar() {
    const { isBookmarked, toggleBookmark } = useBookmark(episodeId)
    
    return (
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm p-1 rounded-lg shadow-xl transition-transform duration-300 border border-zinc-200 dark:border-zinc-800 ${
          isHeaderVisible ? 'translate-y-0' : 'translate-y-24'
        }`}
      >
        {prevEpisode ? (
          <Button
            asChild
            variant="ghost"
            size="icon"
            shrink={0.9}
          >
            <Link
              href={`/novel/${novel?.novel_id}/episode/${prevEpisode.episode_id}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            shrink={0.9}
            disabled
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
        <Separator orientation="vertical" className="h-6" />
        {episodeListViewer()}
        <Button 
          variant="ghost" 
          size="icon" 
          shrink={0.9}
          onClick={() => toggleBookmark()}
          className={isBookmarked ? 'text-current' : ''}
        >
          <Bookmark className={isBookmarked ? 'fill-current' : ''} />
        </Button>
        {viewSettings()}
        <Separator orientation="vertical" className="h-6" />
        {nextEpisode ? (
          <Button
            asChild
            variant="ghost"
            size="icon"
            shrink={0.9}
          >
            <Link
              href={`/novel/${novel?.novel_id}/episode/${nextEpisode.episode_id}`}
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            shrink={0.9}
            disabled
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  function episodeListViewer() {
    return (
      <PopoverDrawer className="w-full">
        <PopoverDrawerTrigger>
          <Button variant="ghost" size="icon" shrink={0.9}>
            <List className="w-4 h-4" />
          </Button>
        </PopoverDrawerTrigger>
        <PopoverDrawerContent className="flex flex-col md:max-w-96">
          <h3 className="text-xl font-bold mb-2 p-4">회차 목록</h3>
          <div className="relative">
            <ScrollArea className="flex max-h-60 flex-col overflow-y-auto">
              <div className="flex flex-col gap-1 p-2">
                {sortedEpisodes.map((ep) => (
                  <Button
                    key={ep.episode_id}
                    asChild
                    variant="ghost"
                    size="lg"
                    className={`justify-start px-3 text-lg w-full ${
                      ep.episode_id === episodeInfo?.episode_id ? 'bg-accent' : ''
                    }`}
                    shrink={0.97}
                  >
                    <Link
                      href={`/novel/${novel?.novel_id}/episode/${ep.episode_id}`}
                    >
                      <div className="w-full flex items-center gap-2 overflow-hidden">
                        <p className="text-zinc-500 mr-2 font-bold">{ep.index}</p>
                        <p className="w-full overflow-hidden text-ellipsis text-left">
                          {ep.title}
                        </p>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-zinc-50 dark:from-zinc-900 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 to-transparent pointer-events-none" />
          </div>
        </PopoverDrawerContent>
      </PopoverDrawer>
    )
  }

  function viewSettings() {
    return (
      <PopoverDrawer>
        <PopoverDrawerTrigger>
          <Button variant="ghost" size="icon" shrink={0.9}>
            <Settings className="w-4 h-4" />
          </Button>
        </PopoverDrawerTrigger>
        <PopoverDrawerContent className="p-6">
          <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold mb-2">설정</h3>
            <div className="flex justify-between items-center">
              <p className="text-md font-medium">글꼴</p>
              <ToggleGroup
                type="single"
                variant="outline"
                value={fontFamily}
                onValueChange={(value) => {
                  if (value) setFontFamily(value)
                }}
              >
                <ToggleGroupItem value="sans" aria-label="Toggle sans-serif">
                  고딕
                </ToggleGroupItem>
                <ToggleGroupItem value="serif" aria-label="Toggle serif">
                  명조
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-md font-medium">글자 크기</p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFontSizeChange(fontSize - 1)}
                  shrink={0.9}
                  disabled={fontSize <= 6}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <NumberFlow
                  className="font-medium w-4 text-center"
                  value={fontSize}
                  transformTiming={{
                    easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
                    duration: 750,
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFontSizeChange(fontSize + 1)}
                  shrink={0.9}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-md font-medium">테마</p>
              <ToggleGroup
                type="single"
                variant="outline"
                value={theme}
                onValueChange={(value) => {
                  if (value) {
                    document.documentElement.classList.remove(
                      'light',
                      'dark',
                      'forest',
                    )
                    setTheme(value)
                  }
                }}
              >
                <ToggleGroupItem value="light" aria-label="Toggle light">
                  <Sun className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Toggle dark">
                  <Moon className="w-4 h-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="forest" aria-label="Toggle forest">
                  <TreePine className="w-4 h-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-md font-medium">정주행 모드</p>
              <Switch
                checked={isAutoScroll}
                onCheckedChange={setIsAutoScroll}
              />
            </div>
          </div>
        </PopoverDrawerContent>
      </PopoverDrawer>
    )
  }
}
