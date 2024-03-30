import { Locale } from "@/components/providers/i18n/i18n.interface"
import RestaurantProvider from "@/components/providers/restaurant/restaurant.provider"
import Restaurant from "@/components/screens/restaurant/restaurant"
import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import { translateFromObject } from "@/helpers/utils"
import dishService from "@/services/dish/dish.service"
import restaurantService from "@/services/restaurant/restaurant.service"
import type { Metadata, NextPage } from "next"
import { getLocale } from "next-intl/server"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export const revalidate = 0

interface IParams {
  slug: string
}

interface IRestaurantPage {
  params: IParams
}

export const generateMetadata = async ({
  params: { slug }
}: IRestaurantPage): Promise<Metadata> => {
  const restaurantData = await restaurantService.getOne(slug)

  const restaurant = restaurantData?.data?.restaurants[0]

  const locale = ((await getLocale()) as Locale) || Locale.DE
  const heads = headers()
  const pathname = heads.get("next-url")

  return {
    title: restaurant?.name,
    description: translateFromObject(
      restaurant?.description,
      locale,
      "description"
    ),
    alternates: {
      canonical: pathname
    },
    openGraph: {
      url: pathname || "",
      title: restaurant?.name,
      description: translateFromObject(
        restaurant?.description,
        locale,
        "description"
      ),
      images: [
        {
          url: fixCdnUrl(restaurant?.logoImage?.mobile) || "",
          width: 800,
          height: 800
        }
      ]
    }
  }
}

const RestaurantPage: NextPage<IRestaurantPage> = async ({
  params: { slug }
}) => {
  const restaurantData = await restaurantService.getOne(slug)
  const restaurantMenusData = await restaurantService.getMenus({
    restaurantUid: restaurantData?.data.restaurants[0]?.uid || slug
  })
  const categoriesData = await restaurantService.getCategories({
    restaurantUid: restaurantData?.data.restaurants[0]?.uid || slug
  })
  const dishesData = await dishService.getAll({
    restaurantUid: restaurantData?.data.restaurants[0]?.uid || slug
  })
  if (
    !restaurantData ||
    !restaurantData.data.restaurants[0] ||
    !restaurantMenusData ||
    !categoriesData ||
    !dishesData
  )
    notFound()
  return (
    <RestaurantProvider
      restaurant={restaurantData.data.restaurants[0]}
      menus={restaurantMenusData.data.menus}
      categories={categoriesData.data.categories}
      allDishes={dishesData.data.dishes}
    >
      <Restaurant />
    </RestaurantProvider>
  )
}

export default RestaurantPage
