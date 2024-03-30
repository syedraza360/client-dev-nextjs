import { create } from "zustand"

interface IUseVariables {
  searchDishText: string
  searchDishId: string | null
  isPreloader: boolean
  dishLoadingScroll: number
  setSearchDishText: (value: string) => void
  setSearchDishId: (value: string | null) => void
  setIsPreloader: (value: boolean) => void
  setDishLoadingScroll: (value: number) => void
}

export const useVariables = create<IUseVariables>((set) => ({
  searchDishText: "",
  searchDishId: null,
  isPreloader: true,
  dishLoadingScroll: 0,
  setSearchDishText: (value) => set({ searchDishText: value }),
  setSearchDishId: (value) => set({ searchDishId: value }),
  setIsPreloader: (value) => set({ isPreloader: value }),
  setDishLoadingScroll: (value) => set({ dishLoadingScroll: value })
}))
