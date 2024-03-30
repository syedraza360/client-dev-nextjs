import { cn } from "@/helpers/utils"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { createPortal } from "react-dom"
import { FiX } from "react-icons/fi"

interface IMenu {
  show: boolean
  onCancel: () => void
  title: ReactNode
  closeIcon?: boolean
  divider?: boolean
}

const Menu: FC<PropsWithChildren<IMenu>> = ({
  show,
  onCancel,
  title,
  children,
  closeIcon = true,
  divider
}) => {
  return (
    <>
      {createPortal(
        <>
          <div
            onClick={onCancel}
            className={cn("menu-mask", show ? "show" : "")}
          />
          <div className={cn("menu", show ? "show" : "")}>
            <div
              className={cn(
                "title container mobile:px-4",
                divider ? "border-b" : ""
              )}
            >
              {title}
              {closeIcon && (
                <FiX
                  role="button"
                  onClick={onCancel}
                  className="absolute end-0 top-1/2 -translate-y-1/2 transform mobile:end-4"
                  size={22}
                />
              )}
            </div>
            <div className="container mobile:px-4">{children}</div>
          </div>
        </>,
        document.body
      )}
    </>
  )
}

export default Menu
