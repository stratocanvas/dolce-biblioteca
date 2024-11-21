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
}

export function PopoverDrawer({ children }: PopoverDrawerProps) {
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
        <PopoverContent className='mb-2 bg-zinc-50 dark:bg-zinc-900 w-96'>{contentElement}</PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} modal={false}>
      {triggerElement}
      <DrawerContent className='bg-zinc-50 dark:bg-zinc-900'>
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
  { children: React.ReactNode }
>(({ children }, ref) => {
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  if (isDesktop) {
    return <PopoverTrigger asChild>{children}</PopoverTrigger>
  }
  return <DrawerTrigger asChild>{children}</DrawerTrigger>
})
PopoverDrawerTrigger.displayName = 'PopoverDrawerTrigger'

export const PopoverDrawerContent = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode }
>(({ children }, ref) => {
  return <div ref={ref}>{children}</div>
})
PopoverDrawerContent.displayName = 'PopoverDrawerContent'
