import { useI18n } from "@/components/providers/i18n"
import { translateFromObject } from "@/helpers/utils"
import type { IDish } from "@/interfaces/dish.interface"
import type { IRestaurant } from "@/interfaces/restaurant.interface"
import { NextSeo } from "next-seo"
import { usePathname } from "next/navigation"
import type { FC } from "react"

interface IItemSeo {
  dish: IDish
  restaurant: IRestaurant
}

const ItemSeo: FC<IItemSeo> = ({ dish, restaurant }) => {
  const pathname = usePathname()
  const i18n = useI18n()

  return (
    <NextSeo
      title={translateFromObject(dish?.name, i18n.locale, "name")}
      description={
        translateFromObject(restaurant?.name, i18n.locale, "name") +
        " - " +
        translateFromObject(dish?.description, i18n.locale, "description")
      }
      canonical={
        process.env.VERCEL_URL ? `${process.env.VERCEL_URL}${pathname}` : ""
      }
      openGraph={{
        url: process.env.VERCEL_URL
          ? `${process.env.VERCEL_URL}${pathname}`
          : "",
        title: translateFromObject(dish?.name, i18n.locale, "name"),
        description:
          translateFromObject(restaurant?.name, i18n.locale, "name") +
          " - " +
          translateFromObject(dish?.description, i18n.locale, "description"),
        images: [
          {
            url: dish?.images[0] || "",
            width: 800,
            height: 800
          }
        ]
      }}
    />
  )
}

export default ItemSeo
