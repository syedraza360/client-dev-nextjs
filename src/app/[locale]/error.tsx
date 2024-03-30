"use client"

import type { FC } from "react"

interface IError {
  error: Error & { digest?: string }
  reset: () => void
}

const Error: FC<IError> = ({ error, reset }) => {
  // useEffect(() => {
  //   console.error(error)
  // }, [error])
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

export default Error
