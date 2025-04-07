'use client'

import { IconPlus, IconQRCode } from '@/data/icons'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import Keyword from '../Keyword'
import { ActionsContextType, useActions } from '@/providers/ActionsProvider'
import createKeyword from '@/actions/createKeyword'
import QRCode from '../QRCode'
import useUserStore from '@/stores/userStore'
import { v4 as uuidv4 } from 'uuid'
import imageSize from 'image-size'
import useOnStuck from '@/hooks/useOnStuck'
import cn from '@/utils/cn'
import useWindowScroll from '@/hooks/useWindowScroll'
import { MediaMime, MediaType } from '@/types/gallery'
import getVideoDimensionsClient from '@/utils/getVideoDimensionsClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import uploadMedia, { UploadMediaProps } from '@/actions/uploadMedia'

type ActionsProps = {
  text: string
  numberOfPhotos: number
  numberOfVideos: number
  galleryId: string
}

type Dimensions = {
  width: number
  height: number
  duration?: number
}

const getImageDimensions = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  return imageSize(uint8Array)
}

const Actions = ({
  text,
  numberOfPhotos,
  numberOfVideos,
  galleryId
}: ActionsProps) => {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerHidden, setHeaderHidden] = useState(true)
  const [headerClosed, setHeaderClosed] = useState(false)
  const [keywordError, setKeywordError] = useState<string>()

  const { keyword, keywordId, setKeyword } = useUserStore()
  const { hideActions, showActions } = useActions() as ActionsContextType
  const { y } = useWindowScroll()
  const prevY = useRef(y)

  const queryClient = useQueryClient()
  const uploadMediaMutation = useMutation<
    { mediaId: string },
    Error,
    UploadMediaProps & { tempMediaId: string },
    MediaType[]
  >({
    mutationFn: ({ file, galleryId, keywordId }) =>
      uploadMedia({ file, galleryId, keywordId }),
    onMutate: async ({ file, galleryId, keywordId, tempMediaId }) => {
      if (!keywordId || !keyword) return

      await queryClient.cancelQueries({ queryKey: ['media'] })

      const previousMedia = queryClient.getQueryData<MediaType[]>(['media'])

      const type = file.type.startsWith('image')
        ? MediaMime.IMAGE
        : MediaMime.VIDEO
      const dimensions: Dimensions =
        type === MediaMime.IMAGE
          ? await getImageDimensions(file)
          : await getVideoDimensionsClient(file)

      const newMedia: MediaType = {
        mediaId: tempMediaId,
        keywordId,
        galleryId,
        src: URL.createObjectURL(file),
        uploading: true,
        selected: false,
        likesCount: 0,
        liked: false,
        keyword,
        aspectRatio: dimensions.width / dimensions.height,
        width: dimensions.width,
        height: dimensions.height,
        duration: dimensions.duration,
        createdAt: Date.now(),
        type
      }

      queryClient.setQueryData(['media'], (prev: MediaType[]) => [
        newMedia,
        ...prev
      ])

      return previousMedia
    },
    onSuccess: ({ mediaId }, newMedia) => {
      queryClient.setQueryData(['media'], (prev: MediaType[]) =>
        prev.map((m) =>
          m.mediaId === newMedia.tempMediaId
            ? { ...m, mediaId, uploading: false }
            : m
        )
      )
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(['media'], context)
    }
  })

  // qrcode
  const [qrcodeHidden, setQRCodeHidden] = useState(true)
  const showQRCode = useCallback(
    () => setQRCodeHidden(false),
    [setQRCodeHidden]
  )
  const hideQRCode = useCallback(() => setQRCodeHidden(true), [setQRCodeHidden])

  const [keywordFormHidden, setKeywordFormHidden] = useState(true)
  const showKeywordForm = useCallback(
    () => setKeywordFormHidden(false),
    [setKeywordFormHidden]
  )
  const hideKeywordForm = useCallback(
    () => setKeywordFormHidden(true),
    [setKeywordFormHidden]
  )

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!keywordId) return

    if (e.target.files) {
      const files = Array.from(e.target.files)
      for (const file of files) {
        const tempMediaId = uuidv4()
        uploadMediaMutation.mutate({ file, galleryId, keywordId, tempMediaId })
      }
    }
  }

  // const stopSelecting = () => {
  //   setActions('default')
  //   media.forEach((m, key) => m.selected && toggleSelect(key))
  // }

  const openKeyword = useCallback(() => {
    showKeywordForm()
    hideActions()
  }, [showKeywordForm, hideActions])

  const closeKeyword = useCallback(() => {
    hideKeywordForm()
    showActions()
  }, [hideKeywordForm, showActions])

  const onKeywordSubmit = async (keyword: string) => {
    const { keywordId, error } = await createKeyword(galleryId, keyword)
    if (!error) {
      setKeyword({ keyword, keywordId })
      hideKeywordForm()
    } else {
      setKeywordError('Keyword already in use.')
    }
  }

  // const downloadSelectedImages = async () => {
  //   const zip = new JSZip()
  //   const folder = zip.folder('images')

  //   const downloadPromises = Array.from(media.entries()).map(
  //     async ([key, m]) => {
  //       if (m.selected) {
  //         try {
  //           const response = await fetch(m.src)
  //           const blob = await response.blob()
  //           folder.file(`${key}.jpg`, blob)
  //         } catch (error) {
  //           console.error(`Failed to fetch ${m.src}`, error)
  //         }
  //       }
  //     }
  //   )

  //   await Promise.all(downloadPromises)

  //   const zipBlob = await zip.generateAsync({ type: 'blob' })
  //   saveAs(zipBlob, 'images.zip')
  //   stopSelecting()
  // }

  const showHeader = useCallback(() => setHeaderHidden(false), [])
  const hideHeader = useCallback(() => setHeaderHidden(true), [])

  useOnStuck(showHeader, hideHeader, { target: headerRef })

  useEffect(() => {
    if (y > prevY.current && !headerHidden) setHeaderClosed(true)
    else setHeaderClosed(false)
    prevY.current = y
  }, [headerHidden, prevY, y])

  return (
    <>
      <div
        ref={headerRef}
        className={cn(
          'opacity-0 transition-[translate] duration-300 z-50 flex items-center justify-between sticky -top-px bg-black px-6 py-4',
          headerClosed && '-translate-y-full'
        )}
      >
        <div
          className={cn(
            'flex flex-col transition-opacity',
            headerHidden && 'opacity-0'
          )}
        >
          <div className="text-base">{text}</div>
          <div className="text-sm text-zinc-400">
            {numberOfPhotos} photos {numberOfVideos} videos
          </div>
        </div>
        <div className="flex gap-6">
          <IconQRCode onClick={showQRCode} className="icon-action" />
          <label>
            <IconPlus className="icon-action scale-110" />
            {keywordId ? (
              <input
                onChange={onFileChange}
                className="hidden"
                type="file"
                accept="image/*,video/*"
                multiple
              />
            ) : (
              <input type="button" className="hidden" onClick={openKeyword} />
            )}
          </label>
        </div>
      </div>
      {!qrcodeHidden && <QRCode onClickAway={hideQRCode} />}
      {!keywordFormHidden && (
        <Keyword
          error={keywordError}
          onClickAway={closeKeyword}
          onSubmit={onKeywordSubmit}
        />
      )}
    </>
  )
}

export default Actions
