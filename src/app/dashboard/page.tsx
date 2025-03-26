import { Suspense } from 'react'
import Galleries from '@/components/dashboard/Galleries'
import GalleriesSkeleton from '@/components/dashboard/GalleriesSkeleton'
import GalleriesContainer from '@/components/dashboard/GalleriesContainer'

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
