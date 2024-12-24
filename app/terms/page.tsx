'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'

export default function TermsPage() {
  const { setOpen } = useSidebar()
  const [content, setContent] = useState('')

  useEffect(() => {
    setOpen(false)
    
    fetch('/terms.md')
      .then(response => response.text())
      .then(text => setContent(text))
  }, [setOpen])

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="prose prose-slate max-w-none">
          {content.split('\n').map((line, index) => {
            const key = `line-${line.slice(0, 20)}-${index}`
            
            if (line.startsWith('# ')) {
              return (
                <h1 key={key} className="text-3xl font-bold text-gray-900 mb-8">
                  {line.replace('# ', '').trim()}
                </h1>
              )
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={key} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                  {line.replace('## ', '').trim()}
                </h2>
              )
            }
            if (line.startsWith('- ')) {
              return (
                <p key={key} className="text-gray-600 ml-4 mb-2 flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                  <span>{line.replace('- ', '').trim()}</span>
                </p>
              )
            }
            return line.trim() ? (
              <p key={key} className="text-gray-600 mb-4">
                {line}
              </p>
            ) : null
          })}
        </article>
      </div>
    </main>
  )
}
