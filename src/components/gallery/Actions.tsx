'use client'

import {
  IconDownload,
  IconKey,
  IconMenu,
  IconPlus,
  IconQRCode,
  IconX
} from '@/data/icons'
import useLongPressAway from 'hooks/useLongPressAway'
import useWindowScroll from 'hooks/useWindowScroll'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import cn from 'utils/cn'
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

const Actions = () => {
  const {
    actions,
    setActions,
    actionsClosed,
    actionsHidden,
    hideActions,
    showActions,
    openActions,
    closeActions
  } = useActions()
  const { y } = useWindowScroll()
  const { galleryId } = useParams<{ galleryId: string }>()
  const { keywordId, setKeyword } = useUserStore()
  const { images, toggleSelect } = useGalleryStore()

  // qrcode
  const [qrcodeHidden, setQRCodeHidden] = useState(true)
  const showQRCode = useCallback(
    () => setQRCodeHidden(false),
    [setQRCodeHidden]
  )
  const hideQRCode = useCallback(() => setQRCodeHidden(true), [setQRCodeHidden])

  // keyword form
  const [keywordFormHidden, setKeywordFormHidden] = useState(true)
  const showKeywordForm = useCallback(
    () => setKeywordFormHidden(false),
    [setKeywordFormHidden]
  )
  const hideKeywordForm = useCallback(
    () => setKeywordFormHidden(true),
    [setKeywordFormHidden]
  )

  // on long press away hide actions
  const ref = useLongPressAway<HTMLDivElement>(hideActions, showActions)

  // on scroll hide actions
  useEffect(() => {
    const id = setTimeout(showActions, 300)
    hideActions()
    return () => clearTimeout(id)
  }, [y, hideActions, showActions])

  // uploading images
  const uploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      for (const file of files) await uploadFile(keywordId, galleryId, file)
    }
  }

  const stopSelecting = () => {
    setActions('default')
    images.forEach((image, id) => image.selected && toggleSelect(id))
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
    }
  }

  const downloadSelectedImages = async () => {
    const zip = new JSZip()
    const folder = zip.folder('images')

    const downloadPromises = Array.from(images.entries()).map(
      async ([id, image]) => {
        if (image.selected) {
          try {
            const response = await fetch(image.src)
            const blob = await response.blob()
            folder.file(`${id}.jpg`, blob)
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

  return (
    <>
      <div
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
              <IconKey onClick={openKeyword} className="icon-action" />
              <IconQRCode onClick={showQRCode} className="icon-action" />
              <label>
                <IconPlus className="icon-action" />
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
      </div>
      {!qrcodeHidden && <QRCode onClickAway={hideQRCode} />}
      {!keywordFormHidden && (
        <Keyword onClickAway={closeKeyword} onSubmit={onKeywordSubmit} />
      )}
    </>
  )
}

export default Actions
