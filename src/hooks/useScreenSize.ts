import { useWindowSize } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"

const TABLET_WIDTH = 900

export const useScreenSize = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < TABLET_WIDTH
  )
  const size = useWindowSize()

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${TABLET_WIDTH}px)`)

    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches)

    mql.addEventListener("change", handler)

    return () => {
      mql.removeEventListener("change", handler)
    }
  }, [])

  return {
    isMobile,
    ...size
  }
}
