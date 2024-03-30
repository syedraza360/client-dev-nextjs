import { cn } from "@/helpers/utils"
import { useEffect, useState } from "react"
import { FiChevronUp } from "react-icons/fi"

const ScrollTop = () => {
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 100) {
        setIsShow(true)
      } else if (window.screenY <= 100) {
        setIsShow(false)
      }
    }

    window.addEventListener("scroll", checkScrollTop)
    return () => {
      window.removeEventListener("scroll", checkScrollTop)
    }
  }, [])

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div
      role="button"
      onClick={scrollTop}
      className={cn(
        "fixed bottom-24 left-3 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm duration-300",
        isShow ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <FiChevronUp size={24} />
    </div>
  )
}

export default ScrollTop
