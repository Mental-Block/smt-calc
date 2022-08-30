import { TableAction, TableState } from '@interfaces/table'

const tableReducer =
  <T extends { id: number }>() =>
  (state: TableState<T>, action: TableAction<T>): TableState<T> => {
    switch (action.type) {
      case 'SAVE':
        return {
          ...state,
          records: [...action.records],
        }
      case 'ADD':
        return {
          ...state,
          pagination: {
            ...state.pagination,
            total: state.pagination.total + 1,
          },
          /* fixes pagination bug where records is too long for table */
          records:
            state.records.length > state.pagination.pageSize
              ? [action.item, ...state.records].slice(0, -1)
              : [action.item, ...state.records],
        }
      case 'DELETE':
        return {
          ...state,
          pagination: {
            ...state.pagination,
            total: state.pagination.total - 1,
          },
          records: state.records.filter((item) => item.id !== action.id),
        }
      case 'CHANGE':
        return {
          ...state,
          change: {
            ...action.change,
            pagination: {
              ...action.change.pagination,
              total: state.pagination.total - 1,
              current:
                action.change.pagination.current &&
                action.change.pagination.current !== 1
                  ? action.change.pagination.current - 1
                  : 1,
            },
          },
        }
      case 'ALL':
        return {
          ...state,
          records: action.records,
          pagination: action.pagination,
        }
      default:
        return state
    }
  }

export default tableReducer
