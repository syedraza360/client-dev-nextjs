import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Product from "@/components/ui/product/product"
import { cn } from "@/helpers/utils"
import type { ISubCategory } from "@/interfaces/category.interface"
import { ShowMode } from "@/interfaces/common.interface"
import type { IDish } from "@/interfaces/dish.interface"
import { useEffect, useRef, type FC } from "react"

import { useScreenSize } from "@/hooks/useScreenSize"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

interface ISubCategories {
  show: ShowMode
  category: string
  subCategories: ISubCategory[]
  othersLength: number
}

const DishesSubCategories: FC<ISubCategories> = ({
  show,
  category,
  subCategories
}) => {
  const { categoryMap2, dishes } = useRestaurant()

  return (
    <div className="flex flex-col gap-6 tablet:gap-16">
      {subCategories
        ?.filter((d) => !!categoryMap2[d.uid])
        ?.sort((a, b) => a.sortValue - b.sortValue)
        ?.map((subcategory, index) => {
          const products = dishes[category]?.filter(
            (d) => d?.subcategory === subcategory?.uid
          )

          return (
            <Item
              key={subcategory.uid}
              isFirst={index === 0}
              show={show}
              subcategory={subcategory}
              products={products}
            />
          )
        })}
    </div>
  )
}

interface IItem {
  isFirst: boolean
  show: ShowMode
  subcategory: ISubCategory
  products: IDish[]
}

const Item: FC<IItem> = ({ isFirst, show, subcategory, products }) => {
  const { isMobile } = useScreenSize()

  const startElRef = useRef<HTMLDivElement>(null)
  const endElRef = useRef<HTMLDivElement>(null)
  const { restaurant, setSubCategory, allDishes, categories } = useRestaurant()

  const i18n = useI18n()

  useEffect(() => {
    if (!isMobile) {
      const enterCallback = () => {
        setSubCategory(subcategory.uid)
      }

      ScrollTrigger?.create({
        scroller: "#main-window-desktop",
        trigger: startElRef.current,
        start: "top center",
        endTrigger: endElRef.current,
        end: "bottom center",
        invalidateOnRefresh: true,
        onEnter: enterCallback,
        onEnterBack: enterCallback,
        onLeaveBack: () => {
          if (isFirst) {
            setSubCategory("")
          }
        }
      })
    }
  }, [subcategory.uid, setSubCategory, isMobile, isFirst])

  return (
    <div>
      <div ref={startElRef} />
      <div
        id={`subcategory-${subcategory?.uid}`}
        style={{
          display: products?.length > 0 ? "block" : "none"
        }}
      >
        <p className="font-semibold leading-6 tablet:px-6 tablet:text-xl">
          {i18n.find(subcategory?.item)?.subCategory}
        </p>
        <div
          className={cn(
            "mt-4 grid grid-cols-12 gap-x-3 gap-y-6 tablet:mt-8 tablet:gap-6",
            show === ShowMode.GRID
              ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {products
            .filter((d) => d.images.length > 0)
            ?.sort((a, b) => a.sortValue - b.sortValue)
            ?.map((product, index) => (
              <Product
                key={index}
                product={product}
                index={index}
                isFullWidth={
                  index === products.length - 1 && index % 2 === 0 && isMobile
                }
                restaurantSettings={restaurant!.settings}
                allDishes={allDishes}
                categories={categories}
              />
            ))}
          {products
            .filter((d) => d.images.length === 0)
            ?.sort((a, b) => a.sortValue - b.sortValue)
            ?.map((product, index) => (
              <Product
                key={index}
                product={product}
                index={index}
                isFullWidth={
                  index === products.length - 1 && index % 2 === 0 && isMobile
                }
                restaurantSettings={restaurant!.settings}
                allDishes={allDishes}
                categories={categories}
              />
            ))}
        </div>
      </div>
      <div ref={endElRef} />
    </div>
  )
}

export default DishesSubCategories
