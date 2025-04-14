import uploadMedia, { UploadMediaProps } from '@/actions/uploadMedia'
import { MediaMime, MediaType } from '@/types/gallery'
import getImageDimensions from '@/utils/getImageDimensions'
import getVideoDimensionsClient from '@/utils/getVideoDimensionsClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Dimensions = {
  width: number
  height: number
  duration?: number
}

function useUploadMediaMutation() {
  const queryClient = useQueryClient()
  const uploadMediaMutation = useMutation<
    { mediaId: string },
    Error,
    UploadMediaProps & { tempMediaId: string },
    MediaType[]
  >({
    mutationFn: ({ file, galleryId, keywordId }) =>
      uploadMedia({ file, galleryId, keywordId }),
    onMutate: async ({ file, galleryId, keywordId, tempMediaId }) => {
      await queryClient.cancelQueries({ queryKey: ['media'] })
      const previousMedia = queryClient.getQueryData<MediaType[]>(['media'])
      const type = file.type.startsWith('image')
        ? MediaMime.IMAGE
        : MediaMime.VIDEO
      const dimensions: Dimensions =
        type === MediaMime.IMAGE
          ? await getImageDimensions(file)
          : await getVideoDimensionsClient(file)
      const newMedia: MediaType = {
        mediaId: tempMediaId,
        keywordId,
        galleryId,
        src: URL.createObjectURL(file),
        uploading: true,
        selected: false,
        likesCount: 0,
        liked: false,
        keyword,
        aspectRatio: dimensions.width / dimensions.height,
        width: dimensions.width,
        height: dimensions.height,
        duration: dimensions.duration,
        createdAt: Date.now(),
        type
      }
      queryClient.setQueryData(['media'], (prev: MediaType[]) => [
        newMedia,
        ...prev
      ])
      return previousMedia
    },
    onSuccess: ({ mediaId }, newMedia) => {
      queryClient.setQueryData(['media'], (prev: MediaType[]) =>
        prev.map((m) =>
          m.mediaId === newMedia.tempMediaId
            ? { ...m, mediaId, uploading: false }
            : m
        )
      )
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(['media'], context)
    }
  })

  return uploadMediaMutation
}

export default useUploadMediaMutation
