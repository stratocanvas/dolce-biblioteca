'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowDown, BookOpen, Bookmark } from 'lucide-react'
import { AnimatedButton as Button } from '@/components/animated-button'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface Season {
  season_id: string
  type: 'CANTO' | 'INTERVALLO'
  season_number: number
  name: string
  sequence: number
}

interface Episode {
  id: string
  index: number
  title: string
  episode_id: string
  season: Season | null
}

interface EpisodeListProps {
  episodes: Episode[]
  novelId: string
}

async function getReadEpisodesAndLastRead(novelId: string) {
  try {
    const response = await fetch(`/api/last-read?novel_id=${novelId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return {
      readEpisodes: new Set(data.readEpisodes.map((ep: any) => ep.episode_id)),
      lastReadEpisodeId: data.lastRead?.episode_id || null
    }
  } catch (error) {
    console.error('Error fetching read episodes:', error)
    return { readEpisodes: new Set(), lastReadEpisodeId: null }
  }
}

async function getBookmarkedEpisodes(novelId: string) {
  try {
    const response = await fetch(`/api/bookmark/list?novel_id=${novelId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return new Set(data.episodes.map((ep: any) => ep.episode_id))
  } catch (error) {
    console.error('Error fetching bookmarked episodes:', error)
    return new Set()
  }
}

export default function EpisodeList({ episodes, novelId }: EpisodeListProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [activeSeasonId, setActiveSeasonId] = useState<string | null>(null)

  const { data: { readEpisodes = new Set(), lastReadEpisodeId = null } = {} } = useQuery({
    queryKey: ['readEpisodes', novelId],
    queryFn: () => getReadEpisodesAndLastRead(novelId),
  })

  const { data: bookmarkedEpisodes = new Set() } = useQuery({
    queryKey: ['bookmarkedEpisodes', novelId],
    queryFn: () => getBookmarkedEpisodes(novelId),
  })

  const sortedEpisodes = [...episodes].sort((a, b) => {
    // First sort by season sequence
    const seqA = a.season?.sequence ?? 0
    const seqB = b.season?.sequence ?? 0
    if (seqA !== seqB) return sortOrder === 'desc' ? seqB - seqA : seqA - seqB

    // Then sort by episode index within the season
    return sortOrder === 'desc' ? b.index - a.index : a.index - b.index
  })

  // Group episodes by season
  const episodesBySeasons = sortedEpisodes.reduce((acc, episode) => {
    const seasonId = episode.season?.season_id ?? 'no-season'
    if (!acc[seasonId]) {
      acc[seasonId] = {
        season: episode.season,
        episodes: []
      }
    }
    acc[seasonId].episodes.push(episode)
    return acc
  }, {} as Record<string, { season: Season | null; episodes: Episode[] }>)

  // Sort seasons by sequence
  const sortedSeasonEntries = Object.entries(episodesBySeasons).sort(([, a], [, b]) => {
    const seqA = a.season?.sequence ?? 0
    const seqB = b.season?.sequence ?? 0
    return sortOrder === 'desc' ? seqB - seqA : seqA - seqB
  })

  const getSeasonTitle = (season: Season | null) => {
    if (!season) return '단편'
    const { type, season_number, name } = season
    const prefix = type === 'CANTO' ? `${season_number}부` : `외전 ${season_number}부`
    return name ? `${prefix}: ${name}` : prefix
  }

  const scrollToSeason = (seasonId: string) => {
    const element = document.getElementById(`season-${seasonId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSeasonId(seasonId)
    }
  }

  return (
    <div>
      <Separator className="my-6" />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">회차 목록</h2>
        <Button
          variant="ghost"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
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

      {/* Season Navigation */}
      <div className="bg-background/80 backdrop-blur-sm pt-2 pb-4 mt-2">
        <div className="flex gap-2 overflow-x-auto">
          {sortedSeasonEntries
            .filter(([, { season }]) => season !== null)
            .map(([seasonId, { season }]) => (
            <Button
              key={seasonId}
              variant="outline"
              size="sm"
              onClick={() => scrollToSeason(seasonId)}
              className="whitespace-nowrap"
            >
              {getSeasonTitle(season)}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={sortOrder}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4"
        >
          {sortedSeasonEntries.map(([seasonId, { season, episodes }], seasonIndex) => {
            let globalIndex = 0;
            for (let i = 0; i < seasonIndex; i++) {
              globalIndex += sortedSeasonEntries[i][1].episodes.length;
            }
            
            return (
              <div
                key={seasonId}
                id={`season-${seasonId}`}
                className="flex flex-col gap-2 scroll-mt-24"
              >
                {season && (
                  <motion.h3
                    className="text-xl font-bold mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: globalIndex * 0.05
                    }}
                  >
                    {getSeasonTitle(season)}
                  </motion.h3>
                )}
                {episodes.map((episode, index) => {
                  const isRead = readEpisodes.has(episode.episode_id);
                  const isBookmarked = bookmarkedEpisodes.has(episode.episode_id);
                  const isLastRead = lastReadEpisodeId === episode.episode_id;
                  const currentGlobalIndex = globalIndex + index;

                  return (
                    <motion.div
                      key={episode.episode_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: currentGlobalIndex * 0.05
                      }}
                      className="flex flex-col overflow-hidden w-full ㅡ"
                    >
                      <Button
                        asChild
                        variant="ghost"
                        size="lg"
                        className={cn(
                          "w-full justify-start text-lg px-2 overflow-hidden text-ellipsis",
                          isRead && !isBookmarked && !isLastRead && "text-muted-foreground"
                        )}
                        shrink={0.98}
                      >
                        <Link href={`/novel/${novelId}/episode/${episode.episode_id}`}>
                          <div className="grid items-center w-full" style={{ gridTemplateColumns: '3rem 1fr auto auto' }}>
                            <p className={cn(
                              "font-bold text-center text-muted-foreground",
                              isRead && !isBookmarked && !isLastRead && "opacity-60"
                            )}>
                              {episode.index}
                            </p>
                            <p className={cn(
                              "flex-1 overflow-hidden text-ellipsis",
                              isRead && !isBookmarked && !isLastRead && "text-muted-foreground"
                            )}>
                              {episode.title}
                            </p>
                            <div className="flex items-center gap-2">
                              {isLastRead && (
                                <BookOpen className="w-4 h-4 shrink-0" />
                              )}
                              {isBookmarked && (
                                <Bookmark className="w-4 h-4 shrink-0" />
                              )}
                            </div>
                          </div>
                        </Link>
                      </Button>
                    </motion.div>
                  )
                })}
              </div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
