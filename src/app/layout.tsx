/* eslint-disable @next/next/no-sync-scripts */
import Main from '@/components/global/Main'
import '@/styles/globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import cn from '@/utils/cn'
import Providers from '@/providers/Providers'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body className={cn('bg-black', inter.className)}>
        <Providers>
          <Main>{children}</Main>
        </Providers>
      </body>
    </html>
  )
}
