import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import { cn } from "@/helpers/utils"
import type { ICategory, ISubCategory } from "@/interfaces/category.interface"
import { useCallback, useEffect, useRef, useState, type FC } from "react"
import { useCategories } from "../useCategories"

import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { useRouter, useSearchParams } from "next/navigation"

const getNumber = (num: number) => {
  return num < 10 ? `0${num}` : num
}

const CategoriesSidebarList: FC = () => {
  const { categories, dishes } = useRestaurant()
  const { categoryFilter } = useCategories()

  return (
    <ul className="mt-4 flex w-full flex-col gap-4">
      {categories
        .filter(categoryFilter)
        ?.filter((category) => dishes[category.uid]?.length > 0)
        ?.sort((a, b) => a.sortValue - b.sortValue)
        .map((category, index) => (
          <li key={category.uid}>
            <CategoryItem category={category} number={getNumber(index + 1)} />
          </li>
        ))}
    </ul>
  )
}

interface ICategoryItem {
  category: ICategory
  number: string | number
}

const CategoryItem: FC<ICategoryItem> = ({ category, number }) => {
  const searchParams = useSearchParams()
  const queryCategory = searchParams.get("category")

  const { replace } = useRouter()

  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const { category: activeCategory, categoryMap, restaurant } = useRestaurant()

  const i18n = useI18n()

  const isSubCategories = category.subCategories.length > 0
  const isShow = category.uid === activeCategory

  useEffect(() => {
    if (!isSubCategories) {
      ScrollTrigger?.create({
        scroller: "#main-window-desktop",
        //markers: true,
        trigger: `#start-category-${category.uid}`,
        start: "top 40%",
        endTrigger: `#end-category-${category.uid}`,
        end: "bottom 40%",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(parseFloat(self.progress.toFixed(3)))
        }
      })
    }
  }, [category.uid, isSubCategories])

  useEffect(() => {
    if (categoryMap[category.uid] && queryCategory === category.uid) {
      categoryClick()
      replace(`/${restaurant?.slug}`)
    }
  }, [queryCategory, categoryMap, restaurant?.slug, category.uid, replace])

  const getItemHeight = useCallback(() => {
    const margins = 28
    const subCategoryHeight = 30

    if (isSubCategories) {
      return (
        100 +
        category.subCategories.filter((d) => !!categoryMap[d.uid]).length *
          subCategoryHeight +
        margins
      )
    }

    const item = document.querySelector(`#category-${category.uid}`)
    const height = item?.getBoundingClientRect().height

    return height !== undefined ? height / 12 : 100
  }, [category.uid, isSubCategories, category.subCategories, categoryMap])

  const categoryClick = () => {
    const mainWindow = document.getElementById(
      "main-window-desktop"
    ) as HTMLElement
    const categoryContainer = document.getElementById(
      `category-${category.uid}`
    ) as HTMLElement

    // Category changed in useCategory hook
    setTimeout(() => {
      mainWindow?.scrollTo({
        // behavior: "smooth",
        top:
          categoryContainer?.getBoundingClientRect().top + mainWindow.scrollTop
      })
    }, 0)
  }

  return (
    <div
      id={`sidebar-category-${category.uid}`}
      ref={containerRef}
      onClick={categoryClick}
      className={cn(
        "relative flex min-h-[100px] w-full cursor-pointer flex-col overflow-hidden rounded-lg border border-dark-bg2 p-3 duration-300",
        !isShow && "hover:border-transparent hover:bg-dark-bg2"
      )}
      style={{
        maxHeight: isShow ? `${getItemHeight()}px` : "100px"
      }}
    >
      {!isSubCategories && (
        <div
          className="absolute h-[7px] w-[7px] rounded bg-dark transition-opacity duration-500 ltr:right-5 rtl:left-5"
          style={{
            top: "calc((100% - 32px) * " + progress + " + 12px)",
            opacity: isShow && progress > 0 ? 1 : 0
          }}
        />
      )}
      <span className="text-10 font-medium leading-4.5">{number}</span>
      <p
        className={cn(
          "max-w-[80%] break-words font-medium leading-4.5",
          isShow && isSubCategories ? "mt-2.5" : "mt-auto"
        )}
      >
        {i18n.find(category.title)?.title}
      </p>
      <ul
        className={cn(
          "flex w-full flex-col gap-2.5 duration-500",
          isShow && isSubCategories
            ? "mb-2 mt-5 h-auto opacity-100"
            : "pointer-events-none h-0 opacity-0"
        )}
      >
        {category.subCategories
          .filter((category) => !!categoryMap[category.uid])
          .sort((a, b) => a.sortValue - b.sortValue)
          .map((subCategory) => (
            <li key={subCategory.uid}>
              <SubCategoryItem subCategory={subCategory} />
            </li>
          ))}
      </ul>
    </div>
  )
}

interface ISubCategoryItem {
  subCategory: ISubCategory
}

const SubCategoryItem: FC<ISubCategoryItem> = ({ subCategory }) => {
  const searchParams = useSearchParams()
  const querySubCategory = searchParams.get("category")

  const { replace } = useRouter()

  const {
    subCategory: activeSubCategory,
    allDishes,
    categories,
    restaurant
  } = useRestaurant()
  const i18n = useI18n()

  const isActive = subCategory.uid === activeSubCategory

  useEffect(() => {
    if (
      allDishes.length &&
      categories.length &&
      querySubCategory === subCategory.uid
    ) {
      onSubCategoryClick()
      replace(`/${restaurant?.slug}`)
    }
  }, [
    querySubCategory,
    allDishes,
    categories,
    restaurant?.slug,
    subCategory.uid,
    replace
  ])

  const onSubCategoryClick = () => {
    const mainWindow = document.getElementById(
      "main-window-desktop"
    ) as HTMLElement
    const categoryContainer = document.getElementById(
      `subcategory-${subCategory.uid}`
    ) as HTMLElement

    // Category changed in useCategory hook
    mainWindow?.scrollTo({
      behavior: "smooth",
      top:
        categoryContainer?.getBoundingClientRect().top +
        mainWindow.scrollTop -
        100
    })
  }

  return (
    <button
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-1.5 font-light leading-4.5 duration-500 hover:bg-dark-bg2",
        isActive && "bg-dark-bg2"
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSubCategoryClick()
      }}
    >
      <span className="max-w-[80%] overflow-hidden text-ellipsis whitespace-nowrap text-sm">
        {i18n.find(subCategory.item)?.subCategory}
      </span>
      <div
        className="h-[7px] w-[7px] rounded bg-gray-900 transition-opacity duration-500"
        style={{
          opacity: isActive ? 1 : 0
        }}
      />
    </button>
  )
}

export default CategoriesSidebarList
