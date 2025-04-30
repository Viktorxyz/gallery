import toggleLike, { ToggleLikeProps } from '@/actions/toggleLike'
import { useAuth } from '@/providers/auth-provider'
import { Media } from '@/types/gallery'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveAs } from 'file-saver'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import SignInDrawer from '../sign-in-drawer'
import IconButton from '../icon-button'

type ActionsProps = {
  current: Media
}

const Actions = ({ current }: ActionsProps) => {
  const router = useRouter()
  const { user } = useAuth()
  const [isSignInDrawerOpen, setIsSignInDrawerOpen] = useState(false)
  const openSignInDrawer = useCallback(() => setIsSignInDrawerOpen(true), [])
  const closeSignInDrawer = useCallback(() => setIsSignInDrawerOpen(false), [])

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
    },
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
    <>
      <div className='w-full flex justify-between p-6'>
        <IconButton icon='IconLeft' onClick={back} />
        {user ? (
          current.liked ? (
            <IconButton
              icon='IconHeartFill'
              onClick={like}
              iconCn='fill-rose-600'
            />
          ) : (
            <IconButton
              icon='IconHeartOutlined'
              onClick={like}
              iconCn='fill-white'
            />
          )
        ) : (
          <IconButton
            icon='IconHeartOutlined'
            onClick={openSignInDrawer}
            iconCn='fill-neutral-600'
          />
        )}
        <IconButton icon='IconShare' onClick={copyPublicLinkToClipboard} />
        <IconButton icon='IconDownload' onClick={downloadMedia} />
      </div>
      <SignInDrawer
        isOpen={isSignInDrawerOpen}
        onClickAway={closeSignInDrawer}
      />
    </>
  )
}

export default Actions
