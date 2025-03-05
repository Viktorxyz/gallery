import { GalleryImage, RowType } from '@/types/gallery'
import { chunkArray } from './array'

const generateImageRows = (
  imagesArray: GalleryImage[],
  zoomLevel: number
): RowType[] => {
  const rounded = Math.ceil(zoomLevel)
  const imageRows: RowType[] = []
  let currentRow: RowType = { aspectRatio: 0, images: [] }

  if (zoomLevel >= 2)
    return chunkArray(imagesArray, rounded).map((images) => ({
      aspectRatio: zoomLevel,
      images: images.map((image) => ({ ...image, aspectRatio: 1 }))
    }))

  for (const image of imagesArray) {
    currentRow.aspectRatio += image.aspectRatio
    const transformedImage =
      zoomLevel > 1
        ? {
            ...image,
            aspectRatio:
              (1 - image.aspectRatio) * zoomLevel + (2 * image.aspectRatio - 1)
          }
        : image
    currentRow.images.push(transformedImage)

    if (currentRow.aspectRatio >= 1 && currentRow.aspectRatio <= 3) {
      if (zoomLevel > 1) {
        for (let j = 0; j < 2 - currentRow.images.length; j++)
          currentRow.images.push(transformedImage)
        currentRow.aspectRatio =
          (2 - currentRow.aspectRatio) * zoomLevel +
          2 * (currentRow.aspectRatio - 1)
      }
      imageRows.push(currentRow)
      currentRow = { aspectRatio: 0, images: [] }
    }
  }

  if (currentRow.images.length > 0) imageRows.push(currentRow)
  return imageRows
}

export default generateImageRows
