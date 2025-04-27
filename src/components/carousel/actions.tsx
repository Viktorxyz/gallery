import toggleLike, { ToggleLikeProps } from '@/actions/toggleLike'
import {
  IconDownload,
  IconHeartFill,
  IconHeartOutlined,
  IconLeft,
  IconShare
} from '@/data/icons'
import { Media } from '@/types/gallery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/navigation'

type ActionsProps = {
  current: Media
}

const Actions = ({ current }: ActionsProps) => {
  const router = useRouter()

  const queryClient = useQueryClient()
  const likeMutation = useMutation<void, Error, ToggleLikeProps, Media[]>({
    mutationFn: (payload) => toggleLike(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['media'] })

      const previousMedia = queryClient.getQueryData(['media']) as Media[]

      queryClient.setQueryData(['media'], (prev: Media[]) => {
        const index = prev.findIndex((m) => m.mediaId === payload.mediaId)
        prev[index].liked = !prev[index].liked
      })

      return previousMedia
    },
    onError: (error, payload, context) => {
      queryClient.setQueryData(['media'], context)
    }
  })

  const like = () => likeMutation.mutate({ mediaId: current.mediaId })

  const copyPublicLinkToClipboard = () => {
    navigator.share({ url: current.src })
  }

  const downloadMedia = () => {
    saveAs(current.src, `${current.mediaId}.jpg`)
  }

  const back = () => router.back()

  return (
    <div className="w-full flex justify-between p-6">
      <IconLeft onClick={back} className="fill-white" />
      {current.liked ? (
        <IconHeartFill onClick={like} className="fill-rose-600" />
      ) : (
        <IconHeartOutlined onClick={like} className="fill-white" />
      )}

      <IconShare onClick={copyPublicLinkToClipboard} className="fill-white" />
      <IconDownload onClick={downloadMedia} className="fill-white" />
    </div>
  )
}

export default Actions
