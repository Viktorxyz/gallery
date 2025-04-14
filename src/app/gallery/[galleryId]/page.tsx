import getGallery from '@/actions/getGallery'
import Actions from '@/components/gallery/actions'
import Gallery from '@/components/gallery/gallery'
import StickyElement from '@/components/gallery/sticky-element'
import TitleContainer from '@/components/gallery/title-container'
import Title from '@/components/gallery/title'
import TriggerElement from '@/components/gallery/trigger-element'
import { Direction, VirtualizedListRoot } from '@/components/virtualized-list'
import ActionsContainer from '@/components/gallery/actions-container'
import ActionsHeaderContainer from '@/components/gallery/actions-header-container'
import ActionsHeader from '@/components/gallery/actions-header'
import SelectActions from '@/components/gallery/select-actions'

export default async function Page({
  params
}: {
  params: Promise<{ galleryId: string }>
}) {
  const { galleryId } = await params
  const { galleryName, numberOfPhotos, numberOfVideos } = await getGallery({
    galleryId
  })

  return (
    <VirtualizedListRoot
      direction={Direction.VERTICAL}
      className="snap-y snap-proximity scrollbar-hidden"
    >
      <TitleContainer>
        <Title
          title={galleryName}
          numberOfPhotos={numberOfPhotos}
          numberOfVideos={numberOfVideos}
        />
      </TitleContainer>
      <StickyElement />
      <ActionsContainer>
        <ActionsHeaderContainer>
          <ActionsHeader
            title={galleryName}
            numberOfPhotos={numberOfPhotos}
            numberOfVideos={numberOfVideos}
          />
        </ActionsHeaderContainer>
        <Actions />
      </ActionsContainer>
      <TriggerElement />
      <Gallery />
      <SelectActions />
    </VirtualizedListRoot>
  )
}
