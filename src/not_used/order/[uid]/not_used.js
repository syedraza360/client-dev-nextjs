import { useState } from "react"
import Footer from "../../../components/common/footer"
import HomeLayout from "../../../components/home/layout"
import Dishes from "../../../components/home/dishes"

const Restaurant = () => {
  const [show, setShow] = useState("grid")

  return (
    <HomeLayout show={show} setShow={setShow}>
      <Dishes show={show} />
      <Footer />
    </HomeLayout>
  )
}
export default Restaurant
