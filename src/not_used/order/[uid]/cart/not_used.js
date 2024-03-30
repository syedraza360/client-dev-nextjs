import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import { FiPlus } from "react-icons/fi"
import { PiMinusCircleLight, PiPlusCircleLight } from "react-icons/pi"
import Menu from "../../../../components/common/menu"
import PageTitle from "../../../../components/page/title"
import { useI18n } from "../../../../contexts/i18n"
import { useRestaurant } from "../../../../contexts/restarant"
import { translateFromObject } from "../../../../helpers/utils"

const Cart = () => {
  const i18n = useI18n()
  const { query, push } = useRouter()
  const {
    cart,
    addToCart,
    allDishes: dishes,
    order,
    updateOrder
  } = useRestaurant()

  const [showTip, setShowTip] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [remove, setRemove] = useState(null)

  let subtotal = cart?.reduce((a, b) => a + (b?.price || 0) * b?.quantity, 0)
  let discount = cart?.reduce(
    (a, b) =>
      a +
      (b?.isDiscount ? (b?.price || 0) - (b?.reducedPrice || 0) : 0) *
        b?.quantity,
    0
  )
  let total = subtotal - discount

  const calculateTip = (tip) => {
    return (total * tip) / 100
  }

  return (
    <div className="h-screen overflow-hidden">
      <PageTitle title="Order" back />
      <div
        className="no-scrollbar container flex flex-col justify-between overflow-y-auto text-gray-900"
        style={{ height: "calc(100svh - 60px)" }}
      >
        <div>
          <div className="flex items-center justify-between border border-gray-200 p-4">
            <p className="text-base font-semibold">{i18n.t("Table number")}</p>
            {query?.tableID && (
              <div className="rounded-sm border border-gray-200 px-3.5 py-2 text-xs font-medium">
                {i18n.t("Table")} {query?.tableID}
              </div>
            )}
          </div>
          <div>
            {cart?.map((item, index) => {
              let dish = dishes?.find((d) => d._id === item?._id)
              return (
                <Fragment key={index}>
                  {dish && (
                    <div className="flex items-start justify-between gap-1 p-4">
                      <div className="flex flex-shrink gap-4 overflow-hidden">
                        <div className="relative aspect-square h-[75px] flex-shrink-0 overflow-hidden rounded-sm">
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
                        <div className="flex flex-shrink flex-col gap-2 overflow-hidden">
                          <p className="truncate text-base font-semibold">
                            {translateFromObject(
                              dish?.name,
                              i18n.locale,
                              "name"
                            )}
                            {!!item?.variation && (
                              <span className="pl-1 text-10 font-normal text-gray-600">
                                {translateFromObject(
                                  dish?.variations?.find(
                                    (v) => v._id === item?.variation
                                  )?.name,
                                  i18n.locale,
                                  "name"
                                )}
                              </span>
                            )}
                          </p>
                          {!!item?.extras?.length && (
                            <>
                              <div className="mt-0.5 text-base font-normal text-gray-600">
                                {item?.extras?.map((extra, index) => (
                                  <div key={index}>
                                    1x{" "}
                                    {translateFromObject(
                                      dish?.extras?.find((e) => e._id === extra)
                                        ?.name,
                                      i18n.locale,
                                      "name"
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                          <div>
                            {item?.isDiscount ? (
                              <div className="flex flex-col gap-0.5">
                                <p className="font-semibold text-gray-600 line-through">
                                  € {item.price?.toFixed(2).replace(".", ",")}
                                </p>
                                <p className="font-semibold text-[#E72D34]">
                                  €{" "}
                                  {item.reducedPrice
                                    ?.toFixed(2)
                                    .replace(".", ",")}
                                </p>
                              </div>
                            ) : (
                              <p className="font-semibold">
                                € {item.price?.toFixed(2).replace(".", ",")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PiMinusCircleLight
                          size={20}
                          onClick={() => {
                            if (item?.quantity === 1) {
                              setRemove(item)
                              return
                            }
                            addToCart(item, -1)
                          }}
                        />
                        <span>{item?.quantity}</span>
                        <PiPlusCircleLight
                          size={20}
                          onClick={() => {
                            addToCart(item, 1)
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Fragment>
              )
            })}
          </div>
          <div className="mb-4 flex justify-end mobile:px-4">
            <Link
              href={`/order/${query.uid}`}
              className="flex items-center gap-1 rounded-sm border border-gray-200 bg-gray-50 px-3.5 py-2"
            >
              <FiPlus /> {i18n.t("add article")}
            </Link>
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
        <div>
          <div className="border-b border-gray-200 py-4 mobile:px-4">
            <p className="mb-2 text-sm font-medium">
              {i18n.t("Supported payment methods")}
            </p>
            <div className="flex gap-2">
              {[
                "apple_pay",
                "gpay",
                "visa",
                "mastercard",
                "maestro",
                "dinners_club",
                "amex"
              ]?.map((item, index) => (
                <Image
                  key={index}
                  src={`/icons/${item}.svg`}
                  alt={item}
                  width={34}
                  height={24}
                />
              ))}
            </div>
          </div>
          <div className="py-4 mobile:px-4">
            <table className="w-full text-base">
              <tbody>
                <tr>
                  <td>{i18n.t("Subtotal")}</td>
                  <td className="text-right">
                    € {subtotal?.toFixed(2).replace(".", ",")}
                  </td>
                </tr>
                {!!discount && (
                  <tr>
                    <td>{i18n.t("Discount")}</td>
                    <td className="text-right text-[#E72D34]">
                      -€ {discount?.toFixed(2).replace(".", ",")}
                    </td>
                  </tr>
                )}
                <tr className="font-semibold">
                  <td className="py-4">{i18n.t("In total")}</td>
                  <td className="py-4 text-right">
                    € {total?.toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => setShowTip(true)}
              className="btn-primary mb-2 w-full"
            >
              {i18n.t("Further")}
            </button>
            <p className="text-center text-sm">
              Durchs auf “Weiter” klicken stimmst du unseren AGBs und
              Datenschutzbestimmungen zu.
            </p>
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
          value={order?.note}
          onChange={(e) => {
            updateOrder({
              note: e.target.value
            })
          }}
          placeholder={i18n.t(
            "Here you have the possibility of having an order notice ..."
          )}
          className=" my-4 w-full rounded-sm border border-gray-200 p-2.5 placeholder:text-base placeholder:font-normal focus:outline-0"
        />

        <div className="mt-1 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              updateOrder({
                note: ""
              })
              setShowNote(false)
            }}
            className="btn-secondary"
          >
            {i18n.t("cancel")}
          </button>
          <button
            onClick={() => {
              setShowNote(false)
            }}
            className="btn-primary"
          >
            {i18n.t("Add")}
          </button>
        </div>
      </Menu>

      <Menu
        show={!!remove}
        title={
          <div className="container">
            <p className="text-left text-xl font-semibold text-gray-900">
              {i18n.t("Remove Article?")}
            </p>
          </div>
        }
        closeIcon={false}
        divider={true}
        onCancel={() => setRemove(null)}
      >
        <p className="py-4">
          {i18n
            .t("Are you sure you want to remove *x *** from your order?")
            ?.replace("*", "1")
            ?.replace(
              "***",
              translateFromObject(
                dishes?.find((d) => d._id === remove?._id)?.name,
                i18n.locale,
                "name"
              )
            )}
        </p>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setRemove(null)
            }}
            className="btn-secondary"
          >
            {i18n.t("cancel")}
          </button>
          <button
            onClick={() => {
              addToCart(remove, -remove?.quantity)
              setRemove(null)
            }}
            className="btn-primary"
          >
            {i18n.t("Remove")}
          </button>
        </div>
      </Menu>
      <Menu
        show={showTip}
        title={
          <div className="container">
            <p className="text-left text-base font-semibold text-gray-900">
              {i18n.t("Thank you with a tip ❤️")}
            </p>
          </div>
        }
        closeIcon={false}
        onCancel={() => setShowTip(false)}
      >
        <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4">
          {[5, 10, 15, 20, 25, 30]?.map((item, index) => (
            <div
              key={index}
              role="button"
              style={{ width: 100 }}
              className={`flex flex-shrink-0 flex-col items-center gap-1 rounded-sm border border-gray-200 px-3.5 py-3 ${order?.tip === item ? "bg-gray-900 text-white" : ""}`}
              onClick={() => {
                updateOrder({
                  tip: item
                })
              }}
            >
              <p className="text-center text-xl font-semibold">{item}%</p>
              <p className="whitespace-nowrap text-center text-xs">
                € {calculateTip(item)?.toFixed(2).replace(".", ",")}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-2.5 grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              updateOrder({
                tip: 0
              })
              setShowTip(false)
              push(
                `/order/${query.uid}/payment${query?.tableID ? `?tableID=${query.tableID}` : ""}`
              )
            }}
            className="btn-secondary"
          >
            {i18n.t("Maybe next time")}
          </button>
          <button
            onClick={() => {
              setShowTip(false)
              push(
                `/order/${query.uid}/payment${query?.tableID ? `?tableID=${query.tableID}` : ""}`
              )
            }}
            className="btn-primary"
          >
            {i18n.t("Add and pay tips")}
          </button>
        </div>
      </Menu>
    </div>
  )
}

export default Cart
