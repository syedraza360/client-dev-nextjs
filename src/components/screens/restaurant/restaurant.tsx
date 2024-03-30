"use client"

import { ShowMode } from "@/interfaces/common.interface"
import { useState, type FC } from "react"
import Dishes from "./dishes/dishes"
import HomeLayout from "./layout/layout"

const Restaurant: FC = () => {
  const [show, setShow] = useState<ShowMode>(ShowMode.GRID)

  return (
    <HomeLayout show={show} setShow={setShow}>
      <Dishes show={show} />
    </HomeLayout>
  )
}

export default Restaurant
