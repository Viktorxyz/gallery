'use client'

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState
} from 'react'

export enum AppScreen {
  GALLERY = 'GALLERY',
  CAROUSEL = 'CAROUSEL'
}

type ShowCarouselOptions = {
  scrollTo: string
}

export type AppContextType = {
  screen: AppScreen
  showGallery: () => void
  showCarousel: (options: ShowCarouselOptions) => void
  carouselInitial: string
}

const AppContext = createContext<AppContextType | null>(null)

type AppProviderProps = PropsWithChildren

const AppProvider = ({ children }: AppProviderProps) => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.GALLERY)
  const [carouselInitial, setCarouselInitial] = useState<string>('')

  const showGallery = useCallback(() => setScreen(AppScreen.GALLERY), [])
  const showCarousel = useCallback((options: ShowCarouselOptions) => {
    const { scrollTo } = options
    setScreen(AppScreen.CAROUSEL)
    setCarouselInitial(scrollTo)
  }, [])

  const value = {
    screen,
    showGallery,
    showCarousel,
    carouselInitial
  }

  return <AppContext value={value}>{children}</AppContext>
}

export const useApp = () => useContext(AppContext)

export default AppProvider
