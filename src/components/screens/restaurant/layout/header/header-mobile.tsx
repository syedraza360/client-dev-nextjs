import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import { cn } from "@/helpers/utils"
import Image from "next/image"
import { type FC } from "react"
import Categories from "../categories/categories"

const HeaderMobile: FC = () => {
  const { dishQuery, dishes } = useRestaurant()

  const isNoDishes =
    dishQuery.preferenceCategories.length > 0 &&
    Object.entries(dishes).length === 0

  return (
    <header className={cn(!isNoDishes && "pt-[64px]")}>
      <div className="fixed left-0 top-0 z-20 flex w-full items-center bg-white py-4 shadow">
        <Categories isNoDishes={isNoDishes} />
      </div>
      {!isNoDishes && <RestaurantAbout />}
    </header>
  )
}

const RestaurantAbout = () => {
  const { restaurant } = useRestaurant()

  return (
    <div className="relative flex h-[140px] w-full items-center justify-center">
      <div className="absolute left-0 top-0 -z-[1] h-full w-full">
        <Image
          src={fixCdnUrl(restaurant?.coverImage?.mobile) || ""}
          alt="banner"
          priority
          layout="fill"
          objectFit="cover"
          placeholder="blur"
          blurDataURL="/images/blur.png"
        />
        <div className="absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.45)]" />
      </div>
      <h1 className="text-[25px] font-semibold text-white">
        {restaurant?.name}
      </h1>
      <div className="absolute -bottom-[34px] left-1/2 h-[67px] w-[67px] -translate-x-1/2 rounded-full bg-white">
        <Image
          src={fixCdnUrl(restaurant?.logoImage?.mobile) || ""}
          alt="logo"
          fill
          priority
          className="rounded-full border-[3px] border-white object-cover"
        />
      </div>
    </div>
  )
}

export default HeaderMobile
