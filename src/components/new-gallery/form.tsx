'use client'
import React, { useCallback, useState } from 'react'
import Actions from './actions'
import Input from '../input'
import createGallery from '@/actions/createGallery'
import { useRouter } from 'next/navigation'
import cn from '@/utils/cn'

type FormProps = {
  className?: string
}

const Form = ({ className }: FormProps) => {
  const router = useRouter()
  const [error, setError] = useState<string>()

  const formAction = useCallback(
    async (formData: FormData) => {
      const galleryName = formData.get('gallery-name') as string
      const res = await createGallery(galleryName)
      if (res?.error) setError('Name already in use.')
      else router.push('/')
    },
    [router, setError]
  )

  return (
    <form
      action={formAction}
      className={cn('flex flex-col flex-1 justify-end', className)}
    >
      <div className="mb-36">
        <Input
          required
          autoFocus
          name="gallery-name"
          variant="line"
          placeholder="enter gallery name..."
          error={error}
        />
      </div>
      <Actions className="fixed left-0 bottom-0 w-full px-6" />
    </form>
  )
}

export default Form
