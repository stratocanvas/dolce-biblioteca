'use client'

import Link from 'next/link'
import AnimatedButton from '@/components/animated-button'
interface NovelPageProps {
  params: {
    id: string
  }
}
import { Separator } from '@/components/ui/separator'
import novel from '@/app/data/novel.json'
export default function NovelPage({ params }: NovelPageProps) {
  return (
    <div className="mt-16 lg:mt-24 max-w-4xl mx-auto p-6 min-h-screen">
      <div className="mb-2 pb-4">
        <div className="flex flex-col md:flex-row gap-8">

          <BookCover title={novel.title} writer={novel.writer} />

          {/* Info */}
          <div className="flex-grow text-center md:text-left flex flex-col">
            <div>
              <h1 className="text-3xl font-bold mb-4">{novel.title}</h1>
              <div className="flex gap-4 text-sm mb-4 justify-center md:justify-start">
                <div className="flex items-center">{novel.writer} 지음</div>
                <div className="flex items-center">{novel.genre}</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed hidden sm:block">
              {novel.description}
            </p>
            <div className="mt-auto">
              <AnimatedButton asChild variant="default" size="lg" scale={0.95}>
                <Link
                  href={`/novel/${novel.id}/episode/${novel.episodes[0].id}`}
                >
                  <p className="font-bold text-lg">첫 회 읽기</p>
                </Link>
              </AnimatedButton>
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
        <h2 className="text-2xl font-bold mb-4 mt-8">회차 목록</h2>
        <div className="flex flex-col gap-2">
          {novel.episodes.map((episode) => (
            <AnimatedButton
              asChild
              variant="ghost"
              key={episode.id}
              size="lg"
              className="w-full justify-start text-lg px-3"
              scale={0.98}
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
            </AnimatedButton>
          ))}
        </div>
      </div>
    </div>
  )
}
