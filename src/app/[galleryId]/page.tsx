import getGallery from '@/actions/getGallery'
import Actions from '@/components/gallery/Actions'
import Gallery from '@/components/gallery/Gallery'
import Header from '@/components/gallery/Header'
import ActionsProvider from '@/providers/ActionsProvider'
import ToastProvider from '@/providers/ToastProvider'

export default async function Page({
  params
}: {
  params: Promise<{ galleryId: string }>
}) {
  const { galleryId } = await params
  const { galleryName, numberOfImages, numberOfVideos } = await getGallery({
    galleryId
  })

  return (
    <ToastProvider>
      <ActionsProvider>
        <Header
          text={galleryName}
          numberOfImages={numberOfImages}
          numberOfVideos={numberOfVideos}
        />
        <Actions
          galleryId={galleryId}
          text={galleryName}
          numberOfPhotos={numberOfImages}
          numberOfVideos={numberOfVideos}
        />
        <Gallery />
      </ActionsProvider>
    </ToastProvider>
  )
}
