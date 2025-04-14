'use client'

import useExitViewport from '@/hooks/useExitViewport'
import useHeader from '@/stores/headerStore'
import cn from '@/utils/cn'
import { PropsWithChildren } from 'react'

function TitleContainer({ children }: PropsWithChildren) {
  const isSnapping = useHeader((state) => state.isSnapping)
  const setIsTitleVisible = useHeader((state) => state.setIsTitleVisible)

  const { ref } = useExitViewport<HTMLDivElement>({
    onExit: () => setIsTitleVisible(false),
    onEnter: () => setIsTitleVisible(true)
  })

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col items-center justify-center h-[25vh] min-h-48',
        isSnapping && 'snap-start'
      )}
    >
      {children}
    </div>
  )
}

export default TitleContainer
