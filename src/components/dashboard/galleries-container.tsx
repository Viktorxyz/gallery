'use client'

import { PropsWithChildren, useRef } from 'react'
import TopBar from '../topbar'
import Actions from './actions'
import Input from '../input'
import Columns from './columns'

type GalleriesContainerProps = PropsWithChildren

function GalleriesContainer({ children }: GalleriesContainerProps) {
  const searchRef = useRef<HTMLInputElement>(null)

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
        {children}
      </div>
      <Actions searchRef={searchRef} className="fixed w-full bottom-0 px-6" />
    </>
  )
}

export default GalleriesContainer
