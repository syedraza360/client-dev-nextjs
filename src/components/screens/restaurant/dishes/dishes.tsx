import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Product from "@/components/ui/product/product"
import { cn } from "@/helpers/utils"
import type { ICategory } from "@/interfaces/category.interface"
import { ShowMode } from "@/interfaces/common.interface"
import { useEffect, useRef, type FC } from "react"
import DishesSubCategories from "./dishes-subcategories"

import { useScreenSize } from "@/hooks/useScreenSize"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

interface IDishes {
  show: ShowMode
}

const Dishes: FC<IDishes> = ({ show }) => {
  const i18n = useI18n()

  const { categoryMap2, categories, dishes, search } = useRestaurant()

  return (
    <div className="tablet:mt-12">
      <div className="bg-gray-50 tablet:bg-transparent">
        {categories
          ?.filter((d) => !!categoryMap2[d.uid])
          ?.sort((a, b) => a.sortValue - b.sortValue)
          ?.map((category, index) => (
            <Item
              key={index}
              isFirst={index === 0}
              category={category}
              show={show}
            />
          ))}
      </div>

      {Object.keys(dishes).length === 0 && !!search && (
        <div className="flex flex-col items-center py-8">
          <div className="max-w-[260px] text-center">
            <p className="mb-2 text-xl font-semibold">
              {i18n.t("A pity! We can't find any hits!")}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface IItem {
  isFirst: boolean
  category: ICategory
  show: ShowMode
}

const Item: FC<IItem> = ({ isFirst, category, show }) => {
  const { isMobile } = useScreenSize()

  const startElRef = useRef<HTMLDivElement>(null)
  const endElRef = useRef<HTMLDivElement>(null)

  const i18n = useI18n()
  const {
    categoryMap2,
    dishes,
    dishQuery,
    restaurant,
    allDishes,
    categories,
    setCategory
  } = useRestaurant()

  const subCategoryView = category?.subCategories?.find(
    (d) => !!categoryMap2[d.uid]
  )
  const subcategories = category?.subCategories
    ?.filter((d) => !!categoryMap2[d.uid])
    ?.map((d) => d?.uid)

  const others = dishes[category?.uid]?.filter(
    (d) => !subcategories?.includes(d?.subcategory)
  )

  const description = i18n.find(category?.description)?.description

  useEffect(() => {
    if (!isMobile) {
      const enterCallback = () => {
        const mainWindow = document.getElementById(
          "main-window-desktop"
        ) as HTMLElement

        if (mainWindow?.scrollTop === 0) return

        setCategory(category.uid)

        const sidebarCategoriesScroll = document.getElementById(
          "sidebar-categories-scroll"
        ) as HTMLElement
        const sidebarCategory = document.getElementById(
          `sidebar-category-${category?.uid}`
        ) as HTMLElement
        sidebarCategoriesScroll?.scrollTo({
          behavior: "smooth",
          top: isFirst ? 0 : sidebarCategory?.offsetTop - 100
        })
      }

      ScrollTrigger?.create({
        scroller: "#main-window-desktop",
        //markers: true,
        trigger: startElRef.current,
        start: "top 40%",
        endTrigger: endElRef.current,
        end: "bottom 40%",
        invalidateOnRefresh: true,
        onEnter: enterCallback,
        onEnterBack: enterCallback
      })
    }
  }, [category.uid, setCategory, isMobile, isFirst])

  return (
    <div className={cn(!isFirst && "mt-2")}>
      <div ref={startElRef} id={`start-category-${category.uid}`} />
      <div
        id={"category-" + category.uid}
        className="bg-white px-3 py-4 tablet:p-0"
      >
        {dishQuery.subcategories.length > 0 || (
          <div className="flex flex-col gap-0.5 bg-white tablet:justify-center tablet:gap-1 tablet:rounded-xl tablet:border tablet:border-dark-bg2 tablet:px-6 tablet:py-8">
            <p className="font-semibold tablet:text-xl tablet:leading-normal">
              {i18n.find(category?.title)?.title}
            </p>
            {description && (
              <p className="text-xs leading-normal text-dark-foreground tablet:text-base tablet:leading-normal">
                {description}
              </p>
            )}
          </div>
        )}
        <div
          className={cn(
            "mt-4 grid gap-x-3 gap-y-6 tablet:mt-8 tablet:gap-6",
            show === ShowMode.GRID
              ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1",
            others.length > 0 && "mb-6"
          )}
        >
          {others
            .filter((d) => d.images.length > 0)
            ?.sort((a, b) => a.sortValue - b.sortValue)
            ?.map((product, index) => (
              <Product
                key={index}
                product={product}
                index={index}
                isFullWidth={
                  index === others.length - 1 && index % 2 === 0 && isMobile
                }
                restaurantSettings={restaurant!.settings}
                allDishes={allDishes}
                categories={categories}
              />
            ))}
          {others
            .filter((d) => d.images.length === 0)
            ?.sort((a, b) => a.sortValue - b.sortValue)
            ?.map((product, index) => (
              <Product
                key={index}
                product={product}
                index={index}
                isFullWidth={
                  index === others.length - 1 && index % 2 === 0 && isMobile
                }
                restaurantSettings={restaurant!.settings}
                allDishes={allDishes}
                categories={categories}
              />
            ))}
        </div>
        {subCategoryView && (
          <DishesSubCategories
            show={show}
            othersLength={others.length}
            category={category.uid}
            subCategories={category.subCategories}
          />
        )}
      </div>
      <div ref={endElRef} id={`end-category-${category.uid}`} />
    </div>
  )
}

export default Dishes
