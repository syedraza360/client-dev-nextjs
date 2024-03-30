import { useI18n } from "@/components/providers/i18n"
import type { TypeI18nVariantsSystem } from "@/components/providers/i18n/i18n.interface"
import { useRouter } from "next/navigation"
import type { FC } from "react"
import { FiChevronLeft } from "react-icons/fi"

interface IPageTitle {
  title: TypeI18nVariantsSystem
  back?: boolean
}

const PageTitle: FC<IPageTitle> = ({ title, back }) => {
  const i18n = useI18n()
  const router = useRouter()

  return (
    <div className="bg-gray-900 text-white">
      <div className="container relative py-4 mobile:px-4">
        {back && (
          <FiChevronLeft
            size={20}
            onClick={() => router.back()}
            className="absolute left-0 top-1/2 -translate-y-1/2 mobile:left-4"
          />
        )}
        <p className="text-center text-base font-semibold"> {i18n.t(title)}</p>
      </div>
    </div>
  )
}

export default PageTitle
