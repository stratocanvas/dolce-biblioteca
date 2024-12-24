'use client'

import { useState, useEffect } from 'react'
import { useScroll } from '@/hooks/use-scroll'
import { NovelHeader } from '@/components/novel-header'
import EpisodeList from '@/components/episode-list'
import BookCover from '@/components/book-cover'
import { AnimatedButton as Button } from '@/components/animated-button'
import Link from 'next/link'
import { useNovel } from '@/hooks/use-novel'
import type { Episode, Novel } from '@/app/api/novels/novel'
import { useSidebar } from '@/components/ui/sidebar'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, RotateCcw } from 'lucide-react'

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

interface NovelPageClientProps {
  novel: Novel
}

export function NovelPageClient({ novel: initialNovel }: NovelPageClientProps) {
  const [isResizing] = useState(false)
  const { isHeaderVisible, showHeaderButton } = useScroll({
    isEpisodePage: false,
    isResizing,
  })

  const { data: novel } = useNovel(initialNovel.novel_id, initialNovel)
  const { data: lastReadEpisode, isLoading: isLastReadLoading } = useQuery({
    queryKey: ['lastRead', initialNovel.novel_id],
    queryFn: () => getLastReadEpisode(initialNovel.novel_id),
  })

  if (!novel) return null

  const firstEpisode =
    novel.episode.find((ep: Episode) => ep.index === 1) || novel.episode[0]

  const { setOpen } = useSidebar()
  useEffect(() => {
    setOpen(false)
  }, [setOpen])

  const targetEpisode = lastReadEpisode || firstEpisode
  const isLastRead = lastReadEpisode !== null

  return (
    <div>
      <NovelHeader
        novel={novel}
        isVisible={isHeaderVisible}
        showHeaderButton={showHeaderButton}
        isEpisodePage={false}
      />

      <div className="mt-20 max-w-4xl mx-auto p-6 min-h-screen">
        <div className="mb-2 pb-4">
          <div className="flex flex-col md:flex-row gap-8 ">
            <div className="w-48 lg:w-72 justify-between mx-auto md:mx-0">
              <BookCover
                title={novel?.title}
                writer={novel?.author}
                genre={
                  novel?.tags
                    .map((g: string) => (g === 'SRT' ? '발키리' : g))
                    .find((g: string) =>
                      [
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
                      ].includes(g),
                    ) || '산해경'
                }
              />
            </div>
            {/* Info */}
            <div className="flex-grow flex flex-col justify-between gap-2 w-full">
              <div className="flex flex-col items-center md:items-start">
                <h1 className="text-3xl font-bold mb-2 text-center md:text-left w-full">
                  {novel?.title}
                </h1>
                <p className="text-center md:text-left w-full">
                  {novel?.author}
                </p>
                <p className="text-muted-foreground leading-relaxed hidden md:block md:mt-2 w-full">
                  {novel?.synopsis}
                </p>
              </div>
              <div
                id="first-episode-button"
                className="flex justify-center md:justify-start gap-2"
              >
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  shrink={0.95}
                  className="font-bold text-lg"
                >
                  <Link
                    href={`/novel/${novel?.novel_id}/episode/${isLastReadLoading ? firstEpisode?.episode_id : (targetEpisode?.episode_id || firstEpisode?.episode_id)}`}
                  >
                    <div className="flex items-center gap-2">
                      {isLastReadLoading ? (
                        <BookOpen className="w-5 h-5" />
                      ) : isLastRead ? (
                        <RotateCcw className="w-5 h-5" />
                      ) : (
                        <BookOpen className="w-5 h-5" />
                      )}
                      {isLastReadLoading ? (
                        '첫 화 읽기'
                      ) : isLastRead ? (
                        `이어서 읽기 (${targetEpisode.index}화)`
                      ) : (
                        '첫 화 읽기'
                      )}
                    </div>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed md:hidden">
          {novel?.synopsis}
        </p>
        <div className="flex flex-wrap gap-1 mt-4">
          {novel?.tags
            ?.filter(
              (tag: string) =>
                ![
                  '아비도스',
                  '밀레니엄',
                  '트리니티',
                  '백귀야행',
                  '산해경',
                  '붉은겨울',
                  '발키리',
                  'SRT',
                  '게헨나',
                  '대책위원회',
                  '세미나',
                  '게임개발부',
                  'C&C',
                  '베리타스',
                  '엔지니어부',
                  '트레이닝부',
                  '초현상특무부',
                  '야구부',
                  '티파티',
                  '보충수업부',
                  '자경단',
                  '도서부',
                  '방과후 디저트부',
                  '구호기사단',
                  '정의실현부',
                  '시스터후드',
                  '음양부',
                  '마츠리부',
                  '수행부',
                  '인법연구부',
                  '백화요란',
                  '화조풍월부',
                  '현룡문',
                  '연단방',
                  '매화원',
                  '현무상회',
                  '사무국',
                  '227호 특별반',
                  '지식해방전선',
                  '용역부',
                  '공안국',
                  '생활안전국',
                  'RABBIT소대',
                  'FOX소대',
                  '만마전',
                  '선도부',
                  '흥신소68',
                  '미식연구회',
                  '급양부',
                  '응급의학부',
                  '온천개발부',
                  '반짝반짝부',
                  '무소속',
                  '총학생회',
                  '샬레',
                  '스쿼드'
                ].includes(tag),
            )
            .map((tag: string) => (
              <div
                key={tag}
                className="px-3 py-1 text-sm rounded-sm bg-secondary text-secondary-foreground"
              >
                {tag}
              </div>
            ))}
        </div>
        <div>
          <EpisodeList episodes={novel?.episode} novelId={novel?.novel_id} />
        </div>
      </div>
    </div>
  )
}
