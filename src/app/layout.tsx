import type { Metadata } from 'next'
import { Lexend_Deca } from 'next/font/google'
import '@/styles/globals.css'
import AppLayout from '@/components/layouts/AppLayout'
import PlayerLayout from '@/components/layouts/PlayerLayout'
import ReduxProvider from '@/components/providers/ReduxProvider'
import ThemeProvider from '@/components/providers/ThemeProvider'

const lexendDeca = Lexend_Deca({ subsets: ['latin'], weight: ['300', '400', '500', '700'] })

export const metadata: Metadata = {
  title: 'MusicBox',
  description: 'A modern music player built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lexendDeca.className}>
        <ReduxProvider>
          <ThemeProvider>
            <AppLayout>
              <PlayerLayout>
                {children}
              </PlayerLayout>
            </AppLayout>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}