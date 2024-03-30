import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Modal from "@/components/ui/modal/modal"
import { formUrlQuery } from "@/helpers/query-params"
import { cn } from "@/helpers/utils"
import { useScreenSize } from "@/hooks/useScreenSize"
import { useRouter } from "next/navigation"
import type { Dispatch, SetStateAction } from "react"
import { useState, type FC } from "react"
import ItemAbout from "../components/item-about"
import { DetailsImages } from "../components/item-details"
import ItemRecommendations from "../components/item-recommendations"
import ItemSeo from "../components/item-seo"
import ItemSimilarDishes from "../components/item-similar-dishes"

interface IItemModal {
  productId: string
}

const ItemModal: FC<IItemModal> = ({ productId }) => {
  const { push } = useRouter()
  const [isShowInfo, setIsShowInfo] = useState(false)
  const [isShowDescription, setIsShowDescription] = useState(false)
  const [isShowAllergens, setIsShowAllergens] = useState(false)

  const { isMobile } = useScreenSize()
  const { dish, restaurant, categories, allDishes, setDish } = useRestaurant()

  const onShowMore = () => {
    setIsShowInfo(false)
    setDish(null)
  }

  const closeDialog = () => {
    setIsShowInfo(false)
    setDish(null)

    const newUrl = formUrlQuery({
      params: new URL(window.location.href).searchParams.toString(),
      keysToRemove: ["dishId"]
    })
    push(newUrl)
  }

  if (!dish || dish.uid !== productId || isMobile) return null
  return (
    <Modal
      className="no-scrollbar my-[87px] h-[calc(100%-174px)] !w-[824px] overflow-y-auto"
      isOpen={
        !!dish &&
        dish.uid === productId &&
        !isShowInfo &&
        !isShowDescription &&
        !isShowAllergens
      }
      isOutsideClose={!isShowInfo && !isShowDescription && !isShowAllergens}
      closeDialog={closeDialog}
    >
      <ItemSeo dish={dish} restaurant={restaurant!} />
      <ItemModalHeader
        isShowInfo={isShowInfo}
        isShowDescription={isShowDescription}
        isShowAllergens={isShowAllergens}
        setIsShowInfo={setIsShowInfo}
        setIsShowDescription={setIsShowDescription}
        setIsShowAllergens={setIsShowAllergens}
      />
      <div className="p-8">
        <ItemRecommendations
          type="modal"
          dish={dish}
          allDishes={allDishes}
          categories={categories}
          restaurantSettings={restaurant!.settings}
        />
        <ItemSimilarDishes
          type="modal"
          dish={dish}
          allDishes={allDishes}
          categories={categories}
          restaurantSettings={restaurant!.settings}
          onShowMore={onShowMore}
        />
      </div>
    </Modal>
  )
}

interface IItemModalHeader {
  isShowInfo: boolean
  isShowDescription: boolean
  isShowAllergens: boolean
  setIsShowInfo: Dispatch<SetStateAction<boolean>>
  setIsShowDescription: Dispatch<SetStateAction<boolean>>
  setIsShowAllergens: Dispatch<SetStateAction<boolean>>
}

const ItemModalHeader: FC<IItemModalHeader> = ({
  isShowInfo,
  isShowDescription,
  isShowAllergens,
  setIsShowInfo,
  setIsShowDescription,
  setIsShowAllergens
}) => {
  const { dish, categories, restaurant } = useRestaurant()

  const noImages = dish?.images?.length === 0

  return (
    <div className={cn(noImages ? "" : "flex")}>
      {!noImages && (
        <div className="relative h-[381.553px] w-[300px]">
          <DetailsImages isDish={!!dish} images={dish?.images || []} />
        </div>
      )}
      <ItemAbout
        restaurant={restaurant!}
        dish={dish!}
        categories={categories}
        isShowInfo={isShowInfo}
        isShowDescription={isShowDescription}
        isShowAllergens={isShowAllergens}
        setIsShowInfo={setIsShowInfo}
        setIsShowDescription={setIsShowDescription}
        setIsShowAllergens={setIsShowAllergens}
      />
    </div>
  )
}

export default ItemModal
