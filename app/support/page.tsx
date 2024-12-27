'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSidebar } from '@/components/ui/sidebar'
import { Menu } from 'lucide-react'
import { toast } from 'sonner'

type SupportType = 'book-request' | 'takedown' | 'bug-report' | 'feature-suggestion'

interface SupportOption {
  id: SupportType
  title: string
  description: string
}

const supportOptions: SupportOption[] = [
  {
    id: 'book-request',
    title: '소설 추가 요청',
    description: '원하시는 소설의 추가를 요청해주세요.',
  },
  {
    id: 'takedown',
    title: '게시 중단 요청',
    description:
      '저작권 침해나 기타 사유로 인한 게시 중단을 요청하실 수 있습니다.',
  },
  {
    id: 'bug-report',
    title: '오류 신고',
    description: '사이트 이용 중 발견하신 오류나 문제점을 알려주세요.',
  },
  {
    id: 'feature-suggestion',
    title: '기능 제안',
    description: '사이트에 추가되었으면 하는 새로운 기능을 제안해주세요.',
  },
]

export default function SupportPage() {
  const { toggleSidebar } = useSidebar()
  const [loading, setLoading] = useState(false)
  const [selectedType, setSelectedType] = useState<SupportType>('book-request')
  const [accordionValue, setAccordionValue] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const data: Record<string, string> = {}
    
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    const form = event.currentTarget

    try {
      await toast.promise(
        fetch('/api/support', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: selectedType,
            data,
          }),
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error('제출에 실패했습니다.')
          }
          form.reset()
        }),
        {
          loading: '제출 중...',
          success: '제출이 완료.',
          error: '오류가 발생했습니다. 다시 시도해주세요.',
        }
      )
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (optionId: SupportType) => {
    setSelectedType(optionId)
    setAccordionValue('') // Close accordion when option is selected
  }

  const selectedOption = supportOptions.find((opt) => opt.id === selectedType)

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center relative py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-md">
            지원
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu />
          </Button>
        </div>
        <div className="md:mt-8 xl:grid xl:grid-cols-[300px,1fr] xl:gap-8">
          {/* Support Type Selection */}
          <div className="mb-6 xl:mb-0">
            <Accordion
              type="single"
              value={accordionValue}
              onValueChange={setAccordionValue}
              className="xl:hidden"
            >
              <AccordionItem value="options">
                <AccordionTrigger className="text-lg">
                  {selectedOption?.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {supportOptions.map((option) => (
                      <motion.div key={option.id} whileTap={{ scale: 0.98 }}>
                        <button
                          type="button"
                          onClick={() => handleOptionSelect(option.id)}
                          className={cn(
                            'w-full p-4 text-left rounded-lg transition-colors',
                            'hover:bg-muted',
                            selectedType === option.id
                              ? 'bg-primary/10 hover:bg-primary/20'
                              : 'bg-card',
                          )}
                        >
                          <h3 className="font-medium">{option.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Desktop menu */}
            <div className="hidden xl:block space-y-2">
              {supportOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    className={cn(
                      'w-full p-4 text-left rounded-lg transition-colors',
                      'hover:bg-muted',
                      selectedType === option.id
                        ? 'bg-primary/10 hover:bg-primary/20'
                        : 'bg-card',
                    )}
                  >
                    <h3 className="font-medium">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedType}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{selectedOption?.title}</CardTitle>
                  <CardDescription>
                    {selectedOption?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {selectedType === 'book-request' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="book-title">소설 제목</Label>
                          <Input
                            id="book-title"
                            name="title"
                            placeholder="소설의 제목을 입력해주세요"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="book-author">작가</Label>
                          <Input
                            id="book-author"
                            name="author"
                            placeholder="작가의 이름을 입력해주세요"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="book-description">상세 설명</Label>
                          <Textarea
                            id="book-description"
                            name="description"
                            placeholder="소설에 대한 간단한 설명이나 URL을 입력해주세요"
                            className="min-h-[100px]"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'takedown' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="takedown-title">대상 소설</Label>
                          <Input
                            id="takedown-title"
                            name="title"
                            placeholder="게시 중단을 원하는 소설의 제목"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="takedown-reason">요청 사유</Label>
                          <Textarea
                            id="takedown-reason"
                            name="reason"
                            placeholder="게시 중단을 요청하시는 사유를 자세히 설명해주세요"
                            className="min-h-[100px]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="takedown-contact">연락처</Label>
                          <Input
                            id="takedown-contact"
                            name="contact"
                            placeholder="회신받으실 이메일 주소"
                            type="email"
                            required
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'bug-report' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="bug-type">오류 유형</Label>
                          <Input
                            id="bug-type"
                            name="bugType"
                            placeholder="예: 페이지 로딩 오류, 회원가입 문제 등"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bug-description">오류 설명</Label>
                          <Textarea
                            id="bug-description"
                            name="description"
                            placeholder="발생한 오류에 대해 자세히 설명해주세요"
                            className="min-h-[100px]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bug-steps">재현 방법</Label>
                          <Textarea
                            id="bug-steps"
                            name="steps"
                            placeholder="오류가 발생하기까지의 단계를 설명해주세요"
                            className="min-h-[100px]"
                          />
                        </div>
                      </>
                    )}

                    {selectedType === 'feature-suggestion' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="feature-title">기능 제목</Label>
                          <Input
                            id="feature-title"
                            name="title"
                            placeholder="제안하는 기능의 간단한 제목"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feature-description">기능 설명</Label>
                          <Textarea
                            id="feature-description"
                            name="description"
                            placeholder="제안하는 기능에 대해 자세히 설명해주세요"
                            className="min-h-[100px]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feature-reason">제안 사유</Label>
                          <Textarea
                            id="feature-reason"
                            name="reason"
                            placeholder="이 기능이 필요한 이유나 어떤 문제를 해결할 수 있는지 설명해주세요"
                            className="min-h-[100px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feature-example">사용 예시</Label>
                          <Textarea
                            id="feature-example"
                            name="example"
                            placeholder="이 기능이 어떻게 사용될 수 있는지 예시를 들어주세요 (선택사항)"
                            className="min-h-[100px]"
                          />
                        </div>
                      </>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? '제출 중...' : '제출하기'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
