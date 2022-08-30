export interface useFetchOptions {
  delay?: number
  cache?: boolean
}

export interface Fetch {
  url: RequestInfo
  options?: RequestInit
}

export interface FetchState<T> {
  isLoading: boolean
  data?: T
  error?: string
}

export type FetchAction<T> =
  | { type: 'PENDING' }
  | { type: 'RESOLVE'; data?: T }
  | { type: 'REJECT'; error: string }

export interface FetchError {
  message: string
}
