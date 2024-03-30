import { useI18n } from "@/components/providers/i18n"
import { filterDishes } from "@/components/providers/restaurant/filter-dishes"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Drawer from "@/components/ui/drawer/drawer"
import { cn, getTranslations } from "@/helpers/utils"
import Image from "next/image"
import type { Dispatch, SetStateAction } from "react"
import { useEffect, useState, type FC } from "react"
import { useFilters } from "../useFilters"

const FilterMobile: FC = () => {
  const [isShow, setIsShow] = useState(false)

  const openFilters = () => {
    setIsShow(true)
  }

  return (
    <div className="flex-1">
      <OpenButton openFilters={openFilters} />
      <Filters isShow={isShow} setIsShow={setIsShow} />
    </div>
  )
}

interface IOpenButton {
  openFilters: () => void
}

const OpenButton: FC<IOpenButton> = ({ openFilters }) => {
  const { dishQuery } = useRestaurant()
  const i18n = useI18n()

  const filtersLength = dishQuery.preferenceCategories.length

  return (
    <button
      className={cn(
        "relative flex w-full flex-col items-center gap-1 rounded-lg px-3 py-[11px] backdrop-blur",
        filtersLength ? "bg-black/80" : "bg-dark-bg2"
      )}
      onClick={openFilters}
    >
      <Image
        src={cn(`/icons/sliders${filtersLength ? "-light" : ""}.svg`)}
        alt="filter"
        width={16}
        height={16}
      />
      <span
        className={cn(
          "text-[10px] leading-135",
          filtersLength ? "text-light-foreground" : "text-dark-foreground"
        )}
      >
        {i18n.t("filter")}
      </span>
      {!!filtersLength && (
        <span className="absolute right-2 top-2 flex h-3 w-3 items-center justify-center rounded-full bg-white/90 text-[6px] text-black/90">
          {filtersLength}
        </span>
      )}
    </button>
  )
}

interface IFilters {
  isShow: boolean
  setIsShow: Dispatch<SetStateAction<boolean>>
}

const Filters: FC<IFilters> = ({ isShow, setIsShow }) => {
  const { filters, setFilters, allowedFilters } = useFilters()

  const { dishQuery, setDishQuery, allDishes, activeMenuUid } = useRestaurant()

  const yumzi = getTranslations()

  const i18n = useI18n()

  useEffect(() => {
    setFilters(dishQuery.preferenceCategories)
  }, [dishQuery.preferenceCategories, setFilters])

  const applyFilters = () => {
    setDishQuery({
      ...dishQuery,
      preferenceCategories: filters
    })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
    setIsShow(false)
  }

  const deleteAllFilters = () => {
    setFilters([])
    setDishQuery({
      ...dishQuery,
      preferenceCategories: []
    })
  }

  const items = [
    {
      title: i18n.t("Nutrition"),
      items: allowedFilters.filter((filter) =>
        yumzi.filters.slice(0, 4).some((f) => f.value === filter.value)
      )
    },
    {
      title: i18n.t("Incompatibilities"),
      items: allowedFilters.filter((filter) =>
        yumzi.filters.slice(4, 8).some((f) => f.value === filter.value)
      )
    },
    {
      title: i18n.t("More"),
      items: allowedFilters.filter((filter) =>
        yumzi.filters.slice(8, 12).some((f) => f.value === filter.value)
      )
    }
  ]

  const filterDishesLength = filterDishes(
    filters,
    allDishes.filter((dish) => dish.menu === activeMenuUid)
  ).length

  return (
    <Drawer
      isOpen={isShow}
      contentStyle={{
        padding: "12px 20px"
      }}
      showBrand
      setIsOpen={setIsShow}
    >
      <div className="relative mt-4 flex items-center justify-center">
        <p className="font-semibold">{i18n.t("filter")}</p>
        <button
          className="absolute right-0 top-1 text-xs font-medium text-dark-foreground"
          onClick={deleteAllFilters}
        >
          {i18n.t("deselect all")}
        </button>
      </div>
      <div className="mt-10 flex flex-col gap-6 overflow-auto">
        {items.map((item, index) => (
          <div key={index}>
            <p className="font-semibold">{item.title}</p>
            <div className="mt-3 flex w-full flex-wrap items-start gap-2">
              {item.items.map((filter) => (
                <FilterItem
                  key={filter.value}
                  item={filter}
                  filters={filters}
                  setFilters={setFilters}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className="sticky bottom-0 left-0 -mb-1 mt-6 w-full rounded-lg bg-dark px-3.5 py-[19px] text-sm font-medium text-light"
        onClick={applyFilters}
      >
        {filters.length > 0
          ? `${i18n.t("Show")} ${filterDishesLength} ${i18n.t("Results")}`
          : i18n.t("Show results")}
      </button>
    </Drawer>
  )
}

interface IFilterItem {
  item: ReturnType<typeof getTranslations>["filters"][number]
  filters: string[]
  setFilters: Dispatch<SetStateAction<string[]>>
}

const FilterItem: FC<IFilterItem> = ({ item, filters, setFilters }) => {
  const i18n = useI18n()

  const isActive = filters.includes(item.value)

  const onFilterClick = () => {
    if (filters.includes(item.value)) {
      setFilters(filters.filter((category) => category !== item.value))
    } else {
      setFilters([...filters, item.value])
    }
  }

  return (
    <button
      className={cn(
        "flex h-[55px] w-[calc(50%-4px)] items-center gap-2.5 rounded-lg p-3.5 duration-150",
        isActive ? "bg-dark" : "bg-dark-bg"
      )}
      onClick={onFilterClick}
    >
      {/* We're not using next.js Image because we don't know image sizes */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/icons/filters/${item.value.toLowerCase()}${isActive ? "-light" : ""}.svg`}
        alt="icon"
        fetchPriority="high"
      />
      <p
        className={cn(
          "text-[11px] font-semibold",
          isActive ? "text-light-foreground" : "text-dark-foreground"
        )}
      >
        {i18n.from(item.name)}
      </p>
    </button>
  )
}

export default FilterMobile
