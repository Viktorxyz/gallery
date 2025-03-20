import Main from '@/components/global/Main'
import '@/styles/globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import cn from '@/utils/cn'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
      />
      <body className={cn('bg-black', inter.className)}>
        <Main>{children}</Main>
      </body>
    </html>
  )
}
