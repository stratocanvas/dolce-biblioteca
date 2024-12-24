import { EpisodeHeader, EpisodeContent, EpisodeLoading } from './client'
import { Suspense } from 'react'

interface PageProps {
  params: {
    novelId: string
    episodeId: string
  }
}

export default async function Page({ params }: PageProps) {
  const { novelId, episodeId } = params

  return (
    <Suspense fallback={<EpisodeLoading />}>
      <EpisodeContent 
        novelId={novelId} 
        episodeId={episodeId}
      />
    </Suspense>
  )
}
