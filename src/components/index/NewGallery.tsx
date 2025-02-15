'use client'
import React from 'react'
import IconButton from '../IconButton'
import { useRouter } from 'next/navigation'

const NewGallery = () => {
  const router = useRouter()

  return (
    <IconButton icon="IconPlus" onClick={() => router.push('/new-gallery')} />
  )
}

export default NewGallery
