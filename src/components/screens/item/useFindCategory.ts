import type { ICategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import { useMemo } from "react"

export const useFindCategory = (dish: IDish, categories: ICategory[]) => {
  const category = useMemo(() => {
    let category = undefined
    let isSubCategory = false
    if (dish?.subcategory) {
      for (const cat of categories) {
        const foundCategory = cat.subCategories.find(
          (sCat) => sCat?.uid === dish?.subcategory
        )

        if (foundCategory) {
          isSubCategory = true
          category = foundCategory
          break
        }
      }
    }

    if (!dish?.subcategory || !category) {
      category = categories.find((cat) => cat?.uid === dish?.category)
    }

    return {
      category,
      isSubCategory
    }
  }, [dish, categories])

  return category
}
