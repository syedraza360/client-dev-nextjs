import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import { cn } from "@/helpers/utils"
import type { FC } from "react"

const MenusDesktop: FC = () => {
  const { menus, activeMenuUid, setMenu, getSortedMenus } = useRestaurant()

  const i18n = useI18n()

  const filteredMenus = getSortedMenus(menus)

  if (filteredMenus.length === 1) return null
  return (
    <ul className="fixed bottom-6 left-1/2 z-[100] flex items-center gap-1 rounded-lg bg-white p-1.5 shadow-sm">
      {filteredMenus.map((menu) => (
        <li key={menu.uid}>
          <button
            className={cn(
              "rounded-lg px-3 py-[9px] text-sm duration-300",
              menu.uid === activeMenuUid
                ? "bg-dark text-light"
                : "hover:bg-dark-bg2"
            )}
            onClick={() => setMenu(menu.uid)}
          >
            {i18n.find(menu.name)?.name}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default MenusDesktop
