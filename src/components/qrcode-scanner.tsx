import cn from '@/utils/cn'
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode'
import { QrcodeSuccessCallback } from 'html5-qrcode/esm/core'
import { useEffect } from 'react'

const qrcodeRegionId = 'html5qr-code-full-region'

type QRCodeScannerProps = (Html5QrcodeCameraScanConfig | undefined) & {
  qrCodeSuccessCallback?: QrcodeSuccessCallback
  qrCodeErrorCallback?: () => void
  className?: string
}

function QRCodeScanner({
  qrCodeSuccessCallback,
  qrCodeErrorCallback,
  className,
  ...config
}: QRCodeScannerProps) {
  useEffect(() => {
    if (!qrCodeSuccessCallback)
      throw new Error('qrCodeSuccessCallback is required callback.')
    const scanner = new Html5Qrcode(qrcodeRegionId)
    scanner.start(
      { facingMode: 'environment' },
      config,
      qrCodeSuccessCallback,
      qrCodeErrorCallback
    )

    return () => scanner.clear()
  }, [config, qrCodeErrorCallback, qrCodeSuccessCallback])

  return (
    <div
      className={cn('w-full aspect-square', className)}
      id={qrcodeRegionId}
    />
  )
}

export default QRCodeScanner
