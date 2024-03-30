import { cn } from "@/helpers/utils"
import { type FC } from "react"

interface IMenuItem {
  isActive: boolean
  iconSrc: string
  text: string
  onClick: () => void
}

const MenuItem: FC<IMenuItem> = ({ isActive, iconSrc, text, onClick }) => {
  return (
    <button className="w-[calc(25%-12px)]" onClick={onClick}>
      <div
        className={cn(
          "flex h-[78px] w-full items-center justify-center rounded-2xl duration-300",
          isActive ? "bg-black/80" : "bg-dark-bg"
        )}
      >
        {/* We're not using next.js Image because we don't know image sizes */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/icons/${iconSrc}`} alt="icon" fetchPriority="high" />
      </div>
      <p className="mt-2.5 text-center text-11 font-semibold text-black/60">
        {text}
      </p>
    </button>
  )
}

export default MenuItem
