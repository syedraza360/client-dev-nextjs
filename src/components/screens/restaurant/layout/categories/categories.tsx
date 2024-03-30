import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import type { ICategory } from "@/interfaces/category.interface"
import moment from "moment"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import type { FC } from "react"
import { useEffect } from "react"
import { useCategories } from "./useCategories"

interface ICategories {
  isNoDishes: boolean
}

const Categories: FC<ICategories> = ({ isNoDishes }) => {
  const pathname = usePathname()
  const { replace } = useRouter()
  const searchParams = useSearchParams()
  const searchCategory = searchParams.get("category")

  const {
    category: value,
    setCategory: onChange,
    dishQuery: query,
    activeMenuUid
  } = useRestaurant()
  const { categoryFilter } = useCategories()

  const { categories } = useRestaurant()
  const category = categories.find((d) => d.uid === value)

  console.log('categories', categories)

  useEffect(() => {
    const categoryContainer = document.querySelector("#category-scroll")
    const item = document.querySelector(`#scroll-${value}`) as HTMLElement
    if (!item) return
    categoryContainer?.scrollTo({
      left:
        item.offsetLeft - categoryContainer.clientWidth + item.clientWidth + 20,
      behavior: "smooth"
    })
  }, [value])

  useEffect(() => {
    if (searchCategory && categories.length > 0) {
      if (categories?.some((d) => d.uid === searchCategory)) {
        onChange && onChange(searchCategory as string)
        categoryScroll("category", searchCategory as string)
      } else {
        let foundCategory
        let subCategory

        for (const cat of categories) {
          const foundSubCategory = cat.subCategories.find(
            (sCat) => sCat?.uid === searchCategory
          )

          if (foundSubCategory) {
            foundCategory = cat
            subCategory = foundSubCategory
            break
          }
        }

        if (foundCategory && subCategory) {
          onChange && onChange(foundCategory?.uid)
          categoryScroll("subcategory", foundCategory.uid, subCategory.uid)
        }
      }
      replace(pathname.split("?")[0], { scroll: false })
    }
  }, [searchCategory, categories])

  const categoryScroll = (
    type: "category" | "subcategory",
    categoryId: string,
    subcategoryId?: string
  ) => {
    const mainWindow = window

    const categoryContainer = document.querySelector(
      `#${type}-${type === "category" ? categoryId : subcategoryId || ""}`
    ) as HTMLElement
    if (!!mainWindow && !!categoryContainer) {
      window.autoScroll = moment()
      mainWindow.scrollTo({
        top: categoryContainer.offsetTop - 40
      })
    }
    const categoryScroll = document.querySelector("#category-scroll")
    const item = document.querySelector(`#scroll-${categoryId}`) as HTMLElement
    if (!!categoryScroll && !!item) {
      categoryScroll.scrollTo({
        left:
          item.offsetLeft - categoryScroll.clientWidth + item.clientWidth + 20
      })
    }
  }

  return (
    <div
      className="no-scrollbar flex gap-2 overflow-x-auto px-4"
      id="category-scroll"
    >
      {category && query?.subcategories?.length > 0 && (
        <Category category={category!} />
      )}
      {categories
        ?.filter(
          isNoDishes ? (cat) => cat.menuUid === activeMenuUid : categoryFilter
        )
        ?.sort((a, b) => a.sortValue - b.sortValue)
        .map((category, index) => <Category key={index} category={category} />)}
    </div>
  )
}

interface ICategoryItem {
  category: ICategory
}

const Category: FC<ICategoryItem> = ({ category }) => {
  const {
    category: value,
    setCategory: onChange,
    dishQuery: query,
    setDishQuery: setQuery
  } = useRestaurant()

  const i18n = useI18n()

  const onCategoryClick = () => {
    onChange && onChange(category.uid)
    if (value !== category?.uid) {
      setQuery({
        ...query,
        subcategories: []
      })
      window.setTimeout(() => {
        const mainWindow = window
        const categoryContainer = document.querySelector(
          "#category-" + category.uid
        ) as HTMLElement
        if (!!mainWindow && !!categoryContainer) {
          window.autoScroll = moment()
          mainWindow.scrollTo({
            top:
              categoryContainer.offsetTop < 200
                ? 0
                : categoryContainer.offsetTop,
            behavior: "smooth"
          })
        }
      }, 100)
    }
  }

  return (
    <button
      id={`scroll-${category.uid}`}
      onClick={onCategoryClick}
      className={`category-item ${value === category.uid ? "active" : ""}`}
    >
      {i18n.find(category?.title)?.title}
    </button>
  )
}

export default Categories
