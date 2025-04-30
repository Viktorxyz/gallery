'use client'

import useUploadMediaMutation from '@/api/useUploadMediaMutation'
import { IconPlus } from '@/data/icons'
import { useAuth } from '@/providers/auth-provider'
import { useParams } from 'next/navigation'
import { ChangeEvent, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import QRCode from '../qrcode'
import Drawer from '../drawer'
import IconButton from '../icon-button'
import SignInDrawer from '../sign-in-drawer'

function Actions() {
  const { user } = useAuth()
  const { galleryId } = useParams<{ galleryId: string }>()
  const uploadMediaMutation = useUploadMediaMutation()
  const [qrcodeVisible, setQrcodeVisible] = useState(false)
  const [isSignInDrawerOpen, setIsSignInDrawerOpen] = useState(false)
  const openSignInDrawer = useCallback(() => setIsSignInDrawerOpen(true), [])
  const closeSignInDrawer = useCallback(() => setIsSignInDrawerOpen(false), [])
  const showQrcode = useCallback(() => setQrcodeVisible(true), [])
  const hideQrcode = useCallback(() => setQrcodeVisible(false), [])

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      for (const file of files) {
        const tempMediaId = uuidv4()
        uploadMediaMutation.mutate({ file, galleryId, tempMediaId })
      }
    }
  }

  return (
    <>
      <div className='flex gap-6'>
        <IconButton icon='IconQRCode' onClick={showQrcode} />
        <label>
          <IconPlus className='icon-action scale-110' />
          {user ? (
            <input
              onChange={onFileChange}
              className='hidden'
              type='file'
              accept='image/*,video/*'
              multiple
            />
          ) : (
            <input
              type='button'
              className='hidden'
              onClick={openSignInDrawer}
            />
          )}
        </label>
        <IconButton icon='IconOptions' />
      </div>
      <SignInDrawer
        isOpen={isSignInDrawerOpen}
        onClickAway={closeSignInDrawer}
      />
      <Drawer isOpen={qrcodeVisible} onClickAway={hideQrcode}>
        <div className='flex flex-col items-center py-12'>
          <QRCode />
        </div>
      </Drawer>
    </>
  )
}

export default Actions
