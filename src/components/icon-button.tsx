import * as icons from '@/data/icons'
import { Icon } from '@/types/icons'
import cn from '@/utils/cn'
import { motion, HTMLMotionProps, useAnimate } from 'framer-motion'

type IconButtonProps = {
  icon: Icon
  className?: string
  iconCn?: string
} & HTMLMotionProps<'button'>

const IconButton = ({
  icon,
  iconCn,
  className,
  onClick,
  ...props
}: IconButtonProps) => {
  const [scope, animate] = useAnimate()
  const Icon = icons[icon]

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await animate(scope.current, {
      scale: 1,
    })
    await animate(scope.current, {
      scale: 0,
    })
    if (onClick) onClick(e)
  }

  return (
    <motion.button
      className={cn('flex justify-center items-center rounded-full', className)}
      onClick={handleClick}
      {...props}
    >
      <Icon className={cn('fill-white z-10', iconCn)} />
      <motion.div
        initial={{ scale: 0 }}
        ref={scope}
        className='absolute size-12 rounded-full bg-zinc-900'
      />
    </motion.button>
  )
}

export default IconButton
