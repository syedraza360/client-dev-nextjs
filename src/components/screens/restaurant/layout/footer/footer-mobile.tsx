import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Brand from "@/components/ui/brand"
import type { FC } from "react"

const FooterMobile: FC = () => {
  const { dishQuery, dishes, restaurant } = useRestaurant()
  const i18n = useI18n()

  const isNoDishes =
    dishQuery.preferenceCategories.length > 0 &&
    Object.entries(dishes).length === 0

  if (isNoDishes) return null
  return (
    <footer className="border-t-8 border-t-gray-50 px-3 pb-24 pt-4 text-center text-xs text-dark-foreground">
      {i18n.t("Responsible for the content:")} {restaurant?.name}
      <br />
      {i18n.t("Smart Menu provided by Yumzi GmbH.")}
      <Brand className="mt-1" />
    </footer>
  )
}

export default FooterMobile
