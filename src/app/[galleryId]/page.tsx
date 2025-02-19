import getGallery from '@/actions/getGallery'
import Actions from '@/components/gallery/Actions'
import Gallery from '@/components/gallery/Gallery'
import ActionsProvider from '@/providers/ActionsProvider'
import KeywordProvider from '@/providers/KeywordProvider'
import ToastProvider from '@/providers/ToastProvider'

export default async function Page({
  params
}: {
  params: Promise<{ galleryId: string }>
}) {
  const { galleryId } = await params
  const { gallery } = await getGallery({ galleryId })

  return (
    <ActionsProvider>
      <ToastProvider>
        <KeywordProvider>
          <Gallery initialImages={gallery} />
          <Actions />
        </KeywordProvider>
      </ToastProvider>
    </ActionsProvider>
  )
}
