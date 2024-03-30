import { cn } from "@/helpers/utils"
import type { FC } from "react"
import { BiCheck } from "react-icons/bi"

interface ICheckbox {
  checked: boolean
  onClick?: () => void
}

const Checkbox: FC<ICheckbox> = ({ checked, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-5 w-5 rounded-[6px] border",
        checked ? "border-primary-600" : "border-gray-300"
      )}
    >
      {checked && <BiCheck className="text-primary-600" size={17} />}
    </div>
  )
}

export default Checkbox
