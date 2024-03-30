const isProduction = process.env.isProduction === "true"

const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    backend_url: isProduction
      ? "https://yumzi-be.app/"
      : "https://dev.yumzi-be.app/"
    // backend_url: "https://yumzi-be.app/"
    // backend_url: "http://localhost:5500/"
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              typescript: true,
              ext: "tsx",
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false
                      }
                    }
                  },
                  {
                    name: "convertColors",
                    params: {
                      currentColor: true
                    }
                  }
                ]
              }
            }
          }
        ]
      }
    )

    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  images: {
    // domains: [
    //     "i.ibb.co",
    //     "cdn.pixabay.com",
    //     "cdn.yumzi.app",
    //     "devcdn.yumzi.app"
    // ]
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**"
      }
    ]
  }
}

module.exports = withNextIntl(nextConfig)
