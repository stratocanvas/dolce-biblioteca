'use client'

import Link from 'next/link'
import { AnimatedButton as Button } from '@/components/animated-button'
import { Separator } from '@/components/ui/separator'
import { ArrowDown, ArrowUpDown, ChevronLeft, Heart, Home, BookOpen } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import novel from '@/app/data/novel.json'
import BookCover from '@/components/book-cover'
import { MarqueeText } from '@/components/marquee-text'

interface NovelPageProps {
  params: {
    id: string
  }
}

export default function NovelPage({ params }: NovelPageProps) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [showHeaderButton, setShowHeaderButton] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isResizing, setIsResizing] = useState(false)
  const firstEpisodeButtonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (isResizing) return

      const currentScrollY = window.scrollY
      const buttonPosition = firstEpisodeButtonRef.current?.getBoundingClientRect()

      if (buttonPosition) {
        setShowHeaderButton(buttonPosition.top < 0)
      }

      setIsHeaderVisible(true)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isResizing])

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedEpisodes = [...novel.episodes].sort((a, b) => {
    return sortOrder === 'desc' ? b.no - a.no : a.no - b.no
  })

  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')

  return (
    <>
      <div className="mt-16 lg:mt-24 max-w-4xl mx-auto p-6 min-h-screen">
        <div className="mb-2 pb-4">
          <div className="flex flex-col md:flex-row gap-8">
            <BookCover title={novel.title} writer={novel.writer} />

            {/* Info */}
            <div className="flex-grow text-center md:text-left flex flex-col justify-between">
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold mb-4">{novel.title}</h1>
                <div className="flex gap-4 text-sm mb-4 justify-center md:justify-start">
                  <div className="flex items-center">{novel.writer} 지음</div>
                  <div className="flex items-center">{novel.genre}</div>
                </div>
                <p className="text-muted-foreground leading-relaxed hidden md:block">
                  {novel.description}1
                </p>
              </div>
              <div id="first-episode-button">
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  shrink={0.95}
                  className="font-bold text-lg"
                >
                  <Link
                    href={`/novel/${novel.id}/episode/${novel.episodes[0].id}`}
                  >
                    첫 화 읽기
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed md:hidden">
          {novel.description}
        </p>

        {/* Episodes */}
        <div>
          <Separator className="my-6" />
          <div className="flex justify-between items-center mb-4 mt-8">
            <h2 className="text-2xl font-bold">회차 목록</h2>
            <Button
              variant="ghost"
              onClick={() =>
                setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
              }
              className="h-8 text-sm gap-2"
              animate
            >
              {sortOrder === 'desc' ? '최신화부터' : '첫화부터'}
              <ArrowDown
                className={`h-4 w-4 transition-transform ${
                  sortOrder === 'desc' ? 'rotate-0' : 'rotate-180'
                }`}
              />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {sortedEpisodes.map((episode) => (
              <Button
                asChild
                variant="ghost"
                key={episode.id}
                size="lg"
                className="w-full justify-start text-lg px-3"
                shrink={0.98}
              >
                <Link href={`/novel/${novel.id}/episode/${episode.id}`}>
                  <div className="flex items-center overflow-hidden">
                    <p className="text-muted-foreground font-bold mr-4">
                      {episode.no}
                    </p>
                    <p className="w-full overflow-hidden text-ellipsis">
                      {episode.title}
                    </p>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
