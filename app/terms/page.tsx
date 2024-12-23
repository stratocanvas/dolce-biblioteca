'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'

export default function TermsPage() {
  const { setOpen } = useSidebar()

  useEffect(() => {
    setOpen(false)
  }, [setOpen])

  const terms = [
    {
      title: '서비스 개요',
      content: 'Dolce Biblioteca는 온라인 도서 열람 서비스를 제공합니다. 본 서비스는 사용자들에게 디지털 도서 콘텐츠의 열람 및 북마크 기능을 제공합니다.'
    },
    {
      title: '저작권',
      content: '본 서비스에서 제공되는 모든 도서의 저작권은 각 원작자에게 귀속됩니다. Dolce Biblioteca는 해당 저작물에 대한 저작권을 보유하고 있지 않으며, 단순히 열람 서비스만을 제공합니다. 모든 저작물은 원작자의 권리를 존중하여 이용되어야 합니다.'
    },
    {
      title: '이용 조건',
      content: [
        '본 서비스는 모든 연령의 사용자가 이용할 수 있습니다.',
        '사용자는 개인적인 용도로만 콘텐츠를 열람할 수 있으며, 상업적 목적으로의 사용은 금지됩니다.',
        '콘텐츠의 무단 복제, 배포, 수정은 엄격히 금지됩니다.',
        '모든 콘텐츠는 원작자의 저작권 보호를 받으며, 이를 침해하는 행위는 법적 제재를 받을 수 있습니다.'
      ]
    },
    {
      title: '서비스 이용',
      content: [
        '도서 열람: 제공된 모든 도서는 웹사이트 내에서 열람 가능합니다.',
        '북마크: 사용자는 관심 있는 도서를 북마크하여 나중에 쉽게 찾아볼 수 있습니다.',
        '서비스 이용 시간: 24시간 365일 이용 가능합니다.'
      ]
    },
    {
      title: '개인정보 보호',
      content: '사용자의 개인정보는 관련 법령에 따라 안전하게 보호되며, 서비스 제공에 필요한 최소한의 정보만을 수집합니다. 수집된 정보는 서비스 제공 및 개선의 목적으로만 사용됩니다.'
    },
    {
      title: '서비스 변경 및 중단',
      content: '서비스는 시스템 점검, 업데이트, 기술적 문제 등으로 일시적으로 중단될 수 있습니다. 가능한 경우 사전 공지를 통해 안내드릴 예정입니다.'
    },
    {
      title: '책임의 제한',
      content: '서비스 이용 중 발생하는 문제에 대해 당사는 관련 법령이 허용하는 한도 내에서 책임을 부담합니다. 사용자의 귀책사유로 인한 문제에 대해서는 책임지지 않습니다.'
    }
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        이용약관
      </h1>
      <div className="grid gap-4 sm:gap-6">
        {terms.map((term, index) => (
          <Card key={term.title} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-xl font-semibold">{term.title}</h2>
              {Array.isArray(term.content) ? (
                <ul className="text-sm text-muted-foreground space-y-2">
                  {term.content.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">{term.content}</p>
              )}
            </div>
          </Card>
        ))}
        <p className="text-sm text-muted-foreground text-center mt-4">
          본 약관은 2024년 1월 1일부터 시행됩니다.
        </p>
      </div>
    </div>
  )
}
