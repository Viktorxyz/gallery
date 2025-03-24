import { MediaMime } from '@/types/gallery'
import Image from 'next/image'
import { RefObject, useEffect, useRef } from 'react'
import Player from './Player'

type MediaProps = {
  active: boolean
  mapKey: string
  rootRef: RefObject<HTMLDivElement | null>
  src: string
  type: MediaMime
  muted: boolean
  toggleMuted: () => void
  onChange: (value: string) => void
  actionsHidden: boolean
}

const Media = ({
  active,
  mapKey,
  rootRef,
  src,
  type,
  muted,
  toggleMuted,
  onChange,
  actionsHidden
}: MediaProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (active)
      ref.current?.scrollIntoView({
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

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [mapKey, onChange, rootRef])

  return (
    <div
      ref={ref}
      className="relative min-w-screen h-screen snap-center snap-always"
    >
      {type === MediaMime.IMAGE ? (
        <Image src={src} fill alt="" className="object-contain" />
      ) : (
        <Player
          src={src}
          muted={muted}
          toggleMuted={toggleMuted}
          active={active}
          actionsHidden={actionsHidden}
        />
      )}
    </div>
  )
}

export default Media
