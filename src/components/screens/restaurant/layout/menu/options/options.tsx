import { useI18n } from "@/components/providers/i18n"
import Drawer from "@/components/ui/drawer/drawer"
import { share } from "@/helpers/navigator/share"
import { ShowMode } from "@/interfaces/common.interface"
import Image from "next/image"
import type { Dispatch, SetStateAction } from "react"
import { useState, type FC } from "react"
import MenuItem from "../menu-item"
import OptionsLanguage from "./options-language"
import OptionsSearch from "./options-search"

interface IOptions {
  showMode: ShowMode
  setShowMode: Dispatch<SetStateAction<ShowMode>>
}

const Options: FC<IOptions> = ({ showMode, setShowMode }) => {
  const [isShow, setIsShow] = useState(false)
  const [optionsMenus, setOptionsMenus] = useState({
    isShowLanguage: false,
    isShowSearch: false
  })

  const i18n = useI18n()

  const openOptions = () => {
    setIsShow(true)
  }

  const toggleLanguage = (value: boolean) => {
    setOptionsMenus({
      ...optionsMenus,
      isShowLanguage: value
    })
    if (!value) {
      setIsShow(false)
    }
  }

  const toggleSearch = (value: boolean) => {
    setOptionsMenus({
      ...optionsMenus,
      isShowSearch: value
    })
    setIsShow(!value)

    document.body.style.overflow = value ? "hidden" : "auto"
  }

  return (
    <div className="flex-1">
      <button
        className="flex w-full flex-col items-center justify-center rounded-lg bg-dark-bg2 px-3 py-[11px] backdrop-blur"
        onClick={openOptions}
      >
        <Image
          src="/icons/dots-horizontal.svg"
          alt="options"
          width={18}
          height={18}
        />
        <span className="text-10">{i18n.t("More")}</span>
      </button>
      <Drawer isOpen={isShow} setIsOpen={setIsShow}>
        <div className="mt-6 flex flex-wrap gap-4">
          <MenuItem
            isActive={false}
            iconSrc="translate.svg"
            text={i18n.t("Language")}
            onClick={() => toggleLanguage(true)}
          />
          <MenuItem
            isActive={false}
            iconSrc="search.svg"
            text={i18n.t("Search")}
            onClick={() => toggleSearch(true)}
          />
          <MenuItem
            isActive={showMode === ShowMode.LIST}
            iconSrc={`${showMode === ShowMode.LIST ? "list-light" : "grid"}.svg`}
            text={i18n.t("View")}
            onClick={() =>
              setShowMode(
                showMode === ShowMode.GRID ? ShowMode.LIST : ShowMode.GRID
              )
            }
          />
          <MenuItem
            isActive={false}
            iconSrc="share.svg"
            text={i18n.t("Share")}
            onClick={share}
          />
        </div>
      </Drawer>
      <OptionsLanguage
        isShow={optionsMenus.isShowLanguage}
        setIsOptions={setIsShow}
        setIsShow={toggleLanguage}
      />
      <OptionsSearch
        isShow={optionsMenus.isShowSearch}
        setIsShow={toggleSearch}
      />
    </div>
  )
}

export default Options
