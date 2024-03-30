import { useI18n } from "@/components/providers/i18n"
import Product from "@/components/ui/product/product"
import type { ICategory } from "@/interfaces/category.interface"
import type { IDish, IDishRecommendation } from "@/interfaces/dish.interface"
import type { IRestaurantSettings } from "@/interfaces/restaurant.interface"
import type { FC } from "react"
import { useMemo } from "react"
import type { TypeItem } from "../item.interface"

interface IItemRecommendations {
  type: TypeItem
  dish: IDish
  allDishes: IDish[]
  categories: ICategory[]
  restaurantSettings: IRestaurantSettings
}

const ItemRecommendations: FC<IItemRecommendations> = ({
  type,
  dish,
  allDishes,
  categories,
  restaurantSettings
}) => {
  const isRecommendations = useMemo(() => {
    if (!dish?.recommendations) return false

    return dish.recommendations?.some((rec) => rec.dishes.length > 0)
  }, [dish])

  const i18n = useI18n()

  if (!isRecommendations) return null
  return (
    <div className="mt-2 bg-white px-3 pb-4 pt-[18px] tablet:mt-0 tablet:p-0">
      <div className="mb-1 text-xs font-medium uppercase text-dark-foreground">
        {i18n.t("Our recommendation")}
      </div>
      <div className="flex flex-col gap-8">
        {dish.recommendations?.map((rec, index) => (
          <Item
            key={index}
            type={type}
            rec={rec}
            categories={categories}
            allDishes={allDishes}
            restaurantSettings={restaurantSettings}
          />
        ))}
      </div>
    </div>
  )
}

interface IItem extends Omit<IItemRecommendations, "dish"> {
  rec: IDishRecommendation
}

const Item: FC<IItem> = ({
  type,
  rec,
  categories,
  allDishes,
  restaurantSettings
}) => {
  const category = categories.find((c) => c.uid === rec.category)

  const findDish = (uid: string) => allDishes.find((d) => d.uid === uid)!

  if (!category) return null
  return (
    <div>
      <p className="text-xl font-semibold">{category.titleOrigin}</p>
      <div className="mt-4 flex gap-3">
        {type === "modal" ? (
          <div className="grid grid-cols-3 gap-3">
            {rec.dishes
              .sort(
                (a, b) => findDish(b).images.length - findDish(a).images.length
              )
              .map((dish, index) => (
                <div key={index} className="flex-1">
                  <Product
                    product={allDishes.find((d) => d.uid === dish)!}
                    type="small"
                    restaurantSettings={restaurantSettings}
                    allDishes={allDishes}
                    categories={categories}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div className="no-scrollbar flex w-full gap-3 overflow-y-auto">
            {rec.dishes
              .sort(
                (a, b) => findDish(b).images.length - findDish(a).images.length
              )
              .map((dish, index) => (
                <div key={index} className="flex-1">
                  {rec.dishes.length > 2 ? (
                    <div className="h-full w-[168px]">
                      <Product
                        type="small"
                        product={findDish(dish)}
                        restaurantSettings={restaurantSettings}
                        allDishes={allDishes}
                        categories={categories}
                      />
                    </div>
                  ) : (
                    <Product
                      type="small"
                      product={findDish(dish)}
                      restaurantSettings={restaurantSettings}
                      allDishes={allDishes}
                      categories={categories}
                    />
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemRecommendations
