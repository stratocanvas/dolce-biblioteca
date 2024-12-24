'use client'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import {
  Library,
  DoorOpen,
  BookOpen,
  Bookmark,
  Heart,
  LifeBuoy,
} from 'lucide-react'
import {
  SidebarFooter,
} from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar'
import SearchForm from '../search-form'
import { NavUser } from './nav-user'
import { NavMain } from './nav-main'
import { NavSecondary } from './nav-secondary'
import { createClient } from '@/utils/supabase/client'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState<{ email: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Initial user fetch
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserData(user ? { email: user.email || '' } : null)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserData(session?.user ? { email: session.user.email || '' } : null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const data = {
    user: userData,
    navMain: [
      {
        title: '로비',
        url: '/',
        icon: DoorOpen,
      },
      {
        title: '도서관',
        url: '/novel',
        icon: Library,
      },
      {
        title: '서재',
        icon: BookOpen,
        url: '/my',
      },
    ],
    navSecondary: [
      {
        title: '지원',
        url: '/support',
        icon: LifeBuoy,
      },
    ],
  }

  return (
    <Sidebar variant="inset" {...props} collapsible="offcanvas">
      <SidebarHeader>
        <SearchForm className="hidden md:block" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain data={data} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data?.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
