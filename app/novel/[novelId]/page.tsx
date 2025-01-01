import { getNovel } from '@/app/api/novels/novel'
import { NovelPageClient } from './client'
import type { Metadata } from 'next'

interface NovelPageProps {
  params: {
    novelId: string
  }
}

async function getNovelData(novelId: string) {
  return await getNovel(novelId)
}

export async function generateMetadata({ params }: NovelPageProps): Promise<Metadata> {
  const { novelId } = await params
  const novel = await getNovelData(novelId)
  return {
    title: novel.title,
    description: '블루아카이브 웹소설 공모전 백업',
  }
}

export default async function NovelPage({ params }: NovelPageProps) {
  const { novelId } = await params
  const novel = await getNovelData(novelId)
  return <NovelPageClient novel={novel} />
}
