'use client'

import { IconPlus, IconQRCode } from '@/data/icons'
import useLongPressAway from 'hooks/useLongPressAway'
import useWindowScroll from 'hooks/useWindowScroll'
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import Keyword from './Keyword'
import { useParams } from 'next/navigation'
import { useActions } from '@/providers/ActionsProvider'
import createKeyword from '@/actions/createKeyword'
import QRCode from './QRCode'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import useUserStore from '@/stores/userStore'
import useGalleryStore from '@/stores/galleryStore'
import uploadFile from '@/actions/uploadFile'
import { GalleryId, GalleryImage, GalleryMap } from '@/types/gallery'
import { v4 as uuidv4 } from 'uuid'
import imageSize from 'image-size'
import useOnStuck from '@/hooks/useOnStuck'
import cn from '@/utils/cn'

type ActionsProps = {
  text: string
  numberOfPhotos: number
  numberOfVideos: number
}

const Actions = ({ text, numberOfPhotos, numberOfVideos }: ActionsProps) => {
  const headerRef = useRef(null)
  const [headerHidden, setHeaderHidden] = useState(true)
  const [keywordError, setKeywordError] = useState<string>(null)

  const { galleryId } = useParams<{ galleryId: string }>()
  const { keyword, keywordId, setKeyword } = useUserStore()
  const { setActions, hideActions, showActions } = useActions()
  const { images, toggleSelect, setImage, addImages } = useGalleryStore()

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

  const uploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)

      const filesWithTempKey = files.map((file) => ({ key: uuidv4(), file }))

      const imagesArrayPromise = filesWithTempKey.map(async ({ key, file }) => {
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        const { width, height } = imageSize(uint8Array)
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
            width,
            height,
            aspectRatio: width / height
          }
        ] as [string, GalleryImage]
      })

      const imagesArray = await Promise.all(imagesArrayPromise)

      const images: GalleryMap = new Map<GalleryId, GalleryImage>(imagesArray)

      addImages(images)

      for (const { key, file } of filesWithTempKey) {
        const onUploaded = async () => {
          const { id } = await uploadFile(keywordId, galleryId, file)
          setImage(key, {
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
    images.forEach((image, key) => image.selected && toggleSelect(key))
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

    const downloadPromises = Array.from(images.entries()).map(
      async ([key, image]) => {
        if (image.selected) {
          try {
            const response = await fetch(image.src)
            const blob = await response.blob()
            folder.file(`${key}.jpg`, blob)
          } catch (error) {
            console.error(`Failed to fetch ${image.src}`, error)
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

  return (
    <>
      <header
        ref={headerRef}
        className="z-50 flex items-center justify-between sticky -top-px bg-black px-6 py-4"
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
                onChange={uploadImages}
                className="hidden"
                type="file"
                accept="image/*"
                multiple
              />
            ) : (
              <input type="button" className="hidden" onClick={openKeyword} />
            )}
          </label>
        </div>
      </header>
      {/* <div
        ref={ref}
        className={cn(
          'w-full fixed bottom-0 p-6 transition-all duration-300',
          actionsHidden
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 pointer-events-auto'
        )}
      >
        <div
          className={cn(
            'flex items-center justify-around bg-black rounded-3xl transition-all duration-300 justify-self-center',
            actionsClosed ? 'size-8' : 'w-full h-[72px]'
          )}
        >
          {actionsClosed ? (
            <IconMenu onClick={openActions} className="scale-75 icon-action" />
          ) : actions === 'default' ? (
            <>
              <IconQRCode onClick={showQRCode} className="icon-action" />
              <label>
                <IconImageThin className="icon-action scale-110" />
                {keywordId ? (
                  <input
                    onChange={uploadImages}
                    className="hidden"
                    type="file"
                    multiple
                  />
                ) : (
                  <input
                    type="button"
                    className="hidden"
                    onClick={openKeyword}
                  />
                )}
              </label>
              <IconX onClick={closeActions} className="icon-action" />
            </>
          ) : (
            <>
              <IconX className="icon-action" onClick={stopSelecting} />
              <IconDownload
                className="icon-action"
                onClick={downloadSelectedImages}
              />
            </>
          )}
        </div>
      </div> */}
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
