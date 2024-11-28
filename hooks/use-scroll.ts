import { useState, useEffect } from 'react'

interface UseScrollOptions {
  isEpisodePage: boolean
  isResizing: boolean
}

export function useScroll({ isEpisodePage, isResizing }: UseScrollOptions) {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [showHeaderButton, setShowHeaderButton] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (isResizing) return

      const currentScrollY = window.scrollY
      
      if (isEpisodePage) {
        const windowHeight = window.innerHeight
        const documentHeight = document.documentElement.scrollHeight
        const progress = (currentScrollY / (documentHeight - windowHeight)) * 100
        setScrollProgress(progress)

        if (currentScrollY > lastScrollY) {
          setIsHeaderVisible(false)
        } else {
          setIsHeaderVisible(true)
        }
      } else {
        const buttonPosition = document.querySelector('#first-episode-button')?.getBoundingClientRect()
        if (buttonPosition) {
          setShowHeaderButton(buttonPosition.top < 0)
        }
        setIsHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isResizing, isEpisodePage])

  return {
    isHeaderVisible,
    showHeaderButton,
    scrollProgress
  }
} 