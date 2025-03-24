import { RowMediaType, RowType } from '@/types/gallery'
import { chunkArray } from './array'

const generateMediaRows = (
  media: RowMediaType[],
  zoomLevel: number
): RowType[] => {
  const rounded = Math.ceil(zoomLevel)
  const imageRows: RowType[] = []
  let currentRow: RowType = { aspectRatio: 0, media: [] }

  if (zoomLevel >= 2)
    return chunkArray(media, rounded).map((media) => ({
      aspectRatio: zoomLevel,
      media: media.map((image) => ({ ...image, aspectRatio: 1 }))
    }))

  for (const image of media) {
    currentRow.aspectRatio += image.aspectRatio
    const transformedImage =
      zoomLevel > 1
        ? {
            ...image,
            aspectRatio:
              (1 - image.aspectRatio) * zoomLevel + (2 * image.aspectRatio - 1)
          }
        : image
    currentRow.media.push(transformedImage)

    if (currentRow.aspectRatio >= 1 && currentRow.aspectRatio <= 3) {
      if (zoomLevel > 1) {
        for (let j = 0; j < 2 - currentRow.media.length; j++)
          currentRow.media.push(transformedImage)
        currentRow.aspectRatio =
          (2 - currentRow.aspectRatio) * zoomLevel +
          2 * (currentRow.aspectRatio - 1)
      }
      imageRows.push(currentRow)
      currentRow = { aspectRatio: 0, media: [] }
    }
  }

  if (currentRow.media.length > 0) imageRows.push(currentRow)
  return imageRows
}

export default generateMediaRows
