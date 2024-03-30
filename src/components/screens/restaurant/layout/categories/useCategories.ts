import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import { useScreenSize } from "@/hooks/useScreenSize"
import type { ICategory } from "@/interfaces/category.interface"
import moment from "moment"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

export const useCategories = () => {
  const { isMobile } = useScreenSize()

  const searchParams = useSearchParams()
  const searchCategory = searchParams.get("category")

  const {
    allDishes: dishes,
    category: value,
    categories,
    categoryMap,
    dishQuery: query,
    setCategory: onChange,
    activeMenuUid
  } = useRestaurant()

  // When there's no category on mobile we need to set the first category as the default
  useEffect(() => {
    if (!value && !searchCategory && isMobile) {
      findCategory(0)
    }
  }, [categories, value, searchCategory, isMobile])

  useEffect(() => {
    if (categories?.length === 0 || dishes?.length === 0) return
    document.addEventListener("scroll", onScroll)
    return () => {
      document?.removeEventListener("scroll", onScroll)
    }
  }, [categories, dishes, isMobile])

  const onScroll: EventListener = () => {
    const scrollTop = window.scrollY

    // Doesn't execute on mobile
    if (!isMobile && scrollTop < 100) {
      onChange("")
      return
    }

    localStorage.setItem("scroll", scrollTop.toString())
    if (!!window.autoScroll && moment().diff(window.autoScroll) < 50) {
      window.autoScroll = moment()
      return
    }

    if (isMobile) {
      findCategory(scrollTop)
    }
  }

  const findCategory = (scrollTop: number) => {
    const category = categories
      ?.sort((a, b) => a.sortValue - b.sortValue)
      ?.find((category) => {
        const item = document.getElementById(
          `category-${category?.uid}`
        ) as HTMLElement
        if (!!item) {
          return item?.offsetTop + item.clientHeight > scrollTop + 80
        }
        return false
      })
    if (!!category) {
      onChange(category?.uid)
    }
  }

  const categoryFilter = (category: ICategory) => {
    if (query?.subcategories?.length > 0 && category?.uid === value) {
      return false
    }

    if (category.menuUid !== activeMenuUid) {
      return false
    }

    return !!categoryMap[category?.uid]
  }

  return {
    categoryFilter
  }
}
