import { Readable } from 'stream'

const getVideoDimensionsServer = async (
  file: File
): Promise<{ width: number; height: number; duration: number }> => {
  const { default: ffmpeg } = await import('fluent-ffmpeg')

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const readable = Readable.from(buffer)

  return new Promise((resolve, reject) => {
    ffmpeg(readable).ffprobe((err, metadata) => {
      if (err)
        return reject(new Error('Error loading video metadata on server'))

      const stream = metadata.streams.find((s) => s.codec_type === 'video')
      if (stream)
        resolve({
          width: stream.width,
          height: stream.height,
          duration: metadata.format.duration
        })
      else reject(new Error('No video stream found.'))
    })
  })
}

export default getVideoDimensionsServer
