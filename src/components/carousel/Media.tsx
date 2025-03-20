import { MediaMime } from '@/types/gallery'
import Image from 'next/image'
import { RefObject, useEffect, useRef } from 'react'

type MediaProps = {
  active: boolean
  mapKey: string
  rootRef: RefObject<HTMLDivElement>
  src: string
  type: MediaMime
  duration: number
  onChange: (value: string) => void
}

const Media = ({
  active,
  mapKey,
  rootRef,
  src,
  type,
  duration,
  onChange
}: MediaProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (active)
      ref.current.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'center'
      })
  }, [active])

  useEffect(() => {
    if (!rootRef?.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onChange(mapKey)
      },
      {
        root: rootRef.current,
        threshold: 1
      }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative min-w-screen h-screen snap-center snap-always"
    >
      {type === MediaMime.IMAGE ? (
        <Image src={src} fill alt="" className="object-contain" />
      ) : (
        <video src={src} autoPlay muted />
      )}
    </div>
  )
}

export default Media
