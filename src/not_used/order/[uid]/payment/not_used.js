import PageTitle from "../../../../components/page/title"
import { useI18n } from "../../../../contexts/i18n"
import Checkbox from "../../../../components/common/checkbox"
import { useState } from "react"
import { useRestaurant } from "../../../../contexts/restarant"
import { useRouter } from "next/router"
import { message } from "antd"
import { postOrder } from "../../../../helpers/backend"
import Menu from "../../../../components/common/menu"

const Payment = () => {
  const i18n = useI18n()
  const { query, push } = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const [register, setRegister] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [method, setMethod] = useState("apple_pay")

  const [loading, setLoading] = useState(false)

  const {
    cart,
    order,
    updateOrder,
    allDishes: dishes,
    clearCart
  } = useRestaurant()

  let subtotal = cart?.reduce((a, b) => a + (b?.price || 0) * b?.quantity, 0)
  let discount = cart?.reduce(
    (a, b) =>
      a +
      (b?.isDiscount ? (b?.price || 0) - (b?.reducedPrice || 0) : 0) *
        b?.quantity,
    0
  )
  let tips = (order?.tip / 100) * (subtotal - discount)
  let total = subtotal + tips - discount

  const handleOrder = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
    let data = {
      restaurantUid: query?.uid,
      tableUid: query?.tableID,
      orderType: !!query?.tableID ? "TABLE_ORDER" : "TO_GO_ORDER",
      orderedDishes: cart?.map((d) => {
        let item = dishes?.find((i) => i?._id === d?._id)
        console.log(item)
        return {
          dishUid: item?.uid,
          quantity: d?.quantity,
          price: item?.price,
          isDiscount: item?.isDiscount,
          reducedPrice: item?.reducedPrice,
          extras: d.extras,
          variation: d?.variation,
          note: d?.note
        }
      }),
      subtotal,
      discount,
      tips,
      total,
      note: order?.note,
      card: {
        name: order?.card_name,
        number: order?.card_number,
        expiry: order?.card_expire,
        cvc: order?.card_cvc
      },
      user: {
        name: order?.name,
        email: order?.email
      }
    }
    let { error, msg } = await postOrder(data)
    if (error === false) {
      clearCart()
      push(
        `/order/${query?.uid}/success${query?.tableID ? `?tableID=${query.tableID}` : ""}`
      )
    } else {
      messageApi.open({
        type: "error",
        content: msg
      })
    }
  }

  return (
    <div className="h-screen overflow-hidden">
      {typeof window !== "undefined" && contextHolder}
      <PageTitle title="Order" back />
      <div
        className="no-scrollbar container flex flex-col justify-between overflow-y-auto text-gray-900"
        style={{ height: "calc(100svh - 60px)" }}
      >
        <div className="py-4 mobile:px-4">
          <p className="mb-2 font-bold">{i18n.t("your data")}</p>
          <p className="mb-4 text-xs">
            {i18n.t("Do you need an invoice? Please enter your email below")}
          </p>
          <div className="flex flex-col gap-4">
            <input
              value={order?.name}
              onChange={(e) => updateOrder({ name: e.target.value })}
              className="form-control"
              placeholder={i18n.t("Name")}
            />
            <input
              value={order?.email}
              onChange={(e) => updateOrder({ email: e.target.value })}
              className="form-control"
              placeholder={i18n.t("e-mail")}
            />
            <div className="mb-4 flex items-start gap-2">
              <Checkbox
                checked={register}
                onClick={() => setRegister(!register)}
              />
              <span className="-mt-[1px] text-sm">
                {i18n.t("Register and be notified of news")}
              </span>
            </div>
          </div>
          <p className="font-bold">{i18n.t("Select your payment method")}</p>
          <div className="my-4 flex flex-col gap-2">
            {[
              { label: "Apple Pay", value: "apple_pay" },
              { label: "Credit/debit card", value: "mastercard" }
            ]?.map((d, index) => (
              <div
                key={index}
                role="button"
                onClick={() => {
                  if (d.value === "mastercard") {
                    setShowCard(true)
                  }
                  setMethod(d.value)
                }}
                className={`relative rounded-sm border p-3 ${method === d?.value ? "border-pressed" : "border-gray-200"}`}
              >
                <div className="flex items-center gap-2">
                  <img src={`/icons/${d.value}.png`} className="h-8" alt="" />
                  <p className="">{i18n.t(d.label)}</p>
                </div>
                <div className="absolute end-4 top-1/2 -translate-y-1/2 transform">
                  <Checkbox checked={d.value === method} />
                </div>
              </div>
            ))}
            <p className="text-sm">
              {i18n.t("This appears on your account statement: Yumzi")}
            </p>
          </div>
        </div>
        <div className="py-4 mobile:px-4">
          <table className="mb-4 w-full">
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
              <tr>
                <td>{i18n.t("Tip")}</td>
                <td className="text-right">
                  € {tips?.toFixed(2).replace(".", ",")}
                </td>
              </tr>
              <tr className="font-bold">
                <td className="py-4">{i18n.t("In total")}</td>
                <td className="py-4 text-right">
                  € {total?.toFixed(2).replace(".", ",")}
                </td>
              </tr>
            </tbody>
          </table>
          <button
            onClick={handleOrder}
            className="btn-primary w-full"
            disabled={loading}
          >
            {i18n.t("Pay")}
          </button>
        </div>
      </div>

      <Menu
        show={showCard}
        title={
          <div className="container">
            <p className="text-left text-base font-semibold text-gray-900">
              {i18n.t("Add credit/debit card")}
            </p>
          </div>
        }
        closeIcon={false}
        divider={true}
        onCancel={() => setShowCard(false)}
      >
        <div className="grid grid-cols-2 gap-2.5 py-4">
          <input
            value={order?.card_number || ""}
            onChange={(e) => {
              updateOrder({
                card_number: e.target.value
              })
            }}
            className="form-control col-span-2"
            placeholder="Card number"
          />
          <input
            value={order?.card_expire || ""}
            onChange={(e) => {
              updateOrder({
                card_expire: e.target.value
              })
            }}
            className="form-control"
            placeholder="MM/YY"
          />
          <input
            value={order?.card_cvc || ""}
            onChange={(e) => {
              updateOrder({
                card_cvc: e.target.value
              })
            }}
            className="form-control"
            placeholder="CVC"
          />
          <input
            value={order?.card_name || ""}
            onChange={(e) => {
              updateOrder({
                card_name: e.target.value
              })
            }}
            className="form-control col-span-2"
            placeholder="Name of Cardholder"
          />
        </div>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              setShowCard(false)
            }}
            className="btn-secondary"
          >
            {i18n.t("cancel")}
          </button>
          <button
            onClick={() => {
              setShowCard(false)
            }}
            className="btn-primary"
          >
            {i18n.t("Add")}
          </button>
        </div>
      </Menu>
    </div>
  )
}

export default Payment
