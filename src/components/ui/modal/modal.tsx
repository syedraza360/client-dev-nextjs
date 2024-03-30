"use client"

import { cn } from "@/helpers/utils"
import { useOutside } from "@/hooks/useOutside"
import { useRef, type FC, type PropsWithChildren } from "react"
import { createPortal } from "react-dom"

interface IModal {
  isOpen: boolean
  duration?: number
  className?: string
  isOutsideClose?: boolean
  closeDialog: () => void
}

const Modal: FC<PropsWithChildren<IModal>> = ({
  children,
  isOutsideClose = true,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  useOutside(modalRef, isOutsideClose ? props.closeDialog : () => {})

  return createPortal(
    <div
      className={cn(
        "fixed left-0 top-0 z-[1000] flex h-full w-full items-center justify-center bg-[rgba(16,24,40,0.70)] backdrop-blur-[10px]",
        props.isOpen ? "opacity-1" : "pointer-events-none opacity-0"
      )}
      style={{ transition: `opacity ${props.duration ?? 300}ms` }}
    >
      <div
        ref={modalRef}
        className={cn(
          "relative min-h-[200px] w-3/4 rounded-2xl bg-white shadow-lg xl:w-1/2",
          props.className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
