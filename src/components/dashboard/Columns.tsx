import cn from '@/utils/cn'

type ColumnsProps = {
  className?: string
}

function Columns({ className }: ColumnsProps) {
  return (
    <div className={cn('flex text-neutral-400 bg-black', className)}>
      <div className="w-6">#</div>
      <div className="flex-1">name</div>
      <div className="flex-1 text-center">items</div>
      <div className="flex-1 text-end">users</div>
      <div className="w-12"></div>
    </div>
  )
}

export default Columns
