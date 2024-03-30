interface IResponse<T> {
  error: boolean
  msg: string
  data: T
}

export const API_URL = process.env.backend_url + "api"

// prettier-ignore
export const myFetch = async <T,>(
  url: string,
  init?: RequestInit
): Promise<IResponse<T>> => {
  const fetchUrl = url.startsWith("/") ? url : `/${url}`

  const response = await fetch(`${API_URL}${fetchUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    ...init
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  const json = await response.json()
  return json
}

export interface IDefaultApiParams {
  limit?: number
  skip?: number
}
