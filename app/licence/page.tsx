'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

interface License {
  name: string
  version: string
  license: string
  link: string
}

const licenses: License[] = [
  {
    name: 'Next.js',
    version: '15.0.3',
    license: 'MIT',
    link: 'https://github.com/vercel/next.js',
  },
  {
    name: 'React',
    version: '19.0.0-rc',
    license: 'MIT',
    link: 'https://github.com/facebook/react',
  },
  {
    name: 'Radix UI',
    version: '1.x',
    license: 'MIT',
    link: 'https://github.com/radix-ui/primitives',
  },
  {
    name: 'Lucide React',
    version: '0.460.0',
    license: 'ISC',
    link: 'https://github.com/lucide-icons/lucide',
  },
  {
    name: 'Tailwind CSS',
    version: '3.4.1',
    license: 'MIT',
    link: 'https://github.com/tailwindlabs/tailwindcss',
  },
  {
    name: '@tanstack/react-query',
    version: '5.62.0',
    license: 'MIT',
    link: 'https://github.com/TanStack/query',
  },
  {
    name: 'class-variance-authority',
    version: '0.7.0',
    license: 'MIT',
    link: 'https://github.com/joe-bell/cva',
  },
  {
    name: 'clsx',
    version: '2.1.1',
    license: 'MIT',
    link: 'https://github.com/lukeed/clsx',
  },
  {
    name: 'framer-motion',
    version: '11.11.17',
    license: 'MIT',
    link: 'https://github.com/framer/motion',
  },
  {
    name: 'next-themes',
    version: '0.4.3',
    license: 'MIT',
    link: 'https://github.com/pacocoursey/next-themes',
  },
  {
    name: 'react-intersection-observer',
    version: '9.13.1',
    license: 'MIT',
    link: 'https://github.com/thebuilder/react-intersection-observer',
  },
  {
    name: 'react-responsive',
    version: '10.0.0',
    license: 'MIT',
    link: 'https://github.com/yocontra/react-responsive',
  },
  {
    name: 'tailwind-merge',
    version: '2.5.4',
    license: 'MIT',
    link: 'https://github.com/dcastil/tailwind-merge',
  },
  {
    name: 'tailwindcss-animate',
    version: '1.0.7',
    license: 'MIT',
    link: 'https://github.com/jamiebuilds/tailwindcss-animate',
  },
  {
    name: 'vaul',
    version: '1.1.1',
    license: 'MIT',
    link: 'https://github.com/emilkowalski/vaul',
  },
  {
    name: '@supabase/supabase-js',
    version: '2.46.2',
    license: 'MIT',
    link: 'https://github.com/supabase/supabase',
  },
]

export default function LicencePage() {
  const { setOpen } = useSidebar()

  useEffect(() => {
    setOpen(false)
  }, [setOpen])

  return (



    
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        오픈소스 라이선스
      </h1>
      <div className="grid gap-4 sm:gap-6">
        {licenses.map((lib) => (
          <Card key={lib.name} className="p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold">{lib.name}</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {lib.license}
                </span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium">버전 {lib.version}</p>
                <a
                  href={lib.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                >
                  소스코드
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 







 

      {/* Favorites Section */}
      {favourites.length > 0 && (
        <section className="p-8 xl:px-36">
          <div className="flex items-center justify-between">
            <Link href="/my/favorites" className="flex items-center gap-1">
              <h2 className="text-xl sm:text-2xl font-bold">마음에 들어요</h2>
              <ChevronRight className="h-6 w-6 text-muted-foreground" />
            </Link>
          </div>
          <Carousel className="px-4 sm:px-6 lg:px-8 w-full">
            <CarouselContent className="-ml-4">
              {favourites.slice(0, 10).map(({ novel }) => (
                <CarouselItem
                  key={novel.id}
                  className="basis-1/4 xl:basis-1/6 pl-4"
                >
                  <Link
                    href={`/novel/${novel.id}`}
                    className="group block transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1 active:scale-95"
                  >
                    <div className="aspect-[152/225] w-full relative overflow-hidden rounded-lg">
                      <BookCover
                        title={novel.title}
                        writer={novel.author}
                        genre="default"
                      />
                    </div>
                    <h3 className="mt-2 sm:mt-3 text-sm font-medium truncate group-hover:text-primary transition-colors">
                      {novel.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {novel.author}
                    </p>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      )}
