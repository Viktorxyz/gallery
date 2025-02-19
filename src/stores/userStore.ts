import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserState = {
  keyword?: string
  keywordId?: string
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
}

export type UserStore = UserState & UserActions

export const defaultInitState: UserState = {
  keyword: null,
  keywordId: null
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...defaultInitState,
      setKeyword: ({ keyword, keywordId }) => set({ keyword, keywordId }),
      reset: () => set(defaultInitState)
    }),
    { name: 'user-store' }
  )
)

export default useUserStore
