import type { RefObject } from "react"
import { useEffect } from "react"

export const useOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current
      if (!el || el.contains(event.target as Node)) {
        return
      }

      handler(event)
    }
    document.addEventListener("mousedown", listener)
    document.addEventListener("touchmove", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchmove", listener)
    }
  }, [ref, handler])
}
