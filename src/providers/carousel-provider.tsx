'use client'

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState
} from 'react'

export type CarouselContextType = {
  muted: boolean
  actions: boolean
  toggleMuted: () => void
  toggleActions: () => void
}

const CarouselContext = createContext<CarouselContextType | null>(null)

function CarouselProvider({ children }: PropsWithChildren) {
  const [actions, setActions] = useState(false)
  const [muted, setMuted] = useState(true)

  const toggleMuted = useCallback(() => setMuted((prev) => !prev), [])
  const toggleActions = useCallback(() => setActions((prev) => !prev), [])

  const value = {
    muted,
    actions,
    toggleMuted,
    toggleActions
  }

  return <CarouselContext value={value}>{children}</CarouselContext>
}

export const useCarousel = () =>
  useContext(CarouselContext) as CarouselContextType

export default CarouselProvider
