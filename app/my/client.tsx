'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useEffect, useRef } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import BookCover from '@/components/book-cover'
import { genreStyles } from '@/components/styles/genre-styles'

interface Novel {
  id: string
  title: string
  cover_url: string
  author: string
  tags?: string[]
}

interface Episode {
  episode_id: string
  title: string
  index: number
  novel_id: string
  novel: Novel
}

interface CurrentlyReading {
  episode_id: string
  scroll_position: number
  timestamp: number
  episode: Episode
}

interface RecentlyRead {
  id: string
  title: string
  author: string
  tags?: string[]
  cover_url: string
}

interface BookmarkedEpisode {
  episode_id: string
  title: string
  index: number
  bookmark_id: string
}

interface BookmarkedNovel {
  novel_id: string
  title: string
  author: string
  tags?: string[]
  episodes: BookmarkedEpisode[]
}

interface Favourite {
  novel_id: string
  novel: Novel
}

interface LibraryClientProps {
  lastRead: CurrentlyReading[]
  recentlyRead: RecentlyRead[]
  bookmarks: BookmarkedNovel[]
  favourites: Favourite[]
}

const VALID_GENRES = [
  '밀레니엄',
  '아비도스',
  '트리니티',
  '게헨나',
  '산해경',
  '백귀야행',
  '발키리',
  '아리우스',
  '붉은겨울',
  '총학생회',
] as const

type ValidGenre = typeof VALID_GENRES[number]

function getMatchingGenre(tags?: string[]): ValidGenre {
  if (!tags) return '산해경'
  const matchingGenre = tags
    .map((g) => (g === 'SRT' ? '발키리' : g))
    .find((g) => VALID_GENRES.includes(g as ValidGenre))
  return (matchingGenre as ValidGenre) || '산해경'
}

