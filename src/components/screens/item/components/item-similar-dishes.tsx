import { useI18n } from "@/components/providers/i18n"
import Product from "@/components/ui/product/product"
import { translateFromObject } from "@/helpers/utils"
import type { ICategory, ISubCategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import type { IRestaurantSettings } from "@/interfaces/restaurant.interface"
import { useParams, useRouter } from "next/navigation"
import type { FC } from "react"
import { useEffect, useMemo } from "react"
import type { TypeItem } from "../item.interface"
import { useFindCategory } from "../useFindCategory"

interface IItemSimilarDishes {
  type: TypeItem
  dish: IDish
  categories: ICategory[]
  allDishes: IDish[]
  restaurantSettings: IRestaurantSettings
  onShowMore?: () => void
}

const ItemSimilarDishes: FC<IItemSimilarDishes> = ({
  type,
  dish,
  categories,
  allDishes,
  restaurantSettings,
  onShowMore
}) => {
  const { category, isSubCategory } = useFindCategory(dish, categories)

  const { slug } = useParams()

  const router = useRouter()
  const i18n = useI18n()

  useEffect(() => {
    if (type === "page") {
      router.prefetch(`/${slug}?category=${category?.uid}`)
    }
  }, [])

  const filteredDishedByCategory = useMemo(
    () =>
      allDishes.filter(
        (d) =>
          (d?.subcategory === category?.uid || d?.category === category?.uid) &&
          dish?.uid !== d?.uid
      ),
    [allDishes, category, dish?.uid]
  )

  const goToCategory = () => {
    onShowMore && onShowMore()
    if (type === "modal") {
      router.push(
        `/${slug}?${isSubCategory ? "subCategory" : "category"}=${category?.uid}`
      )
    } else {
      router.push(`/${slug}?category=${category?.uid}`)
    }
  }

  if (filteredDishedByCategory.length === 0) return null
  return (
    <div className="mt-2 bg-white px-3 pb-11 pt-[18px] tablet:mt-4 tablet:p-0">
      <p className="text-xs font-medium uppercase text-dark-foreground">
        {translateFromObject(
          (category as ICategory)?.title || (category as ISubCategory)?.item,
          i18n.locale,
          (category as ICategory)?.title ? "title" : "subCategory"
        )}
      </p>
      <p className="mt-1 text-xl font-semibold">{i18n.t("Similar items")}</p>
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 tablet:grid-cols-4">
        {filteredDishedByCategory
          ?.sort((a, b) => b.images.length - a.images.length)
          .slice(0, 4)
          .map((dish, index) => (
            <Product
              key={index}
              type="small"
              product={dish}
              restaurantSettings={restaurantSettings}
              allDishes={allDishes}
              categories={categories}
            />
          ))}
      </div>
      {filteredDishedByCategory.length > 4 && (
        <div className="flex justify-center">
          <button
            className="mt-8 rounded-5 bg-dark-bg2 px-2.5 py-[7.5px] text-xs font-medium tablet:text-sm"
            onClick={goToCategory}
          >
            {i18n.t("Show more items")}
          </button>
        </div>
      )}
    </div>
  )
}

export default ItemSimilarDishes
