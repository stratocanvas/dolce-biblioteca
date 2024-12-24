'use client'

import { useState, useEffect, useCallback } from 'react'
import { LogOut, Settings, UserX, AlertTriangle, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
const supabase = createClient()
export function NavUser({
  user,
}: {
  user?: {
    email?: string | null
  } | null
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const [isClicked, setIsClicked] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const initialMessage = '회원 탈퇴'
  const warningMessages = [
    '정말로 탈퇴하시겠어요?',
    '탈퇴하려면 한 번 더 클릭하세요.',
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isClicked) {
      interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % 2)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isClicked])

  useEffect(() => {
    // Debug session state
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()

    }
    checkSession()
  }, [])

  const handleWithdrawal = async () => {
    if (!isClicked) {
      setIsClicked(true)
      setMessageIndex(0)
      return
    }

    const deletePromise = fetch('/api/delete-user', {
      method: 'POST',
    }).then(async (res) => {
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || '회원 탈퇴 실패')
      }
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    })

    toast.promise(deletePromise, {
      loading: '회원 탈퇴 처리 중...',
      success: '회원 탈퇴가 완료되었습니다.',
      error: (err) => err.message,
    })

    setIsOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setIsClicked(false)
      setMessageIndex(0)
    }
  }

  const getCurrentMessage = () => {
    if (!isClicked) return initialMessage
    return warningMessages[messageIndex]
  }

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      toast.success('로그아웃 완료.')
      // Clear router cache and force a hard refresh
      router.refresh()
      router.push('/')
    } catch (error) {
      toast.error('로그아웃 실패.')
    }
    setOpenMobile(false)
  }, [setOpenMobile, router])

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-between">
        {user ? (
          <>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">로그인됨</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>

            <Popover open={isOpen} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 rounded-lg p-2"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={isClicked ? 'destructive' : 'ghost'}
                    className={`w-full justify-start gap-2 ${
                      isClicked ? 'relative' : ''
                    }`}
                    onClick={handleWithdrawal}
                  >
                    <motion.div
                      animate={{
                        rotate: isClicked ? [0, -10, 10, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <UserX className="h-4 w-4" />
                    </motion.div>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isClicked ? messageIndex : 'initial'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {getCurrentMessage()}
                      </motion.span>
                    </AnimatePresence>
                    {isClicked && (
                      <motion.div
                        className="absolute inset-0 rounded-md"
                        animate={{
                          boxShadow: [
                            '0 0 0px rgba(239,68,68,0)',
                            '0 0 20px rgba(239,68,68,0.5)',
                            '0 0 0px rgba(239,68,68,0)',
                          ],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </Button>
                </motion.div>
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut />
            </Button>
          </>
        ) : (
          <SidebarMenuButton
            onClick={() => {
              setOpenMobile(false)
              router.push('/login?next=/novel')
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground/90 active:bg-primary/90 active:text-primary-foreground/90 font-bold"
          >
            <LogIn />
            <span>로그인</span>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
