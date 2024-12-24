'use client'

import { genreStyles } from './styles/genre-styles'

interface BookCoverProps {
  title: string
  writer: string
  genre?: string
  className?: string
}

export default function BookCover({
  title,
  writer,
  genre = 'default',
  className = '',
}: BookCoverProps) {


  const style = genreStyles[genre as keyof typeof genreStyles]
  
  return (
    <div className={`block ${className} w-full aspect-[152/225] flex-shrink-0 mx-auto md:mx-0`}>
      <div className={`
        relative 
        h-full
        rounded-sm 
        overflow-hidden 
        ${className.includes('shadow') ? '' : 'shadow-xl'}
        ${style.background}
        ${style.pattern}
        ${style.decoration}
      `}>
        <div className={`absolute left-0 top-0 w-4 h-full bg-gradient-to-b ${style.spine}`} />
        <div className="absolute left-3 top-0 w-2 h-full bg-gradient-to-r from-black/10 to-transparent" />
        <div className={`absolute left-4 right-0 top-0 bottom-0 ${style.background}`}>
          <div className="p-4 h-full flex flex-col justify-between relative">
            <div className="flex-1">
              <div 
                className={`break-keep ${style.title}`} 
                style={{ 
                  fontFamily: style.titleFont,
                  fontSize: 'clamp(16px, 8vw, 22px)',
                  lineHeight: '1.3'
                }}
              >
                {title}
              </div>
            </div>
            <div>
              <div 
                className={`${style.writer}`} 
                style={{ 
                  fontFamily: style.writerFont,
                  fontSize: 'clamp(11px, 2cqw, 16px)',
                  lineHeight: '1.2'
                }}
              >
                {writer}
              </div>
            </div>
            <div className="decoration absolute inset-0" />
            <div className="lines absolute inset-0" />
            <div className="shapes absolute inset-0" />
            <div className="dots absolute inset-0" />
          </div>
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${style.overlay}`} />
        </div>
      </div>
    </div>
  )
}
