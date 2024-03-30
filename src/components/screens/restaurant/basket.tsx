import { useCart } from "@/components/providers/cart/cart"
import Image from "next/image"
import { useRouter } from "next/navigation"

const Basket = () => {
  // const i18n = useI18n()
  const cart = useCart()

  const router = useRouter()

  return (
    <div
      role="button"
      onClick={() => router.push("/basket")}
      className="fixed bottom-4 end-4 rounded-full bg-white p-3"
    >
      <div className="">
        <Image src="/icons/cart.png" width={24} height={24} alt="cart" />
        {cart?.items?.length > 0 && (
          <div className="absolute end-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-main text-white">
            <p className="text-[8px] font-semibold text-neutral-90">
              {cart?.items?.length}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Basket
