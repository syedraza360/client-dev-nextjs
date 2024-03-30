import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Drawer from "@/components/ui/drawer/drawer"
import { cn } from "@/helpers/utils"
import Image from "next/image"
import { useState, type FC } from "react"

const Menus: FC = () => {
  const [isShow, setIsShow] = useState(false)

  const { menus, activeMenuUid, setMenu, getSortedMenus } = useRestaurant()

  const filteredMenus = getSortedMenus(menus)

  const i18n = useI18n()

  const onMenuClick = (menuUid: string) => {
    setMenu(menuUid)
    setIsShow(false)
  }

  if (filteredMenus.length === 1) return null
  return (
    <div className="flex-1">
      <button
        className="flex w-full flex-col items-center justify-center gap-1 rounded-lg bg-dark-bg2 px-3 py-[11px] backdrop-blur"
        onClick={() => setIsShow(true)}
      >
        <Image src="/icons/menu.svg" alt="options" width={14.86} height={14} />
        <span className="text-10">{i18n.t("Menus")}</span>
      </button>
      <Drawer isOpen={isShow} title={i18n.t("Menu")} setIsOpen={setIsShow}>
        <ul className="mt-6 flex flex-col gap-2">
          {filteredMenus.map((menu, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-lg bg-dark-bg px-3.5 py-[17.5px] font-medium duration-300",
                activeMenuUid === menu.uid && "bg-dark text-light"
              )}
              onClick={() => onMenuClick(menu.uid)}
            >
              <Image
                src={`/icons/${activeMenuUid === menu.uid ? "menu-light" : "menu"}.svg`}
                alt="menu"
                width={21.224}
                height={20}
              />
              <span className="text-xs">{i18n.find(menu.name)?.name}</span>
            </li>
          ))}
        </ul>
      </Drawer>
    </div>
  )
}

export default Menus
