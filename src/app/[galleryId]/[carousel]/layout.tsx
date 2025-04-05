import CarouselProvider from '@/providers/CarouselProvider'
import React, { PropsWithChildren } from 'react'

function Layout({ children }: PropsWithChildren) {
  console.log('layout')

  return <CarouselProvider>{children}</CarouselProvider>
}

export default Layout
