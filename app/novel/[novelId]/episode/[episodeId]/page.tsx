'use client'
import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import Link from 'next/link'
import { AnimatedButton as Button } from '@/components/animated-button'
interface EpisodePageProps {
  params: {
    id: string // novel id
    episodeId: string
  }
}
import novel from '@/app/data/novel.json'
import episode from '@/app/data/episode.json'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
export default function EpisodeViewer({ params }: EpisodePageProps) {
  const [fontSize, setFontSize] = useState(18)
  const [isResizing, setIsResizing] = useState(false)
  const [fontFamily, setFontFamily] = useState('sans')
  const { theme, setTheme } = useTheme()
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleFontSizeChange = (newSize: number) => {
    setIsResizing(true)
    setFontSize(newSize)
    setTimeout(() => setIsResizing(false), 200)
  }
  const [scrollProgress, setScrollProgress] = useState(0)
  const [lastReadPercentage, setLastReadPercentage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (isResizing) return

      const currentScrollY = window.scrollY
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const progress = (currentScrollY / (documentHeight - windowHeight)) * 100
      setScrollProgress(progress)

      if (currentScrollY > lastScrollY) {
        setIsHeaderVisible(false)
      } else {
        setIsHeaderVisible(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isResizing])

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

  const scrollToLastPosition = () => {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const targetPosition =
      ((documentHeight - windowHeight) * lastReadPercentage) / 100

    // Adjust scroll position up by 10% of viewport height for mobile
    const isMobile = window.innerWidth <= 768
    const mobileOffset = isMobile ? windowHeight * 0.1 : 0

    window.scrollTo({
      top: Math.max(0, targetPosition - mobileOffset), // Prevent negative scroll
      behavior: 'smooth',
    })
  }

  return (
    <div className="bg-articleBackground">
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div
        className={`sticky top-0 z-50 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center max-w-4xl mx-auto px-6 py-4">
          <div className="flex-none">
            <Button variant="ghost" size="icon" shrink={0.9}>
              <Home className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <Button
              asChild
              variant="link"
              size="lg"
              className="px-3"
              shrink={0.95}
            >
              <Link href={`/novel/${novel.id}`}>
                <h2 className="text-lg font-medium truncate">
                  {novel.title}
                </h2>
              </Link>
            </Button>
          </div>
          <div className="flex-none w-[40px]" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-6 mt-8 xl:mt-16 xl:px-16">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{episode.title}</h1>
        </div>
        {/*
        <div className="prose max-w-none mb-48">
          <p
            className="whitespace-pre-line font-medium leading-9"
            style={{
              fontSize: `${fontSize}px`,
              fontFamily: `var(--font-${fontFamily})`,
            }}
          >
            {episode.content}
          </p>
        </div>
        */}
        <div className="prose max-w-none mb-48">
          {episode.content.split('\n').map((paragraph, index) => (
            <p
              key={index}
              className="font-medium leading-9 mb-4"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: `var(--font-${fontFamily})`,
              }}
            >
              {paragraph}
            </p>
          ))}
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
          <PopoverDrawerContent className="p-6 md:p-1 flex flex-col gap-6 md:max-w-96">
            <h3 className="text-xl font-bold mb-2">회차 목록</h3>
            <div className="flex flex-col gap-1">
              {novel.episodes.map((episode) => (
                <Button
                  asChild
                  key={episode.id}
                  variant="ghost"
                  size="lg"
                  className="justify-start px-3 text-lg w-full"
                  shrink={0.97}
                >
                  <div className="w-full flex items-center gap-2 overflow-hidden">
                    <p className="text-zinc-500 mr-2 font-bold">{episode.no}</p>
                    <p className="w-full overflow-hidden text-ellipsis">
                      {episode.title}
                    </p>
                  </div>
                </Button>
              ))}
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
          <PopoverDrawerContent>
            <div className="p-6 md:p-1">
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
                    <ToggleGroupItem
                      value="sans"
                      aria-label="Toggle sans-serif"
                    >
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
            </div>
          </PopoverDrawerContent>
        </PopoverDrawer>
      )
    }
  }
}
