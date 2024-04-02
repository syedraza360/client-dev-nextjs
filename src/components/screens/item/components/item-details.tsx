import ImageOrVideo from "@/components/ui/image-or-video/image-or-video"
import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import { cn } from "@/helpers/utils"
import type { IDish } from "@/interfaces/dish.interface"
import type { FC, ReactElement, ReactNode } from "react"
import { Fragment, useEffect, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

interface IItemDetails {
  dish: IDish
}

const ItemDetails: FC<IItemDetails> = ({ dish }) => {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const el = window
    const handler = () => {
      setScrollPosition(el?.scrollY || 0)
    }

    el?.addEventListener("scroll", handler)

    return () => {
      el?.removeEventListener("scroll", handler)
    }
  }, [])

  const isImages = dish?.images?.length > 0

  return (
    <div
      className={cn("", isImages ? "left-0 top-14" : "bg-white px-3")}
    >
      {isImages && (
        <>
          <div
            className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full bg-black"
            style={{
              opacity: scrollPosition === 0 ? 0 : scrollPosition / 950
            }}
          />
          <DetailsImages images={dish?.images || []} isDish={!!dish} />
        </>
      )}
    </div>
  )
}

interface IDetailsImages {
  images: string[]
  isDish: boolean
}

export const DetailsImages: FC<IDetailsImages> = ({ images, isDish }) => {
  const imagesSliderSettings = {
    dots: true,
    infinite: false,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: (props: ReactNode) => {
      const dots = props as ReactElement[]

      return images?.length === 1 ? (
        <></>
      ) : (
        <div style={{ bottom: -4 }} className="absolute left-0 h-1">
          <div className="flex">
            {dots?.map((dot, index) => {
              const active = dot.props.className === "slick-active"
              return (
                <div
                  className={`h-1 flex-grow ${active ? "bg-black" : "bg-transparent"}`}
                  key={index}
                />
              )
            })}
          </div>
        </div>
      )
    }
  }

  return (
    <Slider {...imagesSliderSettings}>
      {images?.map((image, index) => (
        <Fragment key={index}>
          <div className="relative aspect-[3/4] h-full w-full mobile-min:aspect-square tablet:aspect-auto tablet:h-[381.553px] tablet:w-[300px]">
            {isDish && (
              <ImageOrVideo
                src={fixCdnUrl(image)}
                imageProps={{
                  fill: true,
                  priority: true,
                  alt: "dish image",
                  placeholder: "empty"
                }}
              />
            )}
          </div>
        </Fragment>
      ))}
    </Slider>
  )
}

export default ItemDetails
