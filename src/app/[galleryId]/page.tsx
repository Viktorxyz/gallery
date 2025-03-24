import getGallery from '@/actions/getGallery'
import App from '@/components/app/App'
import ActionsProvider from '@/providers/ActionsProvider'
import AppProvider from '@/providers/AppProvider'
import GalleryProvider from '@/providers/GalleryProvider'
import ToastProvider from '@/providers/ToastProvider'

export default async function Page({
  params
}: {
  params: Promise<{ galleryId: string }>
}) {
  const { galleryId } = await params
  const gallery = await getGallery({ galleryId })

  return (
    <ActionsProvider>
      <ToastProvider>
        <AppProvider>
          <GalleryProvider {...gallery}>
            <App />
          </GalleryProvider>
        </AppProvider>
      </ToastProvider>
    </ActionsProvider>
  )
}
