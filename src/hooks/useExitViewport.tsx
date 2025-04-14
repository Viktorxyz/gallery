'use client'

import { RefObject, useEffect, useRef } from 'react'

type Props<T> = {
  ref?: RefObject<T | null>
  onExit: () => void
  onEnter: () => void
}

function useExitViewport<T extends HTMLElement>({
  ref,
  onExit,
  onEnter
}: Props<T>) {
  const defaultRef = useRef<T>(null)
  ref = ref ?? defaultRef

  useEffect(() => {
    const target = ref.current

    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) onExit()
        else onEnter()
      },
      {
        threshold: 0
      }
    )

    observer.observe(target)

    return () => observer.unobserve(target)
  }, [onEnter, onExit, ref])

  return { ref }
}

export default useExitViewport
