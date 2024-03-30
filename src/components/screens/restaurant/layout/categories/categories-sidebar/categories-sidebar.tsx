import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import Image from "next/image"
import type { FC } from "react"
import CategoriesSidebarList from "./categories-sidebar-list"

const CategoriesSidebar: FC = () => {
  const { restaurant } = useRestaurant()

  return (
    <aside
      id="sidebar-categories-scroll"
      className="no-scrollbar laptop:rtr:pl-0 flex h-screen w-[260px] flex-col items-center justify-start overflow-y-auto p-8 laptop:w-[326px] laptop:p-16 ltr:pr-0 laptop:ltr:pr-0 rtl:pl-0"
    >
      <div className="relative mr-auto min-h-[101px] w-[171px]">
        <Image
          src={fixCdnUrl(restaurant?.logoImage?.desktop) || ""}
          alt="restaurant logo"
          fill
          priority
          className="object-contain object-left-top"
          placeholder="blur"
          blurDataURL="/images/blur.png"
        />
      </div>
      <CategoriesSidebarList />
    </aside>
  )
}

export default CategoriesSidebar
