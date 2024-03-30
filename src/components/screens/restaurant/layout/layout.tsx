import { useMounted } from "@/hooks/useMounted"
import { useScreenSize } from "@/hooks/useScreenSize"
import type { ShowMode } from "@/interfaces/common.interface"
import type { Dispatch, FC, PropsWithChildren, SetStateAction } from "react"
import { useEffect } from "react"
import CategoriesSidebar from "./categories/categories-sidebar/categories-sidebar"
import FooterDesktop from "./footer/footer-desktop"
import FooterMobile from "./footer/footer-mobile"
import HeaderDesktop from "./header/header-desktop/header-desktop"
import HeaderMobile from "./header/header-mobile"
import Menu from "./menu/menu"
import MenusDesktop from "./menus-desktop"
import NoDishesByFilters from "./no-dishes-by-filters"
import ScrollTop from "./scroll-top"
import YumziBranding from "./yumzi-branding"

interface IHomeLayout {
  show: ShowMode
  setShow: Dispatch<SetStateAction<ShowMode>>
}

const HomeLayout: FC<PropsWithChildren<IHomeLayout>> = ({
  children,
  show,
  setShow
}) => {
  const isMounted = useMounted()
  const { isMobile } = useScreenSize()

  useEffect(() => {
    if (isMobile) {
      setTimeout(() => {
        window?.scrollTo({
          top: !!localStorage.getItem("scroll")
            ? Number(localStorage.getItem("scroll")) || 0
            : 0
        })
      }, 0)
    }
  }, [isMobile])

  if (!isMounted) return null
  return (
    <main>
      {isMobile ? (
        <div className="tablet:hidden">
          <HeaderMobile />
          <div>
            <div className="relative mt-8 min-h-screen pb-20">
              <NoDishesByFilters />
              {children}
            </div>
          </div>
          <FooterMobile />
          <Menu showMode={show} setShowMode={setShow} />
          <ScrollTop />
        </div>
      ) : (
        <div className="hidden tablet:flex">
          <CategoriesSidebar />
          <div
            id="main-window-desktop"
            className="flex-1 !pb-20 tablet:h-screen tablet:overflow-y-auto tablet:p-8 laptop:p-16"
          >
            <HeaderDesktop />
            <div className="relative">{children}</div>
            <FooterDesktop />
          </div>
          <YumziBranding />
          <MenusDesktop />
        </div>
      )}
    </main>
  )
}

export default HomeLayout
