import { RefObject, useCallback, useEffect, useRef } from 'react'

type Props<T> = {
  ref?: RefObject<T | null>
  onScrollUp: () => void
  onScrollDown: () => void
}

function useOnScroll<T extends HTMLElement>({
  ref,
  onScrollUp,
  onScrollDown
}: Props<T>) {
  const defaultRef = useRef<T>(null)
  ref = ref ?? defaultRef

  const onScrollUpRef = useRef(onScrollUp)
  const onScrollDownRef = useRef(onScrollDown)

  const prevY = useRef<number>(0)

  const onScroll = useCallback((e: Event) => {
    const target = e.target as HTMLElement

    const y = target.scrollTop

    if (prevY.current < y) onScrollDownRef.current()
    else onScrollUpRef.current()

    prevY.current = y
  }, [])

  useEffect(() => {
    const target = ref.current

    if (!target) return

    prevY.current = target.scrollTop
    target.addEventListener('scroll', onScroll)

    return () => target.removeEventListener('scroll', onScroll)
  }, [onScroll, ref])

  return { ref }
}

export default useOnScroll
