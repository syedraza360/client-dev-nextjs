import type { Moment } from "moment"

declare global {
  interface Window {
    autoScroll?: Moment
    lastScroll?: number
  }
}
