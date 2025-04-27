import uploadMedia, { UploadMediaProps } from '@/actions/uploadMedia'
import { useAuth } from '@/providers/auth-provider'
import { Media, MediaMime } from '@/types/gallery'
import getImageDimensions from '@/utils/getImageDimensions'
import getVideoDimensionsClient from '@/utils/getVideoDimensionsClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type Dimensions = {
  width: number
  height: number
  duration?: number
}

function useUploadMediaMutation() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const uploadMediaMutation = useMutation<
    { mediaId: string },
    Error,
    UploadMediaProps & { tempMediaId: string },
    Media[]
  >({
    mutationFn: ({ file, galleryId }) => uploadMedia({ file, galleryId }),
    onMutate: async ({ file, galleryId, tempMediaId }) => {
      if (!user) return

      await queryClient.cancelQueries({ queryKey: ['media'] })
      const previousMedia = queryClient.getQueryData<Media[]>(['media'])
      const type = file.type.startsWith('image')
        ? MediaMime.IMAGE
        : MediaMime.VIDEO
      const dimensions: Dimensions =
        type === MediaMime.IMAGE
          ? await getImageDimensions(file)
          : await getVideoDimensionsClient(file)
      const newMedia: Media = {
        userId: user.id,
        mediaId: tempMediaId,
        galleryId,
        src: URL.createObjectURL(file),
        uploading: true,
        likesCount: 0,
        liked: false,
        aspectRatio: dimensions.width / dimensions.height,
        width: dimensions.width,
        height: dimensions.height,
        createdAt: Date.now(),
        type
      }
      queryClient.setQueryData(['media'], (prev: Media[]) => [
        newMedia,
        ...prev
      ])
      return previousMedia
    },
    onSuccess: ({ mediaId }, newMedia) => {
      queryClient.setQueryData(['media'], (prev: Media[]) =>
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
