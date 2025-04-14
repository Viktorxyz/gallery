'use client'

import useHeader from '@/stores/headerStore'
import cn from '@/utils/cn'

function StickyElement() {
  const isSnapping = useHeader((state) => state.isSnapping)

  return (
    <div
      className={cn('w-full h-0 translate-y-px', isSnapping && 'snap-start')}
    ></div>
  )
}

export default StickyElement
