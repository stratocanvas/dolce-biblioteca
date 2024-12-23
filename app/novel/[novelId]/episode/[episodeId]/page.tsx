import { getNovel } from '@/app/api/novels/novel'
import { getEpisode } from '@/app/api/episode'
import { Suspense } from 'react'
import { EpisodeHeader, EpisodeContent, EpisodeLoading } from './client'

interface PageProps {
  params: {
    novelId: string
    episodeId: string
  }
}

export default async function Page({ params }: PageProps) {
  const { novelId, episodeId } = params
  const novel = await getNovel(novelId)
  const episodeUrl = novel?.episode?.find(
    (ep) => Number.parseInt(ep.episode_id) === Number.parseInt(episodeId),
  )?.body
  
  if (!episodeUrl) {
    throw new Error('Episode not found')
  }
  
  const episode = await getEpisode(episodeUrl)

  return (
    <>
      <EpisodeHeader novel={novel} episodeId={episodeId} />
      <Suspense fallback={<EpisodeLoading />}>
        <EpisodeContent 
          novel={novel} 
          episodeId={episodeId} 
          episode={episode}
        />
      </Suspense>
    </>
  )
}
