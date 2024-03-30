import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import type { FC, PropsWithChildren } from "react"

const Transitions: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()
  const transition = { duration: 0.3 }

  return (
    <>
      {pathname.match(new RegExp("/*")) ? (
        <AnimatePresence initial={false} mode="sync">
          {!pathname.match(new RegExp("/*/item/*")) ? (
            <motion.div
              key={pathname}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={transition}
              exit={{ x: "-100%" }}
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key={pathname}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              transition={transition}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        children
      )}
    </>
  )
}

export default Transitions
