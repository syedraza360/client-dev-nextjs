import { Locale } from "@/components/providers/i18n/i18n.interface"
import Item from "@/components/screens/item/item"
import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import { translateFromObject } from "@/helpers/utils"
import { RestaurantType } from "@/interfaces/restaurant.interface"
import dishService from "@/services/dish/dish.service"
import restaurantService from "@/services/restaurant/restaurant.service"
import type { Metadata, NextPage } from "next"
import { getLocale } from "next-intl/server"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

interface IParams {
  slug: string
  item_uid: string
}

interface IRestaurantPage {
  params: IParams
}

export const revalidate = 0

export const generateMetadata = async ({
  params: { slug, item_uid }
}: IRestaurantPage): Promise<Metadata> => {
  const restaurantData = await restaurantService.getOne(slug)
  const dishData = await dishService.getOne(item_uid)

  const restaurant = restaurantData?.data?.restaurants[0]
  const dish = dishData?.data?.dishes[0]

  const locale = ((await getLocale()) as Locale) || Locale.DE
  const heads = headers()
  const pathname = heads.get("next-url")

  return {
    title: translateFromObject(dish?.name, locale, "name"),
    description:
      translateFromObject(restaurant?.name, locale, "name") +
      " - " +
      translateFromObject(dish?.description, locale, "description"),
    alternates: {
      canonical: pathname
    },
    openGraph: {
      url: pathname || "",
      title: translateFromObject(dish?.name, locale, "name"),
      description:
        translateFromObject(restaurant?.name, locale, "name") +
        " - " +
        translateFromObject(dish?.description, locale, "description"),
      images: [
        {
          url: fixCdnUrl(dish?.images[0]) || "",
          width: 800,
          height: 800
        }
      ]
    }
  }
}

const ItemPage: NextPage<IRestaurantPage> = async ({
  params: { slug, item_uid }
}) => {
  const restaurantData = await restaurantService.getOne(slug)
  const categoriesData = await restaurantService.getCategories({
    restaurantUid: restaurantData?.data.restaurants[0]?.uid || slug
  })
  const dishesData = await dishService.getAll({
    restaurantUid: restaurantData?.data.restaurants[0]?.uid || slug
  })
  const dishData = await dishService.getOne(item_uid)

  const restaurant = restaurantData?.data?.restaurants[0]

  console.log("restaurant", restaurant)
  console.log("dishData", dishData)
  console.log("dishesData", dishesData)

  if (!restaurantData || !categoriesData || !dishesData || !dishData) notFound()
  return (
    <>
      {!dishData.error && (
        <Item
          type={restaurant?.yumziProduct || RestaurantType.BROWSE}
          restaurant={restaurant!}
          dish={dishData.data.dishes[0]}
          categories={categoriesData.data.categories}
          allDishes={dishesData.data.dishes}
        />
      )}
    </>
  )
}

export default ItemPage
