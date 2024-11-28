import { AnimatedButton as Button } from '@/components/animated-button'
import { ChevronLeft, Heart, BookOpen, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { MarqueeText } from '@/components/marquee-text'
import { useRouter } from 'next/navigation'

interface NovelHeaderProps {
  isVisible: boolean
  showHeaderButton: boolean
  isEpisodePage: boolean
  novel: {
    id: string
    title: string
    writer?: string
    episodes: { id: string }[]
  }
  episode: {
    id: string
    title: string
  }
}

export function NovelHeader({
  isVisible,
  showHeaderButton,
  isEpisodePage,
  novel,
  episode,
}: NovelHeaderProps) {
  const router = useRouter()

  return (
    <div
      className={`sticky top-0 z-40 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="relative">
        <div className="flex items-center max-w-4xl mx-auto px-6 py-4 gap-1">
          <Button
            variant="ghost"
            size="icon"
            shrink={0.9}
            onClick={() => router.back()}
          >
            <ChevronLeft />
          </Button>

          <div className="flex-1 h-[42px] text-ellipsis overflow-hidden items-center">
            <NovelInfo
              novel={novel}
              showHeaderButton={showHeaderButton}
              isEpisodePage={isEpisodePage}
              episode={episode}
            />
          </div>

          <NovelActions
            novel={novel}
            showHeaderButton={showHeaderButton}
            isEpisodePage={isEpisodePage}
          />
        </div>
      </div>
    </div>
  )
}

function NovelInfo({
  novel,
  showHeaderButton,
  isEpisodePage,
  episode,
}: Pick<NovelHeaderProps, 'novel' | 'showHeaderButton' | 'isEpisodePage' | 'episode'>) {
  const buttonVisibility = isEpisodePage ? true : showHeaderButton

  return (
    <div
      className={`text-ellipsis overflow-hidden px-3 transition-all duration-300 ${
        buttonVisibility
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="relative">
          <div className='transition-transform duration-300 text-left'>
            <MarqueeText 
              text={isEpisodePage ? episode.title : novel.title} 
              className="text-lg font-medium"
            />
            <p className="text-sm text-muted-foreground font-medium -mt-1">
              {isEpisodePage ? novel.title : novel.writer}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NovelActions({
  novel,
  showHeaderButton,
  isEpisodePage,
}: Pick<NovelHeaderProps, 'novel' | 'showHeaderButton' | 'isEpisodePage'>) {
  if (!isEpisodePage) {
    return (
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
    )
  }
}
