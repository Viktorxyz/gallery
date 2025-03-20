import toggleLikeAction from '@/actions/toggleLike'
import {
  IconDownload,
  IconHeartFill,
  IconHeartOutlined,
  IconLeft,
  IconShare
} from '@/data/icons'
import { useApp } from '@/providers/AppProvider'
import { useGallery } from '@/providers/GalleryProvider'
import useUserStore from '@/stores/userStore'
import { MediaType } from '@/types/gallery'
import { saveAs } from 'file-saver'
import React from 'react'

type ActionsProps = {
  current: MediaType
}

const Actions = ({ current }: ActionsProps) => {
  const { showGallery } = useApp()
  const toggleLike = useGallery((state) => state.toggleLike)
  const keywordId = useUserStore((state) => state.keywordId)

  const back = () => showGallery()

  const like = () => {
    toggleLikeAction(current.id, keywordId)
    toggleLike(current.id)
  }

  const copyPublicLinkToClipboard = () => navigator.share({ url: current.src })

  const downloadMedia = () => saveAs(current.src, `${current.id}.jpg`)

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
