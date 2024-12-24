'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useSidebar } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { BookOpen, Library, User } from 'lucide-react'
import { motion } from 'framer-motion'
export default function Home() {
  const { setOpen } = useSidebar()
  useEffect(() => {
    setOpen(false)
  }, [setOpen])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row gap-8 row-start-2 items-center lg:items-start"
      >
        <div className="flex flex-col gap-8 lg:flex-row items-center lg:gap-14">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <h1 className="text-4xl font-bold">Library of Ui</h1>
            <p className="text-lg text-muted-foreground text-center lg:text-left">
              카카오페이지 스테이지
              <br />
              블루아카이브 소설 백업 프로젝트
            </p>
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <Separator className="w-full lg:hidden" />
            <Separator
              orientation="vertical"
              className="hidden lg:block h-24"
            />

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex lg:flex-col items-center lg:items-start gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full lg:w-auto justify-center lg:justify-start"
                >
                  <Link href="/novel" className="flex items-center gap-2">
                    <Library className="w-4 h-4" />
                    도서관
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full lg:w-auto justify-center lg:justify-start"
                >
                  <Link href="/my" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    서재
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.main>
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="row-start-3 flex flex-col gap-4 px-4 w-full max-w-2xl mx-auto text-muted-foreground"
      >
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 justify-center">
        <Button variant="ghost" asChild size="sm" className="w-full sm:w-auto">
            <Link href="/terms">약관</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="w-full sm:w-auto">
            <Link href="/privacy">개인정보처리방침</Link>
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground px-4">
          이 사이트는 팬 사이트로, 카카오 또는 넥슨게임즈와 관련이 없습니다.
        </p>
      </motion.footer>
    </div>
  )
}
