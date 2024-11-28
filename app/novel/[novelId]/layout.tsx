'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatedButton as Button } from '@/components/animated-button'
import { ChevronLeft, Heart, BookOpen, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { MarqueeText } from '@/components/marquee-text'
import novel from '@/app/data/novel.json'
import { useRouter } from 'next/navigation'

export default function NovelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { novelId: string }
}) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [showHeaderButton, setShowHeaderButton] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const [isResizing, setIsResizing] = useState(false)

  const isEpisodePage = pathname.includes('/episode/')

  useEffect(() => {
    const handleScroll = () => {
      if (isResizing) return

      const currentScrollY = window.scrollY
      
      if (isEpisodePage) {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const progress = (currentScrollY / (documentHeight - windowHeight)) * 100
        setScrollProgress(progress)

        if (currentScrollY > lastScrollY) {
          setIsHeaderVisible(false)
        } else {
          setIsHeaderVisible(true)
        }
      } else {
        const buttonPosition = document.querySelector('#first-episode-button')?.getBoundingClientRect()
        if (buttonPosition) {
          setShowHeaderButton(buttonPosition.top < 0)
        }
        setIsHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isResizing, isEpisodePage])

  return (
    <>
      {isEpisodePage && (
        <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-zinc-200 dark:bg-zinc-700">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}
      <div
        className={`sticky top-0 z-40 bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center max-w-4xl mx-auto px-6 py-4 gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            shrink={0.9}
            onClick={() => router.back()}
          >
            <ChevronLeft />
          </Button>
          
          <div className="flex-1 flex justify-center relative h-[42px] text-ellipsis overflow-hidden">
            {!isEpisodePage ? (
              <div
                className={`text-ellipsis overflow-hidden px-3 transition-all duration-300 ${
                  showHeaderButton
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="relative">
                    <MarqueeText
                      text={novel.title}
                      className="text-lg font-medium"
                    />
                    <p className="text-sm text-muted-foreground font-medium -mt-1 text-center">
                      {novel.writer}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0 overflow-hidden">
                <MarqueeText
                  text={novel.title}
                  className="text-lg font-medium text-center"
                />
              </div>
            )}
          </div>

          {!isEpisodePage ? (
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
                    <Link href={`/novel/${novel.id}/episode/${novel.episodes[0].id}`}>
                      <BookOpen /> 1화
                    </Link>
                  </Button>
                </div>
              </div>
              <Button variant="ghost" size="icon" shrink={0.95}>
                <Heart />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" shrink={0.9} className="shrink-0">
              <Bookmark className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className={`${!isEpisodePage ? 'mt-16 lg:mt-24' : ''}`}>
        {children}
      </div>
    </>
  )
} 