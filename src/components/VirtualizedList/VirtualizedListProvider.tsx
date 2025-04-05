import cn from '@/utils/cn'
import React, {
  createContext,
  CSSProperties,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef
} from 'react'

export enum Direction {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL'
}

type VirtualizedListProviderProps = PropsWithChildren<{
  direction: Direction
  ref?: RefObject<HTMLDivElement | null>
  className?: string
  style?: CSSProperties
}>

type VirtualizedListContextType = {
  rootRef: RefObject<HTMLDivElement | null>
  direction: Direction
}

const VirtualizedListContext = createContext<VirtualizedListContextType | null>(
  null
)

const VirtualizedListProvider = ({
  direction,
  style,
  className,
  children,
  ref
}: VirtualizedListProviderProps) => {
  const defaultRef = useRef<HTMLDivElement>(null)
  const rootRef = ref || defaultRef

  const value: VirtualizedListContextType = {
    rootRef,
    direction
  }

  return (
    <VirtualizedListContext value={value}>
      <div
        ref={rootRef}
        className={
          direction === Direction.HORIZONTAL
            ? cn('flex-1 overflow-x-scroll w-screen', className)
            : cn('flex-1 overflow-y-scroll h-screen', className)
        }
        style={style}
      >
        {children}
      </div>
    </VirtualizedListContext>
  )
}

export const useVirtualizedList = () =>
  useContext(VirtualizedListContext) as VirtualizedListContextType

export default VirtualizedListProvider
