import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from './providers'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/react'
import { AppSidebar } from '@/components/sidebar/sidebar'
const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-sans',
  weight: '100 900',
  display: 'swap',
})

const ridiBatang = localFont({
  src: './fonts/RIDIBatang.woff2',
  variable: '--font-serif',
  weight: '100 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Library of Ui',
  description: '블루아카이브 웹소설 공모전 백업',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${pretendard.variable} ${ridiBatang.variable} antialiased`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider
              style={
                {
                  '--sidebar-width': '18rem',
                } as React.CSSProperties
              }
            >
              <AppSidebar />
              <SidebarInset>
                <main>
                  {children}
                  <Analytics />
                </main>
                <Toaster
                  className={`z-50 bg-white dark:bg-black opacity-100 ${pretendard.className}`}
                />
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
