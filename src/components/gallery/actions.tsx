import { IconPlus, IconQRCode } from '@/data/icons'
import { ChangeEvent } from 'react'
import { v4 as uuidv4 } from 'uuid'

function Actions() {
  // const supabase = await createClient()
  // const { data, error } = await supabase.auth.getUser()

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      for (const file of files) {
        const tempMediaId = uuidv4()
        uploadMediaMutation.mutate({ file, galleryId, keywordId, tempMediaId })
      }
    }
  }

  return (
    <div className="flex gap-6">
      <IconQRCode
        //  onClick={showQRCode}
        className="icon-action"
      />
      <label>
        <IconPlus className="icon-action scale-110" />
        {user ? (
          <input
            onChange={onFileChange}
            className="hidden"
            type="file"
            accept="image/*,video/*"
            multiple
          />
        ) : (
          <input type="button" className="hidden" onClick={openKeyword} />
        )}
      </label>
    </div>
  )
}

export default Actions
