import React, { useEffect, useState } from 'react'
import Backdrop from '../Backdrop'
import qrcode from 'qrcode'

type QRCodeProps = {
  onClickAway: () => void
}

const QRCode = ({ onClickAway }: QRCodeProps) => {
  const [src, setSrc] = useState<string | null>()

  useEffect(() => {
    const generateQRCode = async () => {
      const location = window.location.href
      const src = await qrcode.toDataURL(location, {
        color: {
          light: '#ffffff00',
          dark: '#ffffff'
        },
        width: 1080,
        rendererOpts: {
          quality: 1
        },
        type: 'image/webp'
      })
      setSrc(src)
    }
    generateQRCode()
  }, [setSrc])

  return (
    <>
      <div
        className="fixed h-screen w-screen z-50 flex items-center justify-center"
        onClick={onClickAway}
      >
        <img className="w-3xs aspect-square" src={src} alt="" />
      </div>
      <Backdrop />
    </>
  )
}

export default QRCode
