import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import PageTitle from "../../../../components/page/title"
import { useI18n } from "../../../../contexts/i18n"

const Success = () => {
  const i18n = useI18n()
  const { query } = useRouter()

  return (
    <>
      <PageTitle title="Confirmation" />
      <div
        className="container flex flex-col justify-between text-gray-900"
        style={{ minHeight: "calc(100vh - 60px)" }}
      >
        <div className="flex h-[70vh] flex-col items-center justify-center gap-16">
          <div className="relative h-[284px] w-[254px]">
            <Image
              src="/images/chef.png"
              alt="chef"
              fill
              className="h-full w-full"
            />
          </div>
          <div className="max-w-sm">
            <p className="text-center font-bold">
              {i18n.t("Thank you for your order")}
            </p>
            <p className="text-center">
              {i18n.t(
                "Your order has been received and will be processed immediately"
              )}
            </p>
          </div>
        </div>
        <div className="border-t py-4 mobile:px-4">
          <Link
            href={`/order/${query.uid}${query?.tableID ? `?tableID=${query.tableID}` : ""}`}
            className="btn-primary block"
          >
            {i18n.t("Back to the menu")}
          </Link>
        </div>
      </div>
    </>
  )
}

export default Success
