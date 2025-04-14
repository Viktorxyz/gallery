import { create } from 'zustand'

type HeaderState = {
  isSnapping: boolean
  isTitleVisible: boolean
  isActionsVisible: boolean
}

type HeaderActions = {
  setIsSnapping: (value: boolean) => void
  setIsTitleVisible: (value: boolean) => void
  setIsActionsVisible: (value: boolean) => void
}

type HeaderStore = HeaderState & HeaderActions

const useHeader = create<HeaderStore>((set) => ({
  isTitleVisible: true,
  isActionsVisible: true,
  isSnapping: true,
  setIsTitleVisible: (value) => set(() => ({ isTitleVisible: value })),
  setIsActionsVisible: (value) => set(() => ({ isActionsVisible: value })),
  setIsSnapping: (value) => set(() => ({ isSnapping: value }))
}))

export default useHeader
