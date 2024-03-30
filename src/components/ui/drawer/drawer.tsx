"use client"

import type { FC, PropsWithChildren } from "react"

import { COLORS } from "@/constants/colors.constants"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import type { SystemStyleObject } from "@mui/system"
import Brand from "../brand"

interface IDrawer {
  isOpen: boolean
  title?: string
  showBrand?: boolean
  contentStyle?: SystemStyleObject
  setIsOpen: (open: boolean) => void
}

const Drawer: FC<PropsWithChildren<IDrawer>> = ({
  children,
  isOpen,
  title,
  showBrand = true,
  contentStyle,
  setIsOpen
}) => {
  return (
    <SwipeableDrawer
      container={
        typeof document !== "undefined" ? () => document.body : undefined
      }
      anchor="bottom"
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      disableSwipeToOpen={true}
      transitionDuration={300}
      ModalProps={{
        keepMounted: true,
        sx: {
          "& .MuiBackdrop-root": {
            backdropFilter: "blur(3px)",
            backgroundColor: COLORS.dark.disabled
          },
          "& .MuiPaper-root": {
            borderTopLeftRadius: "30px",
            borderTopRightRadius: "30px",
            padding: "16px",
            maxHeight: "calc(80vh)",
            ...contentStyle
          }
        }
      }}
    >
      <div className="mx-auto h-1 w-[35px] rounded bg-dark-disabled" />
      {!!title && <div className="mt-4 text-center font-semibold">{title}</div>}
      {children}
      {showBrand && <Brand className="mt-4" />}
    </SwipeableDrawer>
  )
}

export default Drawer
