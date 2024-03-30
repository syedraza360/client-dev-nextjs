import { useI18n } from "@/components/providers/i18n"
import type { II18nContextLanguage } from "@/components/providers/i18n/i18n.interface"
import { cn } from "@/helpers/utils"
import { useScreenSize } from "@/hooks/useScreenSize"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"
import Modal from "./modal/modal"

const Languages = () => {
  const [show, setShow] = useState(false)

  const i18n = useI18n()

  const lang = i18n.languages.find((d) => d.locale === i18n.locale)

  return (
    <>
      <div
        role="button"
        className="flex items-center gap-2"
        onClick={() => setShow(true)}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <Image
            src={`/icons/flags/desktop/${lang?.flag}.png`}
            width={25}
            height={25}
            alt={lang?.flag || ""}
            className="rounded-full"
          />
          <span className="dashed-border hidden text-sm font-light tablet:block">
            {lang?.name}
          </span>
        </div>
      </div>
      <Modal
        isOpen={show}
        closeDialog={() => setShow(false)}
        className="max-w-[643px]"
      >
        <div className="border-b border-b-gray-100 p-6 text-center text-lg font-semibold">
          {i18n.t("Select your language")}
        </div>
        <div className="grid grid-cols-2 gap-2 p-8">
          {i18n.languages.map((language, index) => (
            <LanguageItem key={index} item={language} setShow={setShow} />
          ))}
        </div>
      </Modal>
    </>
  )
}

interface ILanguageItem {
  item: II18nContextLanguage
  setShow: Dispatch<SetStateAction<boolean>>
}

const LanguageItem: FC<ILanguageItem> = ({ item, setShow }) => {
  const { replace } = useRouter()
  const params = useParams()

  const { isMobile } = useScreenSize()
  const i18n = useI18n()

  const changeLocale = () => {
    replace(`/${item.locale}/${params.slug}`)
    if (!isMobile) {
      setShow(false)
    }
  }

  return (
    <button
      key={item.locale}
      className={cn(
        "flex h-[55px] items-center gap-3 rounded-lg bg-dark-bg px-3.5 text-sm duration-300 hover:bg-dark-bg2",
        i18n.locale === item.locale && "bg-dark text-light"
      )}
      onClick={changeLocale}
    >
      <Image
        src={`/icons/flags/mobile/${item?.flag}.svg`}
        alt="lang"
        width={24}
        height={24}
      />
      {item.name}
    </button>
  )
}

export default Languages
