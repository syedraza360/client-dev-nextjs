import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FiCheck } from "react-icons/fi"
import { BottomSheet } from "react-spring-bottom-sheet"

const PaymentMethod = () => {
  const router = useRouter()
  const [show, setShow] = useState(false)
  const [method, setMethod] = useState("apple_pay")

  return (
    <>
      <div className="mb-4">
        <p className="text-lg font-semibold">Bestellhinweis</p>
        <div className="my-4 flex items-center justify-between gap-2.5 rounded-sm bg-neutral-80 px-4 py-3">
          <div className="flex flex-grow items-center gap-2.5">
            <Image
              src={`/icons/${method}.png`}
              alt={method}
              width={32}
              height={32}
            />
            <p className="text-sm font-medium">
              {methods?.find((d) => d.id === method)?.name}
            </p>
          </div>
          <button onClick={() => setShow(true)}>ändern</button>
        </div>
      </div>
      <BottomSheet
        open={show}
        className="bottom-sheet"
        onDismiss={() => setShow(false)}
      >
        <div className="container">
          {/* <h4 className="pb-6 pt-2 text-center text-xl">
                        {i18n.t("Preferences")}
                    </h4> */}
          <div className="mb-12 flex flex-col gap-4">
            {methods.map((d, index) => (
              <div
                key={index}
                role={"button"}
                onClick={() => {
                  setMethod(d.id)
                  setShow(false)
                  router.push("/payment/add")
                }}
                className="relative flex items-center gap-2.5 rounded-sm bg-neutral-70 p-4"
              >
                <Image
                  src={`/icons/${d.id}.png`}
                  alt={d.name}
                  width={32}
                  height={32}
                />
                <p className="text-sm font-medium">{d?.name}</p>
                {d?.id === method && (
                  <div className="absolute end-4 top-1/2 -translate-y-1/2 transform rounded-full border border-neutral-10 bg-main p-0.5">
                    <FiCheck size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </BottomSheet>
    </>
  )
}

const methods = [
  {
    id: "apple_pay",
    name: "Apple Pay"
  },
  {
    id: "gpay",
    name: "Google Pay"
  },
  {
    id: "mastercard",
    name: "Kredit- oder Debitkarte"
  }
]

export default PaymentMethod
