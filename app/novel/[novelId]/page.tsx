import { getNovel } from '@/app/api/novels/novel'
import { NovelPageClient } from './client'

interface NovelPageProps {
  params: {
    novelId: string
  }
}

export default async function NovelPage({ params }: NovelPageProps) {
  const { novelId } = await params
  const novel = await getNovel(novelId)
  return <NovelPageClient novel={novel} />
}
