"use client"

import type { IRestaurant } from "@/interfaces/restaurant.interface"
import { useRouter } from "next/navigation"
import type { FC } from "react"

interface IRestaurantItem {
  item: IRestaurant
}

const RestaurantItem: FC<IRestaurantItem> = ({ item }) => {
  const { push } = useRouter()

  const onRestaurantClick = () => {
    localStorage.setItem("scroll", "0")
    push(`/${item.slug}`)
  }

  return (
    <button
      role="link"
      className="border border-gray-200 px-3 py-6 text-left font-semibold text-gray-800"
      onClick={onRestaurantClick}
    >
      {item.name}
    </button>
  )
}

export default RestaurantItem
