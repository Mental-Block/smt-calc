import { FetchAction, FetchState } from '@interfaces/fetch'

const fetchReducer =
  <T>() =>
  (state: FetchState<T>, action: FetchAction<T>): FetchState<T> => {
    switch (action.type) {
      case 'PENDING':
        return { ...state, isLoading: true }
      case 'RESOLVE':
        return { ...state, isLoading: false, data: action.data }
      case 'REJECT':
        return { ...state, isLoading: false, error: action.error }
    }
  }

export default fetchReducer
