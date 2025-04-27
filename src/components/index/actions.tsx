'use client'

import { useCallback, useState } from 'react'
import Button from '../button'
import QRCodeScanner from '../qrcode-scanner'

function Actions() {
  const [scanQrcode, setScanQrcode] = useState(false)
  const enterGalleryID = () => console.log('enter gallery id dialog')

  const toggleScanQrcode = useCallback(() => setScanQrcode((prev) => !prev), [])

  return (
    <div className="flex flex-col w-full gap-6 items-center justify-end p-6">
      {scanQrcode && (
        <QRCodeScanner
          fps={2}
          qrCodeSuccessCallback={(decodedText, result) =>
            console.log(decodedText, result)
          }
        />
      )}
      <Button variant="md" className="w-full" onClick={toggleScanQrcode}>
        Scan QR code
      </Button>
      <div className="text-neutral-400 underline" onClick={enterGalleryID}>
        or enter Gallery ID
      </div>
    </div>
  )
}

export default Actions
