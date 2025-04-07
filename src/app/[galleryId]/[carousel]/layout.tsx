import CarouselProvider from '@/providers/CarouselProvider'
import React, { PropsWithChildren } from 'react'

function Layout({ children }: PropsWithChildren) {
  return <CarouselProvider>{children}</CarouselProvider>
}

export default Layout
