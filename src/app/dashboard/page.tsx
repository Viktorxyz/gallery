'use client'

import Galleries from '@/components/dashboard/Galleries'
import Actions from '@/components/dashboard/Actions'
import Input from '@/components/Input'
import TopBar from '@/components/TopBar'
import { Suspense, useRef } from 'react'
import getGalleries from '@/actions/getGalleries'
import Columns from '@/components/dashboard/Columns'
import GalleriesSkeleton from '@/components/dashboard/GalleriesSkeleton'

function Page() {
  const searchRef = useRef<HTMLInputElement>(null)
  const galleriesPromise = getGalleries()

  return (
    <>
      <div className="flex-1 flex flex-col mx-6 mt-6">
        <TopBar title="Galleries" className="mt-6 mb-8" />
        <div className="sticky top-6 bg-black z-50">
          <Input
            ref={searchRef}
            variant="line"
            placeholder="search by name/id/number..."
          />
          <Columns className="pt-16 pb-12" />
        </div>
        <Suspense fallback={<GalleriesSkeleton />}>
          <Galleries className="pb-24" galleriesPromise={galleriesPromise} />
        </Suspense>
      </div>
      <Actions searchRef={searchRef} className="fixed w-full bottom-0 px-6" />
    </>
  )
}

export default Page
