'use client'
import React, { useCallback, useState } from 'react'
import Actions from './Actions'
import Input from '../Input'
import createGallery from '@/actions/createGallery'
import { useRouter } from 'next/navigation'

const Form = () => {
  const router = useRouter()
  const [error, setError] = useState(null)

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
    <form action={formAction} className="flex flex-col flex-1 justify-end">
      <div className="mb-16">
        <Input
          required
          autoFocus
          name="gallery-name"
          variant="line"
          placeholder="enter gallery name..."
          error={error}
        />
      </div>
      <Actions />
    </form>
  )
}

export default Form
