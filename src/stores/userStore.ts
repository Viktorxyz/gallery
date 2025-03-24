import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserState = {
  keyword?: string
  keywordId?: string
  zoomLevel: number
}

export type UserActions = {
  reset: () => void
  setKeyword: ({
    keyword,
    keywordId
  }: {
    keyword: string
    keywordId: string
  }) => void
  setZoomLevel: ({ zoomLevel }: { zoomLevel: number }) => void
}

export type UserStore = UserState & UserActions

export const defaultInitState: UserState = {
  keyword: undefined,
  keywordId: undefined,
  zoomLevel: 3
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...defaultInitState,
      setKeyword: ({ keyword, keywordId }) => set({ keyword, keywordId }),
      setZoomLevel: ({ zoomLevel }) => set({ zoomLevel }),
      reset: () => set(defaultInitState)
    }),
    { name: 'user-store' }
  )
)

export default useUserStore
