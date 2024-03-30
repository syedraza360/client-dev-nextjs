import Image from "next/image"
import { useRouter } from "next/router"
import { Fragment, useEffect, useState } from "react"
import { BiMinus, BiPlus } from "react-icons/bi"
import { FiArrowLeft } from "react-icons/fi"
import Checkbox from "../../../../components/common/checkbox"
import Menu from "../../../../components/common/menu"
import ItemDetails from "../../../../components/item/details"
import { useI18n } from "../../../../contexts/i18n"
import { useRestaurant } from "../../../../contexts/restarant"
import { fetchDish } from "../../../../helpers/backend"
import { translateFromObject } from "../../../../helpers/utils"

const Item = () => {
  const router = useRouter()
  const { uid, item_uid, tableID } = router.query
  const { allDishes, addToCart, updateCart, getCartItem, dish, setDish } =
    useRestaurant()
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

  const [showNote, setShowNote] = useState(false)

  const [variationSelected, setVariationSelected] = useState({})
  const [extras, setExtras] = useState({})
  const [note, setNote] = useState({})
  const [quantity, setQuantity] = useState({})

  const cartItem = getCartItem(dish?._id)

  useEffect(() => {
    if (!!cartItem && !!dish) {
      setVariationSelected((d) => ({
        ...d,
        [dish._id]: cartItem?.variation
      }))
      setExtras((d) => ({
        ...d,
        [dish._id]: cartItem?.extras
      }))
      setNote((d) => ({
        ...d,
        [dish._id]: cartItem?.note
      }))
      setQuantity((d) => ({
        ...d,
        [dish._id]: cartItem?.quantity
      }))
    }
  }, [cartItem, dish])

  return (
    <>
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
        <div className="no-scrollbar h-screen overflow-y-auto">
          <div className="relative min-h-screen pb-20">
            <ItemDetails dish={dish} />
            {!!dish?.variations?.length && (
              <div>
                <div className="tab-title">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p>{i18n.t("Variations")}</p>
                      <p className="text-10 leading-3 text-gray-600">
                        {i18n.t("Choose 1 out")}
                      </p>
                    </div>
                    <div className="rounded-sm bg-gray-900 px-1.5 py-1 text-xs font-medium text-white">
                      {i18n.t("required")}
                    </div>
                  </div>
                </div>
                <div className="px-5">
                  {dish?.variations?.map((variation, index) => (
                    <div key={index} className="tab-row">
                      <div
                        role="button"
                        onClick={() => {
                          if (!!cartItem) {
                            updateCart(cartItem, {
                              variation:
                                variation._id === variationSelected[dish._id]
                                  ? null
                                  : variation._id
                            })
                          }
                          if (variation._id === variationSelected[dish._id]) {
                            setVariationSelected((d) => ({
                              ...d,
                              [dish._id]: undefined
                            }))
                          } else {
                            setVariationSelected((d) => ({
                              ...d,
                              [dish._id]: variation._id
                            }))
                          }
                        }}
                        className="flex items-center gap-3"
                      >
                        <Checkbox
                          checked={
                            variation._id === variationSelected[dish._id]
                          }
                        />
                        <p>
                          {translateFromObject(
                            variation?.name,
                            i18n.locale,
                            "name"
                          )}
                        </p>
                      </div>
                      {!!variation?.price && (
                        <p>
                          +{variation?.price?.toFixed(2).replace(".", ",")} €
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!!dish?.extras?.length && (
              <div>
                <div className="tab-title">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p>{i18n.t("Do you want extras?")}</p>
                      <p className="text-10 leading-3 text-gray-600">
                        {i18n.t("Multiple selection possible")}
                      </p>
                    </div>
                    <div className="rounded-sm bg-gray-200 px-1.5 py-1 text-xs font-medium text-gray-800">
                      optional
                    </div>
                  </div>
                </div>
                <div className="px-5">
                  {dish?.extras?.map((extra, index) => (
                    <div key={index} className="tab-row">
                      <div
                        role="button"
                        onClick={() => {
                          if (!!cartItem) {
                            updateCart(cartItem, {
                              extras: extras[dish._id]?.includes(extra._id)
                                ? extras[dish._id]?.filter(
                                    (d) => d !== extra._id
                                  )
                                : [...(extras[dish._id] || []), extra._id]
                            })
                          }
                          if (extras[dish._id]?.includes(extra._id)) {
                            setExtras({
                              ...extras,
                              [dish._id]: extras[dish._id]?.filter(
                                (d) => d !== extra._id
                              )
                            })
                          } else {
                            setExtras({
                              ...extras,
                              [dish._id]: [
                                ...(extras[dish._id] || []),
                                extra._id
                              ]
                            })
                          }
                        }}
                        className="flex items-center gap-3"
                      >
                        <Checkbox
                          checked={extras[dish._id]?.includes(extra._id)}
                        />
                        <p>
                          {translateFromObject(
                            extra?.name,
                            i18n.locale,
                            "name"
                          )}
                        </p>
                      </div>
                      {!!extra?.price && (
                        <p>+{extra?.price?.toFixed(2).replace(".", ",")} €</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {[
              { label: "Thirsty?", value: "thirsty" },
              { label: "Appetizers", value: "appetizers" },
              { label: "Add the side dish", value: "sides" },
              { label: "Something sweet?", value: "dessert" }
            ].map((section, index) => {
              if (!dish || !dish[section.value]?.length) {
                return <Fragment key={index} />
              }
              return (
                <div key={index}>
                  <div className="tab-title">
                    <div className="flex items-center justify-between">
                      <p>{i18n.t(section.label)}</p>
                      <div className="rounded-sm bg-gray-200 px-1.5 py-1 text-xs font-medium text-gray-800">
                        optional
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 p-4 sm:px-0">
                    {allDishes
                      ?.filter((d) => dish[section.value]?.includes(d._id))
                      ?.map((dish, index) => {
                        let cartItem = getCartItem(dish?._id)
                        return (
                          <div
                            className={`dish-item ${!!cartItem ? "active" : ""}`}
                            onClick={() => {
                              router.push(
                                `/order/${uid}/item/${dish?.uid}${tableID ? `?tableID=${tableID}` : ""}`
                              )
                            }}
                            key={index}
                          >
                            <div className="flex flex-grow-0 gap-2.5 overflow-hidden">
                              <div
                                className={`relative aspect-square h-[75px] flex-shrink-0 overflow-hidden ${!!cartItem ? "rounded-sm" : ""}`}
                              >
                                <Image
                                  src={dish?.images[0]}
                                  fill
                                  style={{
                                    objectFit: "cover"
                                  }}
                                  placeholder="blur"
                                  blurDataURL="/images/blue.png"
                                  alt=""
                                />
                              </div>
                              <div
                                style={{
                                  width: "calc(100% - 85px)"
                                }}
                                className={`flex flex-grow-0 gap-2 text-gray-900 ${!!cartItem ? "" : "h-[75px] items-center"}`}
                              >
                                <div className="flex flex-col items-start gap-2 overflow-hidden">
                                  <p
                                    className={`w-full truncate text-base ${!!cartItem ? "font-bold" : ""}`}
                                  >
                                    {translateFromObject(
                                      dish?.name,
                                      i18n.locale,
                                      "name"
                                    )}
                                    {!!cartItem?.variation && (
                                      <span className="pl-1 text-10 font-normal text-gray-600">
                                        {translateFromObject(
                                          dish?.variations?.find(
                                            (v) => v._id === cartItem?.variation
                                          )?.name,
                                          i18n.locale,
                                          "name"
                                        )}
                                      </span>
                                    )}
                                  </p>
                                  {!!cartItem?.extras?.length && (
                                    <>
                                      <div
                                        className="text-base
                                                                        font-normal text-gray-600"
                                      >
                                        {cartItem?.extras?.map(
                                          (extra, index) => (
                                            <div key={index}>
                                              1x{" "}
                                              {translateFromObject(
                                                dish?.extras?.find(
                                                  (e) => e._id === extra
                                                )?.name,
                                                i18n.locale,
                                                "name"
                                              )}
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                                  {!!cartItem && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        addToCart(
                                          {
                                            _id: dish?._id
                                          },
                                          -cartItem?.quantity
                                        )
                                      }}
                                      className="mt-2 underline"
                                    >
                                      {i18n.t("remove")}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p
                              className={`flex-shrink-0 ${!!cartItem ? "" : "pe-4"}`}
                            >
                              +{dish?.price?.toFixed(2).replace(".", ",")} €
                            </p>
                          </div>
                        )
                      })}
                  </div>
                </div>
              )
            })}
            <div className="absolute bottom-0 w-full">
              {!!getCartItem(dish?._id) ? (
                <div className="mb-4 mobile:px-4">
                  <button
                    onClick={() => {
                      router.push(
                        `/order/${uid}/cart${tableID ? `?tableID=${tableID}` : ""}`
                      )
                    }}
                    className="btn-primary w-full font-semibold"
                  >
                    <span>{i18n.t("View order")}</span>
                  </button>
                </div>
              ) : (
                <div className="mb-4 flex gap-2 mobile:px-4">
                  <div className="flex w-32 items-center justify-between rounded-sm  border border-gray-900 px-2.5">
                    <BiMinus
                      role="button"
                      onClick={() => {
                        if (quantity[dish?._id] > 1) {
                          setQuantity({
                            ...quantity,
                            [dish?._id]: quantity[dish?._id] - 1
                          })
                        }
                      }}
                    />
                    <p className="text-base font-medium">
                      {quantity[dish?._id] || 1}
                    </p>
                    <BiPlus
                      role="button"
                      onClick={() => {
                        setQuantity({
                          ...quantity,
                          [dish?._id]: (quantity[dish?._id] || 1) + 1
                        })
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      addToCart(
                        {
                          _id: dish?._id,
                          restaurantUid: uid,
                          price: dish?.price,
                          isDiscount: dish?.isDiscount,
                          reducedPrice: dish?.reducedPrice,
                          extras: extras[dish?._id] || [],
                          variation: variationSelected[dish?._id],
                          note: note[dish?._id]
                        },
                        quantity[dish?._id] || 1
                      )
                      router.back()
                    }}
                    className="btn-primary w-full font-semibold"
                  >
                    <span>{i18n.t("Add to order")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          role="button"
          onClick={() => {
            setShowNote(true)
          }}
          className="tab-title"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/pencil.svg"
                alt="notice"
                width={24}
                height={25}
              />
              <p className="font-normal leading-[18px]">
                {i18n.t("Add the order notice")}
              </p>
            </div>
            <Image
              src="/icons/arrow-right.svg"
              alt="arrow"
              width={24}
              height={25}
            />
          </div>
        </div>
      </div>
      <Menu
        show={showNote}
        title={
          <div className="container mobile:px-4">
            <p className="text-left">{i18n.t("Add the order notice")}</p>
          </div>
        }
        closeIcon={false}
        divider={true}
        onCancel={() => setShowNote(false)}
      >
        <textarea
          rows={2}
          value={note[dish?._id] || ""}
          onChange={(e) => {
            setNote({
              ...note,
              [dish?._id]: e.target.value || undefined
            })
          }}
          placeholder={i18n.t(
            "Here you have the possibility of having an order notice ..."
          )}
          className="my-4 w-full rounded-sm border border-gray-200 p-2.5 focus:outline-0"
        />

        <div className="mt-1 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (!!cartItem) {
                updateCart(cartItem, {
                  note: note[dish._id]
                })
              }
              setNote({
                ...note,
                [dish?._id]: undefined
              })
              setShowNote(false)
            }}
            className="btn-secondary"
          >
            {i18n.t("cancel")}
          </button>
          <button
            onClick={() => {
              if (!!cartItem) {
                updateCart(cartItem, {
                  note: note[dish._id]
                })
              }
              setShowNote(false)
            }}
            className="btn-primary"
          >
            {i18n.t("Add")}
          </button>
        </div>
      </Menu>
    </>
  )
}
export default Item
