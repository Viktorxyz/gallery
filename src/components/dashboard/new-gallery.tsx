'use client'
import React from 'react'
import IconButton from '../icon-button'
import { useRouter } from 'next/navigation'

const NewGallery = () => {
  const router = useRouter()

  return (
    <IconButton
      icon="IconPlus"
      onClick={() => router.push('/dashboard/new-gallery')}
    />
  )
}

export default NewGallery
