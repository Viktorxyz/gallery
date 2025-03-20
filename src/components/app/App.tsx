'use client'

import { AppScreen, useApp } from '@/providers/AppProvider'
import Gallery from '../gallery/Gallery'
import Carousel from '../carousel/Carousel'

const App = () => {
  const { screen } = useApp()

  if (screen === AppScreen.GALLERY) return <Gallery />
  if (screen === AppScreen.CAROUSEL) return <Carousel />
}

export default App
