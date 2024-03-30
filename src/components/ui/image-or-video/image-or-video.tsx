"use client"

import { checkUrlType } from "@/helpers/check-url-type"
import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import { cn } from "@/helpers/utils"
import type { ImageProps } from "next/image"
import Image from "next/image"

import { memo, type FC } from "react"

interface IImageOrVideo {
  src: string
  imageProps?: Omit<ImageProps, "src">
  videoProps?: React.VideoHTMLAttributes<HTMLVideoElement>
}

const ImageOrVideo: FC<IImageOrVideo> = memo(
  ({ src, imageProps, videoProps }) => {
    const isVideo = checkUrlType(src) === "video"

    return (
      <>
        {isVideo ? (
          <video
            src={fixCdnUrl(src)}
            loop
            muted
            autoPlay
            playsInline
            controls={false}
            {...videoProps}
            className={cn("h-full w-full object-cover", videoProps?.className)}
          />
        ) : (
          <Image
            src={fixCdnUrl(src)}
            placeholder="blur"
            blurDataURL="/images/blur.png"
            alt="image"
            {...imageProps}
            className={cn("h-full w-full object-cover", imageProps?.className)}
          />
        )}
      </>
    )
  }
)

ImageOrVideo.displayName = "ImageOrVideo"

export default ImageOrVideo
