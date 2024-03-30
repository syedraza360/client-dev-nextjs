import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Languages from "@/components/ui/languages"
import { cn, translateFromObject } from "@/helpers/utils"
import Image from "next/image"
import type { Dispatch, SetStateAction } from "react"
import { useEffect, useRef, type FC } from "react"
import { useFilters } from "../../useFilters"

import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import gsap from "gsap"
import ScrollTrigger from "gsap/dist/ScrollTrigger"

const HeaderDesktop: FC = () => {
  const headerSettingsRef = useRef<HTMLDivElement>(null)
  const stickyHeaderSettingsRef = useRef<HTMLDivElement>(null)
  const {
    restaurant,
    dishes,
    dishQuery: { preferenceCategories },
    activeMenuUid
  } = useRestaurant()

  const { filters, setFilters } = useFilters()

  useEffect(() => {
    ScrollTrigger?.create({
      scroller: "#main-window-desktop",
      trigger: headerSettingsRef.current,
      start: "bottom top",
      end: "bottom top",
      onEnter: () => {
        toggleStickyHeader(true)
      },
      onEnterBack: () => {
        toggleStickyHeader(false)
      }
    })
  }, [])

  useEffect(() => {
    const container = document.getElementById("main-window-desktop")
    const header = headerSettingsRef.current

    // Hide sticky header if there's not enough content to scroll
    if (container && header) {
      if (container.scrollTop < header.offsetTop) {
        toggleStickyHeader(false)
      }
    }
  }, [activeMenuUid, dishes, preferenceCategories])

  const toggleStickyHeader = (isShow: boolean) => {
    gsap.to(stickyHeaderSettingsRef.current, {
      opacity: isShow ? 1 : 0,
      duration: 0.1,
      pointerEvents: isShow ? "auto" : "none",
      ...(isShow && {
        width: `${headerSettingsRef.current?.offsetWidth}px`
      })
    })
  }

  return (
    <header>
      <div className="flex flex-col gap-6 laptop:flex-row-reverse">
        <div className="relative h-[350px] w-full laptop:w-1/2 desktop:h-[300px]">
          <Image
            src={fixCdnUrl(restaurant?.coverImage?.desktop || "")}
            alt="Restaurant image"
            fill
            priority
            className="rounded-xl object-cover"
            placeholder="blur"
            blurDataURL="/images/blur.png"
          />
        </div>
        <AboutRestaurant />
      </div>
      <div
        ref={headerSettingsRef}
        className="mt-12 flex flex-col gap-8 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-4"
      >
        <SearchAndLanguage />
        <Filters filters={filters} setFilters={setFilters} />
      </div>
      <div
        ref={stickyHeaderSettingsRef}
        className="pointer-events-none fixed top-0 z-20 flex flex-col gap-8 bg-white py-2 opacity-0 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-6 lg:py-4"
      >
        <div className="hidden lg:block">
          <SearchAndLanguage />
        </div>
        <Filters filters={filters} setFilters={setFilters} />
      </div>
    </header>
  )
}

const AboutRestaurant = () => {
  const { restaurant } = useRestaurant()

  const i18n = useI18n()

  const addressString = `${restaurant?.address.street}, ${restaurant?.address.zip} ${restaurant?.address.city}, ${restaurant?.address.country}`

  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 laptop:w-1/2">
      <h1 className="text-5xl font-semibold leading-tight">
        {restaurant?.name}
      </h1>
      <p className="mt-2 font-light leading-135">
        {translateFromObject(
          restaurant?.description,
          i18n.locale,
          "description"
        )}
      </p>
      <div className="mt-auto pt-3">
        <span className="flex gap-2.5">
          <Image
            src="/icons/location.svg"
            alt="Location"
            width={24}
            height={24}
          />
          <span className="dashed-border font-light">{addressString}</span>
        </span>
        <span className="mt-3 flex gap-2.5">
          <Image src="/icons/phone.svg" alt="Location" width={24} height={24} />
          <span className="dashed-border font-light">
            {restaurant?.phoneNumber}
          </span>
        </span>
      </div>
    </div>
  )
}

const SearchAndLanguage = () => {
  const { search, setSearch, restaurant } = useRestaurant()

  const i18n = useI18n()

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <input
          className="h-[36px] w-[330px] rounded-lg bg-dark-bg2 pl-[38px] pr-2 text-sm outline-none placeholder:text-dark-foreground"
          value={search}
          placeholder={`${i18n.t("Search at")} ${restaurant?.name}`}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Image
          src="/icons/search-md.svg"
          alt="search"
          width={16}
          height={16}
          className={cn(
            "absolute top-2",
            i18n.locale === "ar" ? "end-3" : "start-3"
          )}
        />
      </div>
      <Languages />
    </div>
  )
}

interface IFilters {
  filters: string[]
  setFilters: Dispatch<SetStateAction<string[]>>
}

const Filters: FC<IFilters> = ({ filters, setFilters }) => {
  const { dishQuery: query, setDishQuery: setQuery } = useRestaurant()
  const { allowedFilters } = useFilters()

  const i18n = useI18n()

  const onFilterClick = (value: string) => {
    let newFilters = []

    if (filters.includes(value)) {
      newFilters = filters.filter((v) => v !== value)
    } else {
      newFilters = [...filters, value]
    }
    setFilters(newFilters)
    setQuery({
      ...query,
      preferenceCategories: newFilters
    })
    setTimeout(() => {
      document
        .getElementById("main-window-desktop")
        ?.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="flex min-w-0 flex-1 gap-3">
      <div className="mt-2 whitespace-nowrap text-sm font-semibold">
        {i18n.t("Select filter")}:
      </div>
      <ul className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        {allowedFilters.map((filter) => (
          <li key={filter.value}>
            <button
              className={cn(
                "whitespace-nowrap rounded-md bg-dark-bg2 px-3.5 py-2 text-sm font-medium leading-[130%] duration-300",
                filters.includes(filter.value)
                  ? "bg-dark text-white"
                  : "hover:bg-black/10"
              )}
              onClick={() => onFilterClick(filter.value)}
            >
              {i18n.from(filter.name)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HeaderDesktop
