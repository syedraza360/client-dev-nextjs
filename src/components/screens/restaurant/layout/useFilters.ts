import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import { getTranslations } from "@/helpers/utils"
import { useMemo, useState } from "react"

export const useFilters = () => {
  const [filters, setFilters] = useState<string[]>([])

  const { allDishes, activeMenuUid } = useRestaurant()

  const dishes = allDishes.filter((dish) => dish.menu === activeMenuUid)

  const yumzi = getTranslations()

  // Select the available filters by checking each dish
  const allowedFilters = useMemo(() => {
    const filters: typeof yumzi.filters = []

    const findFilter = (filterValue: string) => {
      return filters.some((f) => f.value === filterValue)
    }

    for (const filter of yumzi.filters) {
      dishes.forEach((dish) => {
        if (
          !findFilter(filter.value) &&
          filter.value === "VEGETARIAN" &&
          dish.isVegetarian
        ) {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          filter.value === "VEGAN" &&
          dish.isVegan
        ) {
          filters.push(filter)
        }

        if (!findFilter(filter.value) && filter.value === "NUT-FREE") {
          filters.push(filter)
        }

        if (!findFilter(filter.value) && filter.value === "LACTOSE-FREE") {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          dish.isSugarFree &&
          filter.value === "SUGAR-FREE"
        ) {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          dish.isAlcoholFree &&
          filter.value === "ALCOHOL-FREE"
        ) {
          filters.push(filter)
        }

        if (!findFilter(filter.value) && filter.value === "GLUTEN-FREE") {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          dish.isHistamineFree &&
          filter.value === "HISTAMINE-FREE"
        ) {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          filter.value === "SPICY" &&
          dish.isSpicy
        ) {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          filter.value === "NEW" &&
          dish.isNewDish
        ) {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          filter.value === "OFFER" &&
          dish.isDiscount
        ) {
          filters.push(filter)
        }

        if (
          !findFilter(filter.value) &&
          filter.value === "POPULAR" &&
          dish.isPromotion
        ) {
          filters.push(filter)
        }
      })
    }

    return filters
  }, [yumzi, dishes])

  return {
    allowedFilters,
    filters,
    setFilters
  }
}
