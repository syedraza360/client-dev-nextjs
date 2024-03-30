import { useRouter } from "next/router"
import { FiArrowLeft, FiChevronLeft } from "react-icons/fi"
import { useI18n } from "../../../../contexts/i18n"
import { useEffect } from "react"
import { fetchDish } from "../../../../helpers/backend"
import { useRestaurant } from "../../../../contexts/restarant"
import ItemDetails from "../../../../components/item/details"

const Item = () => {
  const router = useRouter()
  const { item_uid } = router.query
  const { dish, setDish } = useRestaurant()

  useEffect(() => {
    if (!!item_uid && !dish) {
      fetchDish({ uid: item_uid }).then(({ error, data }) => {
        if (error === false && data?.dishes?.length > 0) {
          setDish(data?.dishes[0])
        }
      })
    }
  }, [item_uid])

  const i18n = useI18n()

  return (
    <div
      className="container relative h-screen overflow-hidden"
      id="main-container"
    >
      <div
        role="button"
        onClick={() => router.back()}
        className="absolute left-5 top-3 z-10 rounded-full bg-[#28282899] p-3 shadow-sm"
      >
        <FiArrowLeft size={20} className="text-white" />
      </div>
      <div className="no-scrollbar relative h-screen overflow-y-auto pb-20">
        <ItemDetails dish={dish} />
      </div>
      <div className="absolute bottom-0 w-full bg-white py-4 mobile:px-4">
        <button
          onClick={() => {
            router.back()
          }}
          className="btn-primary flex w-full items-center justify-center gap-2 font-semibold"
        >
          <FiChevronLeft size={20} className="text-white" />
          <span>{i18n.t("Back to overview")}</span>
        </button>
      </div>
    </div>
  )
}
export default Item
