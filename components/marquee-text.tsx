'use client'

import { useEffect, useRef, useState } from 'react'

interface MarqueeTextProps {
  text: string
  className?: string
}

export function MarqueeText({ text, className = '' }: MarqueeTextProps) {
  const textRef = useRef<HTMLParagraphElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const checkTitleWidth = () => {
      if (textRef.current) {
        const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth
        setAnimate(isOverflowing)
      }
    }

    checkTitleWidth()
    window.addEventListener('resize', checkTitleWidth)
    return () => window.removeEventListener('resize', checkTitleWidth)
  }, [])

  return (
    <p
      ref={textRef}
      className={`whitespace-nowrap px-4 ${
        animate ? 'animate-marquee-container' : 'truncate'
      } ${className}`}
    >
      <span
        className={animate ? 'inline-block animate-marquee' : ''}
        style={{
          paddingRight: animate ? '3rem' : '0',
        }}
      >
        {text}
      </span>
      {animate && (
        <span
          className="inline-block animate-marquee"
          style={{ paddingRight: '3rem' }}
          aria-hidden
        >
          {text}
        </span>
      )}
    </p>
  )
} 