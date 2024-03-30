export const fixCdnUrl = (url: string = "") => {
  if (url.startsWith("https://devcdn.yumzi.app/")) {
    return url.replace(
      "https://devcdn.yumzi.app/",
      "https://yumzi-cdn-dev.fra1.cdn.digitaloceanspaces.com/"
    )
  }

  if (url.startsWith("https://cdn.yumzi.app/")) {
    return url.replace(
      "https://cdn.yumzi.app/",
      "https://yumzi-cdn.fra1.cdn.digitaloceanspaces.com/"
    )
  }

  return url
}
