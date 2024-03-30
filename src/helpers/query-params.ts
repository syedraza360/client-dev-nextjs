import queryString from "query-string"

interface IUrlQueryParams {
  params: string
  key?: string
  value?: string | null
  keysToRemove?: string[]
}

export const formUrlQuery = ({
  params,
  key,
  keysToRemove,
  value
}: IUrlQueryParams) => {
  const currentUrl = queryString.parse(params)

  if (keysToRemove) {
    keysToRemove.forEach((keyToRemove) => {
      delete currentUrl[keyToRemove]
    })
  } else if (key && value) {
    currentUrl[key] = value
  }

  return queryString.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl
    },
    {
      skipNull: true
    }
  )
}

export const getParamsString = (params: {
  [key: string]: string | number | boolean
}) => {
  return Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join("&")
}