export function LibraryClient({
  lastRead,
  recentlyRead,
  bookmarks,
  favourites,
}: LibraryClientProps) {
  const { setOpen } = useSidebar()
  const parallaxRef = useRef(null)

  useEffect(() => {
    setOpen(true)
  }, [setOpen])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset
      const parallaxRate = 0.5
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${
          scrollPosition * parallaxRate
        }px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const mostRecentRead = lastRead.length > 0 ? lastRead[0] : null

  return (
    <div className="min-h-screen">
      {/* Continue Reading Section */}
      {mostRecentRead && (
        <section className="relative overflow-hidden">
          {(() => {
            const genre = getMatchingGenre(mostRecentRead.episode.novel.tags)
            const style = genreStyles[genre]
            return (
              <Card
                className={`overflow-hidden border-none relative ${style.background} rounded-b-none rounded-t-sm`}
              >
                <div ref={parallaxRef} className="absolute inset-0">
                  <div className={style.pattern} />
                  <div className={style.decoration}>
                    <div className="decoration" />
                    <div className="lines" />
                    <div className="shapes" />
                    <div className="dots" />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${style.overlay}`}
                  />
                </div>
                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                  <div className="absolute -inset-x-[100vw] inset-y-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
                  <div className="flex justify-between items-center relative py-8">
                    <h1 className="text-white text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-md">
                      서재
                    </h1>
                    <Button
                      variant="ghost"
                      asChild
                      size="icon"
                      className="shrink-0 md:hidden text-white hover:bg-white/10 hover:text-white"
                    >
                      <SidebarTrigger />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6 md:p-8 relative z-10 mt-72">
                  <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                    <div className="flex-1 min-w-0 text-center md:text-left">
                      <div className="space-y-4 md:space-y-6 xl:ml-32">
                        <div>
                          <h2
                            className={`text-2xl font-bold break-all line-clamp-3 ${style.title}`}
                            style={{
                              fontFamily: style.titleFont,
                            }}
                          >
                            {mostRecentRead.episode.novel.title}
                          </h2>
                          <p
                            className={`text-base sm:text-lg mt-2 ${style.writer}`}
                          >
                            {mostRecentRead.episode.novel.author}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${style.writer}`}>
                            최근 읽은 챕터
                          </p>
                          <p
                            className={`text-base sm:text-lg md:text-xl font-medium line-clamp-2 ${style.title}`}
                          >
                            {mostRecentRead.episode.index}화.{' '}
                            {mostRecentRead.episode.title}
                          </p>
                          <p className={style.writer}>
                            {formatDistanceToNow(
                              mostRecentRead.timestamp * 1000,
                              {
                                addSuffix: true,
                                locale: ko,
                              },
                            )}
                          </p>
                        </div>
                        <Link
                          href={`/novel/${mostRecentRead.episode.novel_id}/episode/${mostRecentRead.episode_id}`}
                          className="inline-block w-full md:w-auto"
                        >
                          <Button size="lg" className="w-full">
                            이어보기
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </section>
      )}

      {/* Recently Read Section */}
      {recentlyRead.length > 1 && (
        <section>
          <div className="flex items-center justify-between mb-4 ml-8 mt-10 xl:ml-36">
            <Link href="/my/history" className="flex items-center gap-1">
              <h2 className="text-xl sm:text-2xl font-bold">
                최근에 읽은 소설
              </h2>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
          </div>
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              dragFree: true,
            }}
            plugins={[]}
          >
            <CarouselContent className="ml-4 xl:ml-32 mr-10">
              {recentlyRead.slice(0, 10).map((novel) => {
                const genre = getMatchingGenre(novel.tags)
                return (
                  <CarouselItem
                    key={novel.id}
                    className="pl-3 md:pl-4 basis-1/2 md:basis-1/3 xl:basis-1/6"
                  >
                    <Link href={`/novel/${novel.id}`}>
                      <BookCover
                        title={novel.title}
                        writer={novel.author}
                        genre={genre}
                        className="drop-shadow-none"
                      />
                    </Link>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </section>
      )}
      {/* Bookmarks Section */}
      {bookmarks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 ml-8 mt-14 xl:ml-36">
            <Link href="/my/bookmarks" className="flex items-center gap-1">
              <h2 className="text-xl sm:text-2xl font-bold">북마크</h2>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
          </div>
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              dragFree: true,
            }}
            plugins={[]}
          >
            <CarouselContent className="ml-4 xl:ml-32 mr-10">
              {[...bookmarks]
                .reverse()
                .slice(0, 7)
                .map((novel) => {
                  const genre = getMatchingGenre(novel.tags)
                  const style = genreStyles[genre]
                  return (
                    <CarouselItem
                      key={novel.novel_id}
                      className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/4"
                    >
                      <AspectRatio ratio={152 / 225}>
                        <Card
                          className={`border-none backdrop-blur-sm transition-colors relative overflow-hidden h-full ${style.background}`}
                        >
                          <CardContent className="p-3 sm:p-4 relative z-10 h-full">
                            <div className="flex flex-col h-full">
                              <div>
                                <h3
                                  className={`text-lg sm:text-xl font-bold mb-1 ${style.title}`}
                                >
                                  {novel.title}
                                </h3>
                                <p className={`text-sm ${style.writer}`}>
                                  {novel.author}
                                </p>
                              </div>
                              <ScrollArea className="flex-1 mt-3">
                                <div className="space-y-1.5">
                                  {novel.episodes.map((episode) => (
                                    <Link
                                      key={episode.episode_id}
                                      href={`/novel/${novel.novel_id}/episode/${episode.episode_id}`}
                                    >
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start text-sm px-0 h-auto hover:bg-accent/10"
                                      >
                                        <div
                                          className="grid items-center w-full gap-2"
                                          style={{
                                            gridTemplateColumns: '2.5rem 1fr',
                                          }}
                                        >
                                          <p
                                            className={`font-bold text-center ${style.title}`}
                                          >
                                            {episode.index}
                                          </p>
                                          <p
                                            className={`text-sm text-left line-clamp-1 ${style.writer}`}
                                          >
                                            {episode.title}
                                          </p>
                                        </div>
                                      </Button>
                                    </Link>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          </CardContent>
                          <div className={style.pattern} />
                          <div className={style.decoration}>
                            <div className="decoration" />
                            <div className="lines" />
                            <div className="shapes" />
                            <div className="dots" />
                          </div>
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${style.overlay}`}
                          />
                        </Card>
                      </AspectRatio>
                    </CarouselItem>
                  )
                })}
            </CarouselContent>
          </Carousel>
        </section>
      )}

      {/* Recently Read Section */}
      {recentlyRead.length > 1 && (
        <section className='mb-24'>
          <div className="flex items-center justify-between mb-4 ml-8 mt-14 xl:ml-36">
            <Link href="/my/favourites" className="flex items-center gap-1">
              <h2 className="text-xl sm:text-2xl font-bold">
                마음에 들어요
              </h2>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
          </div>
          <Carousel
            className="w-full"
            opts={{
              align: 'start',
              dragFree: true,
            }}
            plugins={[]}
          >
            <CarouselContent className="ml-4 xl:ml-32 mr-10">
              {favourites.slice(0, 10).map((novel) => {
                const genre = getMatchingGenre(novel.novel.tags)
                return (
                  <CarouselItem
                    key={novel.novel_id}
                    className="pl-3 md:pl-4 basis-1/2 md:basis-1/3 xl:basis-1/6"
                  >
                    <Link href={`/novel/${novel.novel_id}`}>
                      <BookCover
                        title={novel.novel.title}
                        writer={novel.novel.author}
                        genre={genre}
                        className="drop-shadow-none"
                      />
                    </Link>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </section>
      )}
    </div>
  )
}
