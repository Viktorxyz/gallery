'use client'

import Button from '../button'

function Actions() {
  const enterGalleryID = () => console.log('enter gallery id dialog')

  return (
    <div className="flex flex-col w-full gap-6 items-center justify-end p-6">
      <Button variant="md" className="w-full">
        Scan QR code
      </Button>
      <div className="text-neutral-400 underline" onClick={enterGalleryID}>
        or enter Gallery ID
      </div>
    </div>
  )
}

export default Actions
