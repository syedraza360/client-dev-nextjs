import { useI18n } from "@/components/providers/i18n"
import DishLabels from "@/components/ui/dish-labels/dish-labels"
import Drawer from "@/components/ui/drawer/drawer"
import Modal from "@/components/ui/modal/modal"
import { sortStringByAlphabet } from "@/helpers/sort-string-by-alphabet"
import { cn, getTranslations, translateFromObject } from "@/helpers/utils"
import { useMounted } from "@/hooks/useMounted"
import { useScreenSize } from "@/hooks/useScreenSize"
import type { ICategory, ISubCategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import type { IRestaurant } from "@/interfaces/restaurant.interface"
import Image from "next/image"
import { useParams } from "next/navigation"
import type { PropsWithChildren } from "react"
import {
  Fragment,
  useState,
  type Dispatch,
  type FC,
  type MouseEventHandler,
  type SetStateAction
} from "react"
import { FaCircleCheck } from "react-icons/fa6"
import { useFindCategory } from "../useFindCategory"
import ItemCharacteristics from "./item-characteristics"

interface IItemAbout {
  restaurant: IRestaurant
  dish: IDish
  categories: ICategory[]
  isShowInfo?: boolean
  isShowDescription?: boolean
  isShowAllergens?: boolean
  setIsShowInfo?: Dispatch<SetStateAction<boolean>>
  setIsShowDescription?: Dispatch<SetStateAction<boolean>>
  setIsShowAllergens?: Dispatch<SetStateAction<boolean>>
}

const ItemAbout: FC<IItemAbout> = ({
  restaurant,
  dish,
  categories,
  isShowInfo,
  isShowDescription,
  isShowAllergens,
  setIsShowInfo,
  setIsShowDescription,
  setIsShowAllergens
}) => {
  const isMounted = useMounted()

  const i18n = useI18n()

  const isNutritionalInfo =
    !!dish?.calories || !!dish?.fats || !!dish?.carbohydrate || !!dish?.protein

  const description = i18n.find(dish?.description)?.description || ""

  const splitDescription: string[] =
    description.length > 100
      ? description.substring(0, 150).split("\r\n")
      : description.split("\r\n")
  const splitDescriptionFull: string[] = description.split("\r\n")

  const noImages = dish?.images?.length === 0

  return (
    <div className="flex flex-col items-start bg-white px-3 pb-4 pt-[18px] tablet:w-full tablet:min-w-0 tablet:border-b tablet:border-b-gray-100 tablet:p-8">
      <SubCategoryAndCopyLink dish={dish} categories={categories} />
      <p className="mt-1 text-xl font-semibold tablet:text-[32px]">
        {restaurant.settings.isAutoTranslate
          ? i18n.find(dish.name)?.name
          : dish?.nameOrigin}
      </p>
      <DishLabels dish={dish} className="mb-4 mt-1 tablet:mt-2" />
      <div className="mt-2 hidden tablet:block">
        {dish?.description.filter((desc) => desc).length !== 0 && (
          <p className="text-sm font-light text-dark-foreground tablet:text-lg">
            {splitDescription?.slice(0, 3).map((text, index, array) => (
              <Fragment key={index}>
                {text}
                {index !== array.length - 1 && <br />}
              </Fragment>
            ))}
            {(description.length > 150 || splitDescription.length > 3) && (
              <>
                {" ... "}
                <button
                  className="inline lowercase underline"
                  onClick={() =>
                    setIsShowDescription && setIsShowDescription(true)
                  }
                >
                  {i18n.t("Show more")}
                </button>
              </>
            )}
          </p>
        )}
        {isMounted && description && (
          <SubModal
            dish={dish}
            isShow={isShowDescription}
            setIsShow={setIsShowDescription}
          >
            <p className="p-8 text-sm font-light text-gray-700 tablet:text-lg">
              {splitDescriptionFull?.map((text, index, array) => (
                <Fragment key={index}>
                  {text}
                  {index !== array.length - 1 && <br />}
                </Fragment>
              ))}
            </p>
          </SubModal>
        )}
      </div>
      <p className="mt-2 block text-sm font-light text-gray-700 tablet:hidden tablet:text-lg">
        {splitDescriptionFull.map((text, index, array) => (
          <Fragment key={index}>
            {text}
            {index !== array.length - 1 && <br />}
          </Fragment>
        ))}
      </p>
      {/* On desktop */}
      {!!dish?.short_allergens && (
        <button
          className="mt-4 hidden rounded-5 bg-dark-bg2 px-2.5 py-[7.5px] text-xs font-medium tablet:block"
          onClick={() => setIsShowAllergens && setIsShowAllergens(true)}
        >
          {sortStringByAlphabet(dish?.short_allergens)}
        </button>
      )}
      <div
        className={cn(
          "mt-4 flex w-full items-center justify-between",
          noImages ? "tablet:mt-[34px]" : "tablet:mt-auto"
        )}
      >
        <ItemPrice
          dish={dish}
          currency={restaurant.settings.currency.symbol}
          showPrice={restaurant.settings.showPrice}
          showCurrency={restaurant.settings.showCurrency}
        />
        {isMounted && isNutritionalInfo && (
          <button
            className="hidden items-center gap-2 tablet:flex"
            onClick={() => setIsShowInfo && setIsShowInfo(true)}
          >
            <SubModal dish={dish} isShow={isShowInfo} setIsShow={setIsShowInfo}>
              <ItemCharacteristics dish={dish} />
            </SubModal>
            <Image
              src="/icons/info-circle.svg"
              alt="info"
              width={24}
              height={24}
            />
            <span className="dashed-border text-lg font-light">
              {i18n.t("Nutritional information")}
            </span>
          </button>
        )}

        {/* On mobile */}
        {!!dish?.short_allergens && (
          <button
            className="rounded-5 bg-dark-bg2 px-2.5 py-[7.5px] text-xs font-medium tablet:hidden"
            onClick={() => setIsShowAllergens && setIsShowAllergens(true)}
          >
            {sortStringByAlphabet(dish?.short_allergens)}
          </button>
        )}
      </div>
      {isMounted && (
        <AllergensDescription
          dish={dish}
          isOpen={!!isShowAllergens}
          setIsOpen={(value) => setIsShowAllergens && setIsShowAllergens(value)}
        />
      )}
    </div>
  )
}

interface IPrice {
  dish: IDish
  currency: string
  showCurrency: boolean
  showPrice: boolean
}

export const ItemPrice: FC<IPrice> = ({
  dish,
  currency,
  showPrice,
  showCurrency
}) => {
  const price = dish.price?.toString().includes("-")
    ? dish.price
    : Number(dish.price).toFixed(2).replace(".", ",")
  const reducedPrice = Number(dish?.reducedPrice).toFixed(2).replace(".", ",")

  if (!showPrice || !dish.price) return null
  return (
    <p className="flex flex-wrap gap-2 text-sm font-semibold tablet:text-lg">
      {dish?.isDiscount ? (
        <>
          <span className="text-red">
            {showCurrency && currency} {reducedPrice}
          </span>
          <span className="text-[#9B9B9B] line-through">
            {showCurrency && currency} {price}
          </span>
        </>
      ) : (
        <span>
          {showCurrency && currency} {price}
        </span>
      )}
    </p>
  )
}

interface ISubCategoryAndCopyLink {
  dish: IDish
  categories: ICategory[]
}

const SubCategoryAndCopyLink: FC<ISubCategoryAndCopyLink> = ({
  dish,
  categories
}) => {
  const { category } = useFindCategory(dish, categories)

  const i18n = useI18n()

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium uppercase text-dark-foreground tablet:text-sm">
        {translateFromObject(
          (category as ICategory)?.title || (category as ISubCategory)?.item,
          i18n.locale,
          (category as ICategory)?.title ? "title" : "subCategory"
        )}
      </p>
      <CopyLinkButton dish={dish} />
    </div>
  )
}

