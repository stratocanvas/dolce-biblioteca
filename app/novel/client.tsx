'use client'

import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import BookCover from '@/components/book-cover'
import Link from 'next/link'
import { AnimatedButton as Button } from '@/components/animated-button'
import type { Novel } from '@/app/api/novels/novel'
import { Skeleton } from '@/components/ui/skeleton'
import { useNovelSearch } from '@/hooks/use-novel-search'
import SearchForm from '@/components/search-form'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { Menu } from 'lucide-react'

export const metadata = {
  layout: false,
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

function NovelSkeleton() {
  return (
    <div className="w-40 lg:w-48">
      <div className="relative aspect-[2/3]">
        <Skeleton className="absolute inset-0" />
      </div>
    </div>
  )
}

function Layout({
  children,
  searchQuery,
  totalCount,
}: {
  children: React.ReactNode
  searchQuery?: string | null
  totalCount?: number
}) {
  const { toggleSidebar } = useSidebar()
  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center relative py-8 px-4 xl:px-36">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-md xl:px-2">
          도서관
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

      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm py-4 shadow-sm md:hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2 max-w-2xl">
              <SearchForm />
            </div>
            {searchQuery && (
              <p className="text-gray-600 text-lg text-center">
                {totalCount === 0 ? (
                  '검색 결과가 없습니다.'
                ) : (
                  <>
                    <span className="font-medium items-center">"{searchQuery}" 검색 결과</span>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-8">{children}</div>
    </div>
  )
}

interface NovelListClientProps {
  initialNovels: {
    novels: Novel[]
    count: number
  }
  searchQuery: string | null
}

export function NovelListClient({ searchQuery }: NovelListClientProps) {
  const { ref, inView } = useInView()
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useNovelSearch(searchQuery)

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage])

  const { setOpen } = useSidebar()
  useEffect(() => {
    setOpen(true)
  }, [setOpen])

  const novels = data?.pages.flatMap((page) => page.novels) ?? []
  const totalCount = data?.pages[0]?.count ?? 0

  if (status === 'pending') {
    return (
      <Layout searchQuery={searchQuery}>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12 place-items-center">
          {Array.from({ length: 6 }, () => crypto.randomUUID()).map((id) => (
            <NovelSkeleton key={`skeleton-loading-${id}`} />
          ))}
        </div>
      </Layout>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            소류가 발생했습니다
          </h1>
          <p className="text-xl text-gray-600">잠시 후 다시 시도해주세요.</p>
          <Button asChild variant="outline">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!novels || novels.length === 0) {
    return (
      <Layout searchQuery={searchQuery} totalCount={0}>
        <div />
      </Layout>
    )
  }

  return (
    <Layout searchQuery={searchQuery} totalCount={totalCount}>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12 place-items-center">
        {novels.map((novel) => {
          const firstMatchingGenre =
            novel.tags
              ?.map((g: string) => (g === 'SRT' ? '발키리' : g))
              .find((g: string) =>
                VALID_GENRES.includes(g as typeof VALID_GENRES[number]),
              ) || '산해경'

          return (
            <Link
              key={novel.novel_id}
              href={`/novel/${novel.novel_id}`}
              className="group block transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 active:scale-95"
            >
              <div className="w-40 lg:w-48 whitespace-normal">
                <BookCover
                  title={novel.title}
                  writer={novel.author}
                  genre={firstMatchingGenre as typeof VALID_GENRES[number]}
                />
              </div>
            </Link>
          )
        })}
        {isFetchingNextPage && (
          <div className="contents">
            {Array.from({ length: 5 }, () => crypto.randomUUID()).map((id) => (
              <NovelSkeleton key={`skeleton-next-${id}`} />
            ))}
          </div>
        )}
      </div>
      {hasNextPage && <div ref={ref} className="h-20" />}
    </Layout>
  )
}
