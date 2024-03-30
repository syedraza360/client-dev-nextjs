"use client"

import { cn } from "@/helpers/utils"
import { useVariables } from "@/store/use-variables"
import Image from "next/image"
import { useEffect } from "react"
import { useShallow } from "zustand/react/shallow"

const PRELOADER_DURATION = 2000

const Preloader = () => {
  const [isShow, setIsShow] = useVariables(
    useShallow((state) => [state.isPreloader, state.setIsPreloader])
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsShow(false)
      document.body.style.overflowY = "auto"
    }, PRELOADER_DURATION)

    return () => clearTimeout(timeoutId)
  }, [setIsShow])

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-[10000000] flex h-screen w-screen items-center justify-center bg-[#101828] pb-8 duration-500",
        isShow
          ? "opacity-1 pointer-events-auto"
          : "pointer-events-none opacity-0"
      )}
    >
      <Image src="/icons/logo_light.svg" alt="logo" width={110} height={34} />
      <div className="loader" />
    </div>
  )
}

export default Preloader
