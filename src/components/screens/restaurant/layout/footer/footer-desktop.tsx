import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import type { FC } from "react"

const FooterDesktop: FC = () => {
  const { restaurant } = useRestaurant()
  const i18n = useI18n()

  return (
    <footer className="mt-6 text-sm text-dark-foreground">
      {i18n.t("Responsible for the content:")} {restaurant?.name} -{" "}
      {i18n.t("Smart Menu provided by Yumzi GmbH.")}
    </footer>
  )
}

export default FooterDesktop
