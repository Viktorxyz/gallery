import React from 'react'
import Drawer from './drawer'
import Button from './button'

type SignInDrawerProps = {
  isOpen: boolean
  onClickAway?: () => void
}

function SignInDrawer({ isOpen, onClickAway }: SignInDrawerProps) {
  return (
    <Drawer isOpen={isOpen} onClickAway={onClickAway}>
      <div className='flex flex-col items-center p-6 gap-6'>
        <div className='text-neutral-400'>Sign in to continue</div>
        <Button className='w-full'>Continue with Google</Button>
      </div>
    </Drawer>
  )
}

export default SignInDrawer
