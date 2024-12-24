import { useInfiniteQuery } from '@tanstack/react-query'
import { getNovels, type Novel } from '@/app/api/novels/novel'

interface NovelsResponse {
  novels: Novel[]
  count: number
}

export function useNovels(initialData?: NovelsResponse) {
  return useInfiniteQuery<NovelsResponse, Error>({
    queryKey: ['novels'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getNovels(pageParam, 10)
      return response
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1
      const totalPages = Math.ceil(lastPage.count / 10)
      return nextPage <= totalPages ? nextPage : undefined
    },
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
  })
} 