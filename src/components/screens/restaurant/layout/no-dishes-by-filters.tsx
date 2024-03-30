import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import { getTranslations } from "@/helpers/utils"
import type { FC } from "react"
import { IoClose } from "react-icons/io5"

const NoDishesByFilters: FC = () => {
  const { dishQuery, dishes, setDishQuery } = useRestaurant()

  const yumzi = getTranslations()

  const i18n = useI18n()

  const isNoDishes =
    dishQuery.preferenceCategories.length > 0 &&
    Object.entries(dishes).length === 0

  const removeFilter = (filter: string) => {
    setDishQuery({
      ...dishQuery,
      preferenceCategories: dishQuery.preferenceCategories.filter(
        (item) => item !== filter
      )
    })
  }

  if (!isNoDishes) return null
  return (
    <div className="mt-16 min-h-[80vh] py-8">
      <div className="mx-auto flex w-3/4 flex-col justify-center text-center">
        <div className="text-xl font-semibold text-black">
          {i18n.t("A pity! We can't find any hits!")}
        </div>
        <p className="mt-3 text-xs text-dark-foreground">
          {i18n.t("Try to remove some of your filters")}
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {dishQuery.preferenceCategories.map((filter, i) => (
            <li key={i}>
              <button
                className="flex items-center gap-1 rounded-5 bg-dark-bg2 px-3.5 py-2 text-xs font-medium"
                onClick={() => removeFilter(filter)}
              >
                {i18n.from(
                  yumzi.filters.find((f) => f.value === filter)?.name!
                )}
                <IoClose size={12} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default NoDishesByFilters
