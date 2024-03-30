import { cn } from "@/helpers/utils"
import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"
import { useRestaurant } from "../providers/restaurant/restaurant.provider"

interface IBrand {
  className?: string
}

const Brand: FC<IBrand> = ({ className }) => {
  const { restaurant } = useRestaurant()

  return (
    <Link
      target="_blank"
      href={`https://www.yumzi.at/?ref=${restaurant?.name}`}
      className={cn(
        "flex w-full items-center justify-center gap-1 text-[11px] font-semibold text-dark-disabled",
        className
      )}
    >
      powered by
      <Image
        src="/icons/logo-small.svg"
        alt="logo"
        width={39.544}
        height={12}
      />
    </Link>
  )
}

export default Brand
