import getGallery from '@/actions/getGallery'
import Actions from '@/components/gallery/Actions'
import Gallery from '@/components/gallery/Gallery'
import Header from '@/components/gallery/Header'
import ActionsProvider from '@/providers/ActionsProvider'
import KeywordProvider from '@/providers/KeywordProvider'
import ToastProvider from '@/providers/ToastProvider'

export default async function Page({
  params
}: {
  params: Promise<{ galleryId: string }>
}) {
  const { galleryId } = await params
  const { gallery, galleryName } = await getGallery({ galleryId })

  return (
    <ActionsProvider>
      <ToastProvider>
        <KeywordProvider>
          <Header text={galleryName} />
          <Actions text={galleryName} numberOfPhotos={0} numberOfVideos={0} />
          <Gallery initialImages={gallery} />
        </KeywordProvider>
      </ToastProvider>
    </ActionsProvider>
  )
}
