import CarouselProvider from '@/providers/carousel-provider'
import React, { PropsWithChildren } from 'react'

function Layout({ children }: PropsWithChildren) {
  return <CarouselProvider>{children}</CarouselProvider>
}

export default Layout
