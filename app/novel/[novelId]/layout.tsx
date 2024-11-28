'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import novel from '@/app/data/novel.json'
import episode from '@/app/data/episode.json'
import { useScroll } from '@/hooks/use-scroll'
import { NovelHeader } from '@/components/novel-header'
export default function NovelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { novelId: string }
}) {
  const pathname = usePathname()
  const [isResizing, setIsResizing] = useState(false)
  const isEpisodePage = pathname.includes('/episode/')
  const { isHeaderVisible, showHeaderButton, scrollProgress } = useScroll({
    isEpisodePage,
    isResizing
  })
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
      <NovelHeader
        isVisible={isHeaderVisible}
        showHeaderButton={showHeaderButton}
        isEpisodePage={isEpisodePage}
        novel={novel}
        episode={episode}
      />
      <div className={`${!isEpisodePage ? 'mt-16 lg:mt-24' : ''}`}>
        {children}
      </div>
    </>
  )
} 
