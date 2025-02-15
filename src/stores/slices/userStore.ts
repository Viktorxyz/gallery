import { StateCreator } from 'zustand'

export type UserState = {
  keyword?: string
  keywordId?: string
}

export type UserActions = {
  setKeyword: ({
    keyword,
    keywordId
  }: {
    keyword: string
    keywordId: string
  }) => void
}

export type UserSlice = UserState & UserActions

export const defaultInitState: UserState = {
  keyword: null,
  keywordId: null
}

const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  keyword: null,
  keywordId: null,
  setKeyword: ({ keyword, keywordId }) => set({ keyword, keywordId })
})

export default createUserSlice
