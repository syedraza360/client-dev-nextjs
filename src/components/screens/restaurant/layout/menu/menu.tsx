import type { ShowMode } from "@/interfaces/common.interface"
import type { Dispatch, SetStateAction } from "react"
import { type FC } from "react"
import FilterMobile from "./filter-mobile"
import Menus from "./menus"
import Options from "./options/options"

interface IMenu {
  showMode: ShowMode
  setShowMode: Dispatch<SetStateAction<ShowMode>>
}

const Menu: FC<IMenu> = ({ showMode, setShowMode }) => {
  return (
    <div className="fixed bottom-0 left-0 z-10 w-full border-t border-t-dark-bg2 bg-white">
      <div className="flex items-center gap-4 px-6 py-3">
        <FilterMobile />
        <Menus />
        <Options showMode={showMode} setShowMode={setShowMode} />
      </div>
    </div>
  )
}

export default Menu
