'use client'

import { IconPlus, IconQRCode } from '@/data/icons'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import Keyword from '../Keyword'
import { useActions } from '@/providers/ActionsProvider'
import createKeyword from '@/actions/createKeyword'
import QRCode from '../QRCode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import useUserStore from '@/stores/userStore'
import uploadFile from '@/actions/uploadFile'
import { v4 as uuidv4 } from 'uuid'
import imageSize from 'image-size'
import useOnStuck from '@/hooks/useOnStuck'
import cn from '@/utils/cn'
import useWindowScroll from '@/hooks/useWindowScroll'
import { GalleryId, MediaMap, MediaMime, MediaType } from '@/types/gallery'
import { useGallery } from '@/providers/GalleryProvider'
import getVideoDimensionsClient from '@/utils/getVideoDimensionsClient'

type ActionsProps = {
  text: string
  numberOfPhotos: number
  numberOfVideos: number
}

const Actions = ({ text, numberOfPhotos, numberOfVideos }: ActionsProps) => {
  const media = useGallery((state) => state.media)
  const setSingleMedia = useGallery((state) => state.setSingleMedia)
  const addMedia = useGallery((state) => state.addMedia)
  const toggleSelect = useGallery((state) => state.toggleSelect)
  const galleryId = useGallery((state) => state.galleryId)

  const headerRef = useRef(null)
  const [headerHidden, setHeaderHidden] = useState(true)
  const [headerClosed, setHeaderClosed] = useState(false)
  const [keywordError, setKeywordError] = useState<string>(null)

  const { keyword, keywordId, setKeyword } = useUserStore()
  const { setActions, hideActions, showActions } = useActions()
  const { y } = useWindowScroll()
  const [prevY, setPrevY] = useState(y)

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

  const uploadMedia = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      const filesWithTempKey = files.map((file) => ({ key: uuidv4(), file }))

      const mediaPromise = filesWithTempKey.map(async ({ key, file }) => {
        const metadata = {
          width: 0,
          height: 0,
          aspectRatio: 0,
          duration: undefined,
          type: undefined
        }
        if (file.type.startsWith('image')) {
          const arrayBuffer = await file.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)
          const { width, height } = imageSize(uint8Array)
          metadata.width = width
          metadata.height = height
          metadata.aspectRatio = width / height
          metadata.type = MediaMime.IMAGE
        } else if (file.type.startsWith('video')) {
          const { width, height, duration } = await getVideoDimensionsClient(
            file
          )
          metadata.width = width
          metadata.height = height
          metadata.aspectRatio = width / height
          metadata.duration = duration
          metadata.type = MediaMime.VIDEO
        }

        return [
          key,
          {
            id: key,
            src: URL.createObjectURL(file),
            uploading: true,
            selected: false,
            liked: false,
            likes: 0,
            keyword,
            width: metadata.width,
            height: metadata.height,
            duration: metadata.duration,
            type: metadata.type,
            aspectRatio: metadata.aspectRatio
          }
        ] as [string, MediaType]
      })

      const mediaArray = await Promise.all(mediaPromise)

      const mediaMap: MediaMap = new Map<GalleryId, MediaType>(mediaArray)

      addMedia(mediaMap)

      for (const { key, file } of filesWithTempKey) {
        const onUploaded = async () => {
          const { id } = await uploadFile(keywordId, galleryId, file)
          setSingleMedia(key, {
            id,
            uploading: false
          })
        }
        onUploaded()
      }
    }
  }

  const stopSelecting = () => {
    setActions('default')
    media.forEach((m, key) => m.selected && toggleSelect(key))
  }

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

  const downloadSelectedImages = async () => {
    const zip = new JSZip()
    const folder = zip.folder('images')

    const downloadPromises = Array.from(media.entries()).map(
      async ([key, m]) => {
        if (m.selected) {
          try {
            const response = await fetch(m.src)
            const blob = await response.blob()
            folder.file(`${key}.jpg`, blob)
          } catch (error) {
            console.error(`Failed to fetch ${m.src}`, error)
          }
        }
      }
    )

    await Promise.all(downloadPromises)

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'images.zip')
    stopSelecting()
  }

  const showHeader = useCallback(() => setHeaderHidden(false), [])
  const hideHeader = useCallback(() => setHeaderHidden(true), [])

  useOnStuck(showHeader, hideHeader, { target: headerRef })

  useEffect(() => {
    if (y > prevY && !headerHidden) setHeaderClosed(true)
    else setHeaderClosed(false)
    setPrevY(y)
  }, [y])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'transition-[translate] duration-300 z-50 flex items-center justify-between sticky -top-px bg-black px-6 py-4',
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
                onChange={uploadMedia}
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
      </header>
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
