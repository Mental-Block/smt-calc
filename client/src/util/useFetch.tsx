import React from 'react'

import { FetchError, FetchState, useFetchOptions } from '@interfaces/fetch'

import { fetchReducer } from './reducers'

export const debounceFunc = (func: () => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>

  return (...args: any) => {
    clearTimeout(timeout)

    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export const throttleFunc = (func: () => void, interval: number) => {
  let shouldFire = true
  return () => {
    if (shouldFire) {
      func()
      shouldFire = false
      setTimeout(() => {
        shouldFire = true
      }, interval)
    }
  }
}

function useFetch<T>(
  url: RequestInfo,
  options?: RequestInit,
  { delay = 0, cache = false }: useFetchOptions = {}
): FetchState<T> {
  const dataFetchReducer = fetchReducer<T>()
  const [state, dispatch] = React.useReducer(dataFetchReducer, {
    isLoading: false,
  })

  const cacheRef: React.MutableRefObject<Record<string, unknown>> =
    React.useRef({})

  const optionsRef: React.MutableRefObject<RequestInit | undefined> =
    React.useRef(options)

  const fetchFunc = React.useCallback(async () => {
    if (cache === false) cacheRef.current = {}

    if (cache === true && cacheRef.current[url as string]) {
      dispatch({
        type: 'RESOLVE',
        data: cacheRef.current[url as string] as T,
      })
    }

    try {
      const res = await fetch(url, optionsRef.current)

      if (!res.ok) {
        const data = (await res.json()) as FetchError

        if (!data) {
          dispatch({
            type: 'REJECT',
            error: `${res.status} ${res.statusText}`,
          })
        }

        dispatch({ type: 'REJECT', error: data.message })
      }

      const data = (await res.json()) as T

      cacheRef.current[url as string] = data
      dispatch({ type: 'RESOLVE', data })
    } catch (error) {
      dispatch({ type: 'REJECT', error: '500 Server Error' })
      console.error(error)
    }
  }, [cache, url])

  React.useEffect(() => {
    dispatch({ type: 'PENDING' })
    const timer = setTimeout(fetchFunc, delay)

    return () => clearTimeout(timer)
  }, [delay, fetchFunc])

  return state
}

export default useFetch
