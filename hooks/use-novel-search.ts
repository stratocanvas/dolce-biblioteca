import { useInfiniteQuery } from '@tanstack/react-query'
import type { Novel } from '@/app/api/novels/novel'

interface SearchResult {
  novels: Novel[]
  count: number
}

export function useNovelSearch(query: string | null) {
  return useInfiniteQuery<SearchResult, Error, { pages: SearchResult[] }>({
    queryKey: ['novels', 'search', query],
    queryFn: async ({ pageParam }) => {
      const searchParams = new URLSearchParams()
      searchParams.set('page', String(pageParam))
      if (query?.trim()) {
        searchParams.set('q', query.trim())
      }

      const response = await fetch(`/api/novels?${searchParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch novels')
      }
      
      return response.json()
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.novels.length === 0) return undefined
      if (lastPage.count === -1 || pages.length * 10 < lastPage.count) {
        return pages.length + 1
      }
      return undefined
    },
    initialPageParam: 1,
  })
} 