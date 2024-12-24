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
    setAnimate(false)

    const checkTitleWidth = () => {
      if (textRef.current) {
        const isOverflowing = textRef.current.scrollWidth > textRef.current.clientWidth
        setAnimate(isOverflowing)
      }
    }

    const timeoutId = setTimeout(checkTitleWidth, 50)
    
    window.addEventListener('resize', checkTitleWidth)
    return () => {
      window.removeEventListener('resize', checkTitleWidth)
      clearTimeout(timeoutId)
    }
  }, [text])

  return (
    <p
      ref={textRef}
      className={`whitespace-nowrap ${
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