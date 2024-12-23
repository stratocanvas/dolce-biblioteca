import { useQuery } from '@tanstack/react-query'
import { getNovel, type Novel } from '@/app/api/novels/novel'

export function useNovel(novelId: string, initialData?: Novel) {
  return useQuery<Novel, Error>({
    queryKey: ['novel', novelId],
    queryFn: async () => {
      const novel = await getNovel(novelId)
      return novel
    },
    initialData,
  })
} 