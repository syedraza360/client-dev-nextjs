"use client"

import { useI18n } from "@/components/providers/i18n"
import { useRoutesHistory } from "@/components/providers/routes-history.provider"
import { share } from "@/helpers/navigator/share"
import { cn, translateFromObject } from "@/helpers/utils"
import { useScreenSize } from "@/hooks/useScreenSize"
import type { ICategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import type {
  IRestaurant,
  RestaurantType
} from "@/interfaces/restaurant.interface"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, type FC } from "react"
import ItemAbout from "./components/item-about"
import ItemCharacteristics from "./components/item-characteristics"
import ItemDetails from "./components/item-details"
import ItemRecommendations from "./components/item-recommendations"
import ItemSimilarDishes from "./components/item-similar-dishes"
import { useFindCategory } from "./useFindCategory"

import ArrowLeft from "public/icons/arrow-left.svg"
import ShareIcon from "public/icons/share.svg"

interface IItem {
  type: RestaurantType
  restaurant: IRestaurant
  dish: IDish
  categories: ICategory[]
  allDishes: IDish[]
}

const Item: FC<IItem> = ({ dish, categories, allDishes, restaurant }) => {
  const [isShowAllergens, setIsShowAllergens] = useState(false)

  const { isMobile } = useScreenSize()
  const { replace } = useRouter()
  const { slug, item_uid } = useParams()

  useEffect(() => {
    if (!isMobile) {
      replace(`/${slug}?dishId=${item_uid}`)
    }
  }, [isMobile, slug, item_uid, replace])

  const { category } = useFindCategory(dish, categories)

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0)
    }

    // Add event listener to listen for route changes
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      // Remove event listener when the component unmounts
      window.removeEventListener("popstate", handleRouteChange)
    }
  }, [])

  console.log("categories", categories)

  return (
    <div className="bg-gray-50" style={{ minHeight: "120vh" }}>
      <Header dish={dish} categoryId={category?.uid || ""} />
      <ItemDetails dish={dish} />
      <div
        className={cn(
          "sticky z-10 bg-gray-50",
          dish?.images?.length > 1 && "mt-1"
        )}
      >
        <ItemAbout
          dish={dish}
          categories={categories}
          restaurant={restaurant}
          isShowAllergens={isShowAllergens}
          setIsShowAllergens={setIsShowAllergens}
        />
        <ItemCharacteristics dish={dish} />
        <ItemRecommendations
          type="page"
          dish={dish}
          allDishes={allDishes}
          categories={categories}
          restaurantSettings={restaurant.settings}
        />
        <ItemSimilarDishes
          type="page"
          dish={dish}
          categories={categories}
          allDishes={allDishes}
          restaurantSettings={restaurant.settings}
        />
      </div>
    </div>
  )
}

interface IHeader {
  dish: IDish
  categoryId: string
}

const Header: FC<IHeader> = ({ dish, categoryId }) => {
  const { slug } = useParams()
  const routesHistory = useRoutesHistory()
  const router = useRouter()
  const i18n = useI18n()

  const goBack = () => {
    if (routesHistory.length === 1) {
      router.push(`/${slug}?category=${categoryId}`)
    } else {
      router.back()
    }
  }

  console.log("translateFromObject", dish?.name)
  return (
    <div className="sticky left-0 top-0 z-20 flex h-14 items-center justify-between gap-4 bg-white px-3">
      <button onClick={goBack} className="h-full min-h-6 min-w-6">
        <ArrowLeft />
      </button>
      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
        {translateFromObject(dish?.name, i18n.locale, "name")}
      </h1>
      <button onClick={share} className="h-full min-h-6 min-w-6">
        <ShareIcon />
      </button>
    </div>
  )
}

export default Item
