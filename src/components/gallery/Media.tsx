'use client'

import { IconCheck, IconHeartFill } from '@/data/icons'
import useLongPress from '@/hooks/useLongPress'
import Spinner from '../Spinner'
import { useActions } from '@/providers/ActionsProvider'
import { useCallback } from 'react'
import useUserStore from '@/stores/userStore'
import cn from '@/utils/cn'
import Image from 'next/image'
import { MediaMime, MediaType } from '@/types/gallery'
import VideoBadge from './VideoBadge'
import { useRouter, usePathname } from 'next/navigation'

type MediaProps = {
  media: MediaType
  pinching: boolean
}

const Media = ({ media, pinching }: MediaProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { aspectRatio, selected, uploading, liked, type, src } = media
  const { zoomLevel } = useUserStore()
  const { actions, setActions } = useActions()

  const gap = (-1 / 2) * zoomLevel + 9 / 2

  const select = useCallback(() => {
    setActions('selecting')
  }, [setActions])

  const onClick = useCallback(() => {
    if (actions === 'selecting') console.log('select')
    else {
      const searchParams = new URLSearchParams({ i: media.mediaId })
      router.push(pathname + '/carousel?' + searchParams.toString(), {
        scroll: false
      })
    }
  }, [actions, media.mediaId, pathname, router])

  const ref = useLongPress<HTMLDivElement>(select)

  return (
    <div
      ref={ref}
      className={cn(
        'grid relative p-2 transition-[aspect-ratio] duration-300',
        pinching && 'transition-none'
        // 'border-[1px] border-green-400'
      )}
      style={{
        aspectRatio
      }}
      onClick={onClick}
    >
      {/* <div className="absolute top-0 left-0 w-full h-full bg-blue-950"></div> */}
      {selected ? (
        <div className="flex justify-end items-end absolute inset-0 bg-black/75">
          <IconCheck className="m-6 size-6 icon-action" />
        </div>
      ) : uploading ? (
        <Spinner className="self-center justify-self-center" />
      ) : (
        zoomLevel < 4 &&
        liked && (
          <IconHeartFill className="z-10 fill-rose-500 justify-self-end" />
        )
      )}
      {type === MediaMime.IMAGE ? (
        <Image
          className="object-cover z-0"
          style={{
            padding: `${gap}px`
          }}
          src={src}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt=""
        />
      ) : (
        <>
          <video
            className="object-cover"
            style={{ padding: `${gap}px` }}
            src={src}
            muted
          />
          <VideoBadge margin={gap} />
        </>
      )}
    </div>
  )
}

export default Media
