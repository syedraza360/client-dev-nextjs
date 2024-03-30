import type { ShowMode } from "@/interfaces/common.interface"
import type { Dispatch, SetStateAction } from "react"

export interface IHeader {
  show: ShowMode
  setShow: Dispatch<SetStateAction<ShowMode>>
}
