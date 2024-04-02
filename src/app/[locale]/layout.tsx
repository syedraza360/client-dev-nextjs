import Providers from "@/components/providers"
import type { Locale } from "@/components/providers/i18n/i18n.interface"
import { cn } from "@/helpers/utils"
import "@fontsource/inter"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import type { FC, PropsWithChildren } from "react"
import "./globals.scss"
import Head from "next/head"

export const metadata: Metadata = {
  title: "Yumzi",
  description: "Yumzi",
  // manifest: "/manifest.json",
  icons: {
    icon: "/favicon.jpg"
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://yumzi.app")
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
}

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
})

const isProduction = process.env.isProduction === "true"

interface IRootLayout {
  params: {
    locale: Locale
  }
}

const RootLayout: FC<PropsWithChildren<IRootLayout>> = ({
  children,
  params: { locale }
}) => {
  return (
    <html lang={locale}>
      <Head>
        {/* <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        /> */}
        <meta name="viewport" content="minimal-ui" />
      </Head>
      {isProduction && (
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                        })(window,document,'script','dataLayer','GTM-MMF25H2W');`
          }}
        />
      )}
      <body
        suppressHydrationWarning
        className={cn(
          inter.className,
          "relative mx-auto min-h-screen max-w-[1920px] overflow-x-hidden bg-white text-dark"
        )}
      >
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}

export default RootLayout
