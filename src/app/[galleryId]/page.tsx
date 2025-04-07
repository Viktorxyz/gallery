import getGallery from '@/actions/getGallery'
import Actions from '@/components/gallery/Actions'
import Gallery from '@/components/gallery/Gallery'
import Header from '@/components/gallery/Header'
import { Direction } from '@/components/VirtualizedList/types'
import VirtualizedListRoot from '@/components/VirtualizedList/VirtualizedListRoot'
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
        <VirtualizedListRoot direction={Direction.VERTICAL}>
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
        </VirtualizedListRoot>
      </ActionsProvider>
    </ToastProvider>
  )
}
