'use client'

import React, { useEffect, useState } from 'react'
import qrcode from 'qrcode'
import Image from 'next/image'

const QRCode = () => {
  const [src, setSrc] = useState<string>()

  useEffect(() => {
    const generateQRCode = async () => {
      const location = window.location.href
      const src = await qrcode.toDataURL(location, {
        color: {
          light: '#ffffff00',
          dark: '#ffffff',
        },
        width: 1080,
        rendererOpts: {
          quality: 1,
        },
        type: 'image/webp',
      })
      setSrc(src)
    }
    generateQRCode()
  }, [setSrc])

  if (!src) return null

  return (
    <Image
      className='aspect-square'
      width={256}
      height={256}
      src={src}
      alt=''
    />
  )
}

export default QRCode
