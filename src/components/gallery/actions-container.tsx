'use client'

import useHeader from '@/stores/headerStore'
import cn from '@/utils/cn'
import { useVirtualizedList } from '../virtualized-list'
import useOnScroll from '@/hooks/useOnScroll'
import { PropsWithChildren } from 'react'

const ActionsContainer = ({ children }: PropsWithChildren) => {
  const { rootRef } = useVirtualizedList()
  const isSnapping = useHeader((state) => state.isSnapping)
  const isActionsVisible = useHeader((state) => state.isActionsVisible)
  const setIsActionsVisible = useHeader((state) => state.setIsActionsVisible)

  useOnScroll<HTMLDivElement>({
    ref: rootRef,
    onScrollUp: () => setIsActionsVisible(true),
    onScrollDown: () => setIsActionsVisible(false)
  })

  // qrcode
  // const [qrcodeHidden, setQRCodeHidden] = useState(true)
  // const showQRCode = useCallback(
  //   () => setQRCodeHidden(false),
  //   [setQRCodeHidden]
  // )
  // const hideQRCode = useCallback(() => setQRCodeHidden(true), [setQRCodeHidden])

  // const [keywordFormHidden, setKeywordFormHidden] = useState(true)
  // const showKeywordForm = useCallback(
  //   () => setKeywordFormHidden(false),
  //   [setKeywordFormHidden]
  // )
  // const hideKeywordForm = useCallback(
  //   () => setKeywordFormHidden(true),
  //   [setKeywordFormHidden]
  // )

  // const stopSelecting = () => {
  //   setActions('default')
  //   media.forEach((m, key) => m.selected && toggleSelect(key))
  // }

  // const openKeyword = useCallback(() => {
  //   showKeywordForm()
  //   hideActions()
  // }, [showKeywordForm, hideActions])

  // const closeKeyword = useCallback(() => {
  //   hideKeywordForm()
  //   showActions()
  // }, [hideKeywordForm, showActions])

  // const onKeywordSubmit = async (keyword: string) => {
  //   const { keywordId, error } = await createKeyword(galleryId, keyword)
  //   if (!error) {
  //     setKeyword({ keyword, keywordId })
  //     hideKeywordForm()
  //   } else {
  //     setKeywordError('Keyword already in use.')
  //   }
  // }

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

  return (
    <div
      className={cn(
        'sticky top-0 transition-[translate] duration-300 z-50 flex items-center justify-between bg-black px-6 py-4',
        !isSnapping && !isActionsVisible && '-translate-y-full'
      )}
    >
      {children}
    </div>
  )
}

export default ActionsContainer
