import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import Link from 'next/link'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
export function NavMain({
  data,
}: {
  data: {
    navMain: Array<{
      title: string
      url: string
      icon: LucideIcon
      isActive?: boolean
      items?: Array<{
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
      }>
    }>
  }
}) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={pathname.startsWith(item.url)}
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={
                  item.url === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.url)
                }
                onClick={() => {
                  setOpenMobile(false)
                }}
              >
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
