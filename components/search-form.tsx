'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export default function SearchForm({ className, ...props }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    const searchParams = new URLSearchParams()
    searchParams.set('q', query.trim())
    router.push(`/novel?${searchParams.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full max-w-lg px-1", className)} {...props}>
      <Input
        type="text"
        placeholder="제목, 작가 또는 등장 인물 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-4 pr-12 py-2 rounded-lg transition-colors"
      />
      <Button 
        type="submit" 
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-primary/10 transition-colors"
        variant="ghost"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  )
} 