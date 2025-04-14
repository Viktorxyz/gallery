import imageSize from 'image-size'

async function getImageDimensions(file: File) {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const { width, height } = imageSize(uint8Array)
  return { width, height }
}

export default getImageDimensions
