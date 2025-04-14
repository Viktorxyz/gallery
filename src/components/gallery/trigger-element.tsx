'use client'

import useExitViewport from '@/hooks/useExitViewport'
import useHeader from '@/stores/headerStore'
import React from 'react'

function TriggerElement() {
  const setIsSnapping = useHeader((state) => state.setIsSnapping)

  const { ref } = useExitViewport<HTMLDivElement>({
    onExit: () => setIsSnapping(false),
    onEnter: () => setIsSnapping(true)
  })

  return <div ref={ref} className="w-full h-0"></div>
}

export default TriggerElement
