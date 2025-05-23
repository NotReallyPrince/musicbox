import type { Metadata } from 'next'
import { Lexend_Deca } from 'next/font/google'
import '@/styles/globals.css'
import AppLayout from '@/components/layouts/AppLayout'
import PlayerLayout from '@/components/layouts/PlayerLayout'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from '@/redux/store'

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
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AppLayout>
              <PlayerLayout>
                {children}
              </PlayerLayout>
            </AppLayout>
          </PersistGate>
        </Provider>
      </body>
    </html>
  )
}