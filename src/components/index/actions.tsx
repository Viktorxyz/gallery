'use client'

import { useCallback, useState } from 'react'
import Button from '../button'
import QRCodeScanner from '../qrcode-scanner'
import Drawer from '../drawer'
import { IconX } from '@/data/icons'
import { useRouter } from 'next/navigation'

function Actions() {
  const router = useRouter()
  // const [error, setError] = useState(false)
  const [scanQrcode, setScanQrcode] = useState(false)
  const enterGalleryID = () => console.log('enter gallery id dialog')

  const toggleScanQrcode = useCallback(() => setScanQrcode((prev) => !prev), [])

  const qrCodeSuccessCallback = useCallback(
    (decodedText: string) => router.push(decodedText),
    [router]
  )

  return (
    <>
      <div className='flex flex-col w-full gap-6 items-center justify-end p-6'>
        <Button variant='md' className='w-full' onClick={toggleScanQrcode}>
          Scan QR code
        </Button>
        <div className='text-neutral-400 underline' onClick={enterGalleryID}>
          or enter Gallery ID
        </div>
      </div>
      <Drawer isOpen={scanQrcode}>
        <div className='flex flex-col'>
          <div className='px-12'>
            <h2 className='text-xl text-center my-8 text-neutral-400'>
              Scan QR code
            </h2>
            <QRCodeScanner
              fps={2}
              qrCodeSuccessCallback={qrCodeSuccessCallback}
              // className={error ? 'mb-0' : 'mb-10'}
              className='mb-10'
            />
            {/* {error && (
              <p className='text-red-500 text-right text-sm'>
                Invalid QR code.
                <br />
                Not recognized as a gallery link.
              </p>
            )} */}
          </div>
          <div className='flex justify-end p-6'>
            <IconX onClick={toggleScanQrcode} className='fill-white' />
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default Actions
