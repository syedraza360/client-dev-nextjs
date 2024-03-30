import { cn } from "@/helpers/utils"
import { type FC, type PropsWithChildren } from "react"

interface IPopup {
  isOpen: boolean
  className?: string
  duration?: number
}

const Popup: FC<PropsWithChildren<IPopup>> = ({
  children,
  className,
  isOpen
}) => {
  return (
    <div
      className={cn(
        "absolute z-[10000] flex items-center justify-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-md duration-300",
        isOpen ? "opacity-1" : "pointer-events-none opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}

export default Popup
