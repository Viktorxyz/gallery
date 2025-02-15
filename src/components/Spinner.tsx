import { IconSpinner } from '@/data/icons'
import cn from '@/utils/cn'

type SpinnerProps = {
  className?: string
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <IconSpinner className={cn('size-6 icon-action animate-spin', className)} />
  )
}

export default Spinner
