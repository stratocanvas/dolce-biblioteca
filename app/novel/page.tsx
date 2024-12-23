import { getNovels, searchNovels } from '@/app/api/novels/novel'
import { NovelListClient } from './client'

interface NovelListProps {
  searchParams: { q?: string }
}

export default async function NovelList({ searchParams }: NovelListProps) {
  const query = searchParams.q || null
    
  const initialData = query 
    ? await searchNovels(query)
    : await getNovels()

  return <NovelListClient initialNovels={initialData} searchQuery={query} />
}
