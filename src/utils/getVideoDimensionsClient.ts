const getVideoDimensionsClient = (
  file: File
): Promise<{ width: number; height: number; duration: number }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src)
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration
      })
    }

    video.onerror = (error) => {
      console.error('Error loading video metadata', error)
      reject(new Error('Error loading video metadata'))
    }

    video.src = window.URL.createObjectURL(file)
  })
}

export default getVideoDimensionsClient
