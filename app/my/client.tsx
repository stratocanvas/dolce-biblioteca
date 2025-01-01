'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronRight, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import BookCover from '@/components/book-cover'
import { genreStyles } from '@/components/styles/genre-styles'
import { Skeleton } from '@/components/ui/skeleton'

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

interface Novel {
  id: string
  title: string
  cover_url: string
  author: {
    name: string
  }
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
  author: {
    name: string
  }
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
  author: {
    name: string
  }
  tags?: string[]
  episodes: BookmarkedEpisode[]
}

interface Favourite {
  novel_id: string
  novel: Novel
}

interface LibraryData {
  lastRead: CurrentlyReading[]
  recentlyRead: RecentlyRead[]
  bookmarks: BookmarkedNovel[]
  favourites: Favourite[]
}

async function fetchLibraryData() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const response = await fetch('/api/library')
  if (!response.ok) {
    throw new Error('Failed to fetch library data')
  }
  return response.json() as Promise<LibraryData>
}

function ContinueReadingSkeleton() {
  return (
    <section className="relative overflow-hidden">
      <Card className="overflow-hidden border-none relative bg-muted rounded-b-none rounded-t-sm">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex justify-between items-center relative py-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-8 md:hidden" />
          </div>
        </div>
        <CardContent className="p-4 sm:p-6 md:p-8 relative z-10 mt-72">
          <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="space-y-4 md:space-y-6 xl:ml-32">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-3/4 mx-auto md:mx-0" />
                  <Skeleton className="h-6 w-1/2 mx-auto md:mx-0" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 mx-auto md:mx-0" />
                  <Skeleton className="h-6 w-2/3 mx-auto md:mx-0" />
                  <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
                </div>
                <Skeleton className="h-10 w-full md:w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function NovelSkeleton() {
  return (
    <div className="w-40 lg:w-48">
      <div className="relative aspect-[2/3]">
        <Skeleton className="absolute inset-0" />
      </div>
    </div>
  )
}

function BookmarkSkeleton() {
  return (
    <AspectRatio ratio={152 / 225}>
      <Card className="border-none backdrop-blur-sm transition-colors relative overflow-hidden h-full bg-muted">
        <CardContent className="p-3 sm:p-4 relative z-10 h-full">
          <div className="flex flex-col h-full">
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex-1 mt-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </AspectRatio>
  )
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center min-h-screen">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-6">{description}</p>
      <Link href="/novel">
        <Button>도서관으로 이동</Button>
      </Link>
    </div>
  )
}

export function LibraryClient() {
  const { setOpen, toggleSidebar } = useSidebar()
  const parallaxRef = useRef(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['library'],
    queryFn: fetchLibraryData,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

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

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <ContinueReadingSkeleton />
        <section>
          <div className="flex items-center justify-between mb-4 ml-8 mt-10 xl:ml-36">
            <Skeleton className="h-8 w-48" />
          </div>
          <Carousel className="w-full">
            <CarouselContent className="ml-4 xl:ml-32 mr-10">
              {Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem key={i} className="pl-3 md:pl-4 basis-1/2 md:basis-1/3 xl:basis-1/6">
                  <NovelSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
        <section>
          <div className="flex items-center justify-between mb-4 ml-8 mt-14 xl:ml-36">
            <Skeleton className="h-8 w-32" />
          </div>
          <Carousel className="w-full">
            <CarouselContent className="ml-4 xl:ml-32 mr-10">
              {Array.from({ length: 3 }).map((_, i) => (
                <CarouselItem key={i} className="pl-2 md:pl-4 md:basis-1/2 xl:basis-1/4">
                  <BookmarkSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState 
        title="서재를 불러올 수 없습니다"
        description="잠시 후 다시 시도해주세요"
      />
    )
  }

  if (!data) {
    return null
  }

  const { lastRead, recentlyRead, bookmarks, favourites } = data

  if (!lastRead.length && !recentlyRead.length && !bookmarks.length && !favourites.length) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-between items-center py-8">
            <h1 className="text-4xl font-bold">
              서재
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu />
            </Button>
          </div>
        </div>
        <EmptyState 
          title="서재가 비어있습니다"
          description="도서관에서 소설을 찾아보세요"
        />
      </div>
    )
  }

  const mostRecentRead = lastRead.length > 0 ? lastRead[0] : null

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <Card className={`overflow-hidden border-none relative ${mostRecentRead ? genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].background : 'bg-muted'} rounded-b-none rounded-t-sm`}>
          <div ref={parallaxRef} className="absolute inset-0">
            {mostRecentRead && (
              <>
                <div className={genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].pattern} />
                <div className={genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].decoration}>
                  <div className="decoration" />
                  <div className="lines" />
                  <div className="shapes" />
                  <div className="dots" />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-br ${genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].overlay}`} />
              </>
            )}
          </div>
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="absolute -inset-x-[100vw] inset-y-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
            <div className="flex justify-between items-center relative py-8">
              <h1 className="text-white text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-md">
                서재
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/20 hover:text-white"
                onClick={toggleSidebar}
              >
                <Menu />
              </Button>
            </div>
          </div>
          {mostRecentRead && (
            <CardContent className="p-4 sm:p-6 md:p-8 relative z-10 mt-72">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="space-y-4 md:space-y-6 xl:ml-32">
                    <div>
                      <h2
                        className={`text-2xl font-bold break-all line-clamp-3 ${genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].title}`}
                        style={{
                          fontFamily: genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].titleFont,
                        }}
                      >
                        {mostRecentRead.episode.novel.title}
                      </h2>
                      <p
                        className={`text-base sm:text-lg mt-2 ${genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].writer}`}
                      >
                        {mostRecentRead.episode.novel.author.name}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].writer}`}>
                        최근 읽은 챕터
                      </p>
                      <p
                        className={`text-base sm:text-lg md:text-xl font-medium line-clamp-2 ${genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].title}`}
                      >
                        {mostRecentRead.episode.index}화.{' '}
                        {mostRecentRead.episode.title}
                      </p>
                      <p className={genreStyles[getMatchingGenre(mostRecentRead.episode.novel.tags)].writer}>
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
          )}
        </Card>
      </section>

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
                        writer={novel.author.name}
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
                                  {novel.author.name}
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

      {/* Favourites Section */}
      {favourites.length > 0 && (
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
                        writer={novel.novel.author.name}
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
