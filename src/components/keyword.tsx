'use client'

import React from 'react'
import Backdrop from './backdrop'
import Input from './input'
import { IconCheck } from '@/data/icons'
import useClickAway from '@/hooks/useClickAway'

type KeywordProps = {
  error?: string
  onClickAway?: () => void
  onSubmit?: (value: string) => Promise<void>
}

const Keyword = ({ error, onClickAway, onSubmit }: KeywordProps) => {
  const ref = useClickAway<HTMLFormElement>(onClickAway)

  const action = (formData: FormData) => {
    if (onSubmit) onSubmit(formData.get('keyword') as string)
  }

  return (
    <>
      <div className="flex items-center fixed top-0 px-6 w-full z-50 inset-0">
        <form ref={ref} className="flex justify-between w-full" action={action}>
          <Input
            autoFocus
            placeholder="Unesi reč ili tvoje ime"
            name="keyword"
            error={error}
          />
          <button className="" type="submit">
            <IconCheck className="size-6 fill-neutral-400" />
          </button>
        </form>
      </div>
      <Backdrop className="z-40" />
    </>
  )
}

export default Keyword
