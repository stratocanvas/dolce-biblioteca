'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle } from '@/components/ui/drawer'
import { useMediaQuery } from 'react-responsive'
import * as React from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
interface PopoverDrawerProps {
  children: React.ReactNode
  className?: string
}

export function PopoverDrawer({ children, className }: PopoverDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  const childrenArray = React.Children.toArray(children)
  const triggerElement = childrenArray.find(
    (child) =>
      React.isValidElement(child) &&
      child.type?.displayName === 'PopoverDrawerTrigger',
  )
  const contentElement = childrenArray.find(
    (child) =>
      React.isValidElement(child) &&
      child.type?.displayName === 'PopoverDrawerContent',
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        {triggerElement}
        <PopoverContent className={`mb-2 bg-zinc-50 dark:bg-zinc-900 ${className ?? ''}`}>
          {contentElement}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={false}>
      {triggerElement}
      <DrawerContent className={`bg-zinc-50 dark:bg-zinc-900 ${className ?? ''}`}>
        <VisuallyHidden>
          <DrawerTitle>
            Menu
          </DrawerTitle>
        </VisuallyHidden>
        {contentElement}
      </DrawerContent>
    </Drawer>
  )
}

export const PopoverDrawerTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  if (isDesktop) {
    return <PopoverTrigger className={className} asChild>{children}</PopoverTrigger>
  }
  return <DrawerTrigger className={className} asChild>{children}</DrawerTrigger>
})
PopoverDrawerTrigger.displayName = 'PopoverDrawerTrigger'

export const PopoverDrawerContent = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; className?: string }
>(({ children, className }, ref) => {
  return <div ref={ref} className={className}>{children}</div>
})
PopoverDrawerContent.displayName = 'PopoverDrawerContent'
