'use client'
import { useState, useEffect, use } from 'react'
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
  Home,
  Sun,
  Moon,
  TreePine,
  Minus,
  Plus,
  ArrowDown,
  Bookmark,
} from 'lucide-react'
import Link from 'next/link'
import { AnimatedButton as Button } from '@/components/animated-button'
import { useScroll } from '@/hooks/use-scroll'

interface EpisodePageProps {
  params: {
    id: string
    episodeId: string
  }
}
import novel from '@/app/data/novel.json'
import episode from '@/app/data/episode.json'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
export default function EpisodeViewer({ params }: EpisodePageProps) {
  const unwrappedParams = use(params)
  const [fontSize, setFontSize] = useState(18)
  const [isResizing, setIsResizing] = useState(false)
  const [fontFamily, setFontFamily] = useState('sans')
  const { theme, setTheme } = useTheme()
  const [lastReadPercentage, setLastReadPercentage] = useState(0)

  const { isHeaderVisible, scrollProgress } = useScroll({
    isEpisodePage: true,
    isResizing,
  })

  useEffect(() => {
    const savedPercentage = localStorage.getItem(
      `lastRead-${unwrappedParams.episodeId}`,
    )
    if (savedPercentage) {
      setLastReadPercentage(Number(savedPercentage))
    }

    const saveInterval = setInterval(() => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const currentScrollY = window.scrollY
      const percentage =
        (currentScrollY / (documentHeight - windowHeight)) * 100

      setLastReadPercentage(percentage)
      localStorage.setItem(
        `lastRead-${unwrappedParams.episodeId}`,
        percentage.toString(),
      )
    }, 2000)

    return () => clearInterval(saveInterval)
  }, [unwrappedParams.episodeId])


  const handleFontSizeChange = (newSize: number) => {
    setIsResizing(true)
    setFontSize(newSize)
    setTimeout(() => setIsResizing(false), 200)
  }

  function renderParagraphs(content: string) {
    return content.split('\n').map((paragraph, index) => (
      <p
        key={`${index}-${paragraph.slice(0, 20)}`}
        className="font-medium leading-9 mb-4"
        style={{
          fontSize: `${fontSize}px`,
          fontFamily: `var(--font-${fontFamily})`,
        }}
      >
        {paragraph}
      </p>
    ))
  }

  return (
    <div className="bg-articleBackground">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{episode.title}</h1>
        </div>
        <div className="prose max-w-none mb-48">
          {renderParagraphs(episode.content)}
        </div>
        {bottomNavbar()}
      </div>
    </div>
  )

  function bottomNavbar() {
    return (
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm p-1 rounded-lg shadow-xl transition-transform duration-300 border border-zinc-200 dark:border-zinc-800 ${
          isHeaderVisible ? 'translate-y-0' : 'translate-y-24'
        }`}
      >
        <Button asChild variant="ghost" size="icon" shrink={0.9}>
          <Link href={`/novel/${novel.id}/episode/${novel.episodes[0].id}`}>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-6" />
        {episodeListViewer()}
        <Button variant="ghost" size="icon" shrink={0.9}>
          <Bookmark className="w-4 h-4" />
        </Button>
        {viewSettings()}
        <Separator orientation="vertical" className="h-6" />
        <Button asChild variant="ghost" size="icon" shrink={0.9}>
          <Link href={`/novel/${novel.id}/episode/${novel.episodes[1].id}`}>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    )

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
            <ScrollArea className="flex max-h-48 flex-col overflow-y-auto">
              <div className="flex flex-col gap-1 p-2">
                {novel.episodes.map((episode) => (
                  <Button
                    key={episode.id}
                    variant="ghost"
                    size="lg"
                    className="justify-start px-3 text-lg w-full"
                    shrink={0.97}
                  >
                    <div className="w-full flex items-center gap-2 overflow-hidden">
                      <p className="text-zinc-500 mr-2 font-bold">
                        {episode.no}
                      </p>
                      <p className="w-full overflow-hidden text-ellipsis text-left">
                        {episode.title}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
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
          <PopoverDrawerContent className="p-4">
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
            </div>
          </PopoverDrawerContent>
        </PopoverDrawer>
      )
    }
  }
}
