import getGalleryMedia from '@/actions/getGalleryMedia'
import MediaProvider from '@/providers/media-provider'
import { PropsWithChildren } from 'react'

type Props = PropsWithChildren<{
  params: Promise<{ galleryId: string }>
}>

async function Layout({ params, children }: Props) {
  const { galleryId } = await params
  const mediaPromise = getGalleryMedia({ galleryId })

  return <MediaProvider mediaPromise={mediaPromise}>{children}</MediaProvider>
}

export default Layout
