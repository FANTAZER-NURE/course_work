import { useEffect, useState } from 'react'

export type ErrorState = string | null

export const usePageError = (initialError: ErrorState) => {
  const [error, setError] = useState<ErrorState>(initialError)

  useEffect(() => {
    if (!error) {
      return
    }

    const timerId = setTimeout(() => {
      setError('') // Set error to null after 3 seconds
    }, 3000)

    return () => {
      clearTimeout(timerId)
    }
  }, [error])

  return [error, setError] as const // Return the state and setter as a tuple
}