interface ISubModal {
  dish: IDish
  isShow?: boolean
  setIsShow?: Dispatch<SetStateAction<boolean>>
}

const SubModal: FC<PropsWithChildren<ISubModal>> = ({
  children,
  dish,
  isShow,
  setIsShow
}) => {
  const i18n = useI18n()

  const goBack: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    setIsShow && setIsShow(false)
  }

  return (
    <Modal
      key={dish?.uid}
      className="!w-[824px] overflow-hidden"
      isOpen={!!isShow}
      closeDialog={() => setIsShow && setIsShow(false)}
    >
      <div className="flex items-center justify-between gap-4 border-b border-b-gray-100 bg-white p-8">
        <button onClick={goBack} className="h-full">
          <Image
            src="/icons/arrow-left.svg"
            alt="share"
            width={24}
            height={24}
          />
        </button>
        <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold">
          {translateFromObject(dish?.name, i18n.locale, "name")}
        </h1>
        <CopyLinkButton dish={dish} />
      </div>
      {children}
    </Modal>
  )
}

interface ICopyLinkButton {
  dish: IDish
}

const CopyLinkButton: FC<ICopyLinkButton> = ({ dish }) => {
  const { slug } = useParams()

  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/${slug}/${dish?.uid}`
    )
    setIsLinkCopied(true)
    setTimeout(() => {
      setIsLinkCopied(false)
    }, 10000)
  }

  return (
    <button
      className="relative hidden h-9 w-9 items-center justify-center rounded duration-300 hover:bg-gray-100 tablet:flex"
      onClick={copyLink}
    >
      <FaCircleCheck
        size={20}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 duration-150",
          isLinkCopied ? "opacity-100" : "pointer-events-auto opacity-0"
        )}
        color="#00D789"
      />
      <Image
        src="/icons/copy-link.svg"
        alt="link"
        width={24}
        height={24}
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 duration-150",
          isLinkCopied ? "pointer-events-auto opacity-0" : "opacity-100"
        )}
      />
    </button>
  )
}

interface IAllergensDescription {
  dish: IDish
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const AllergensDescription: FC<IAllergensDescription> = ({
  isOpen,
  setIsOpen,
  dish
}) => {
  const { isMobile } = useScreenSize()

  const i18n = useI18n()

  return isMobile ? (
    <Drawer
      isOpen={isOpen}
      title={i18n.t("Allergen labeling")}
      setIsOpen={setIsOpen}
    >
      <div className="mb-4 mt-10">
        <Allergens shortAllergens={dish.short_allergens} />
      </div>
    </Drawer>
  ) : (
    <SubModal dish={dish} isShow={isOpen} setIsShow={setIsOpen}>
      <div className="p-8">
        <div className="mb-4 font-semibold">{i18n.t("Allergen labeling")}</div>
        <Allergens shortAllergens={dish.short_allergens} />
      </div>
    </SubModal>
  )
}

interface IAllergens {
  shortAllergens: string
}

const Allergens: FC<IAllergens> = ({ shortAllergens }) => {
  const i18n = useI18n()
  const allergens = getTranslations().allergens

  return (
    <ul className="flex flex-col">
      {shortAllergens
        ?.split("")
        .sort()
        .map((allergen) => {
          const allergenItem = allergens.find(
            (item) => item.shortForm === allergen
          )

          return (
            <li
              key={allergen}
              className="flex items-center border-b border-b-gray-200 py-4 text-sm tablet:text-lg"
            >
              <span className="w-10 font-medium tablet:w-[60px] tablet:font-light">
                {allergenItem?.shortForm}
              </span>
              <p className="font-light">
                {i18n.from(allergenItem!.description)}
              </p>
            </li>
          )
        })}
    </ul>
  )
}

export default ItemAbout
