import { useI18n } from "@/components/providers/i18n"
import type { Locale } from "@/components/providers/i18n/i18n.interface"
import Drawer from "@/components/ui/drawer/drawer"
import { cn } from "@/helpers/utils"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { type FC } from "react"

interface IOptionsLanguage {
  isShow: boolean
  setIsShow: (value: boolean) => void
  setIsOptions: (value: boolean) => void
}

const OptionsLanguage: FC<IOptionsLanguage> = ({
  isShow,
  setIsShow,
  setIsOptions
}) => {
  const { replace } = useRouter()
  const params = useParams()

  const i18n = useI18n()

  const onLanguageClick = (language: Locale) => {
    replace(`/${language}/${params.slug}`)
    setIsOptions(false)
    setIsShow(false)
  }

  return (
    <>
      <Drawer isOpen={isShow} title={i18n.t("Language")} setIsOpen={setIsShow}>
        <div className="mt-6 flex flex-wrap gap-2">
          {i18n.languages.map((language, index) => (
            <button
              key={index}
              className={cn(
                "flex h-[55px] w-[calc(50%-4px)] items-center gap-3 rounded-lg bg-dark-bg px-3.5 text-xs",
                i18n.locale === language.locale && "bg-dark text-light"
              )}
              onClick={() => onLanguageClick(language.locale)}
            >
              <Image
                src={`/icons/flags/mobile/${language?.flag}.svg`}
                alt="lang"
                width={24}
                height={24}
              />
              {language.name}
            </button>
          ))}
        </div>
      </Drawer>
    </>
  )
}

export default OptionsLanguage
