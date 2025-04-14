import { Suspense } from 'react'
import Galleries from '@/components/dashboard/galleries'
import GalleriesSkeleton from '@/components/dashboard/galleries-skeleton'
import GalleriesContainer from '@/components/dashboard/galleries-container'

function Page() {
  return (
    <>
      <GalleriesContainer>
        <Suspense fallback={<GalleriesSkeleton />}>
          <Galleries className="pb-24" />
        </Suspense>
      </GalleriesContainer>
    </>
  )
}

export default Page
