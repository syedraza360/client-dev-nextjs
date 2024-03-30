import locales from "@/components/providers/i18n/translations.json"
import createMiddleware from "next-intl/middleware"
import type { NextRequest } from "next/server"
import restaurantService from "./services/restaurant/restaurant.service"

export default async function middleware(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/")[1]

  const restaurant = await restaurantService.getOne(slug)

  const defaultLocale =
    restaurant?.data?.restaurants[0]?.settings?.guestsDefaultLanguage

  return createMiddleware({
    // A list of all locales that are supported
    locales: locales.map((locale) => locale.locale),
    // @ts-expect-error if it's undefined it won't set cookie and it's okay
    defaultLocale,
    localePrefix: "never",
    localeDetection: true
  })(req)
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!api|static|.*\\..*|_next).*)"]
}
