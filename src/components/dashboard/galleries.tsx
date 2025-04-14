import getGalleries from '@/actions/getGalleries'
import Row from './row'
import { GalleryMetadata } from '@/types/gallery'
import cn from '@/utils/cn'

type GalleriesProps = {
  className?: string
}

async function Galleries({ className }: GalleriesProps) {
  const { galleries } = await getGalleries()

  const mapped: GalleryMetadata[] = galleries.map((gallery) => ({
    galleryId: gallery.gallery_id,
    galleryName: gallery.gallery_name,
    numberOfPhotos: gallery.number_of_images,
    numberOfVideos: gallery.number_of_videos,
    numberOfUsers: gallery.number_of_users
  }))

  return (
    <div className={cn('flex flex-col flex-1 gap-8 pb-6', className)}>
      {mapped.map((gallery, i) => (
        <Row gallery={gallery} index={i + 1} key={i} />
      ))}
    </div>
  )
}

export default Galleries
