import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Image from "next/image"
import Link from "next/link"
import type { FC } from "react"

const YumziBranding: FC = () => {
  const { restaurant } = useRestaurant()

  return (
    <div className="fixed bottom-7 right-6 z-50">
      <Link
        href={`https://www.yumzi.at/?ref=${restaurant?.name}`}
        target="_blank"
      >
        <p className="mt-4 flex w-full items-center justify-center gap-1 rounded-md bg-white p-[5px] text-13 font-semibold text-black/70 shadow-md backdrop-blur-[1px]">
          powered by
          <Image
            src="/icons/logo-small-2.svg"
            alt="logo"
            width={42.843}
            height={13}
          />
        </p>
      </Link>
    </div>
  )
}

export default YumziBranding
