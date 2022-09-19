import React from 'react'
import Highlighter from 'react-highlight-words'

import { Button, FormInstance, Input, InputRef, Space } from 'antd'

import { SearchOutlined } from '@ant-design/icons'
import {
  FilterConfirmProps,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface'

import {
  ColumnType,
  TableOnChange,
  EditableCellProps,
  TablePagination,
  TableQuery,
  TableProps,
} from '@interfaces/table'

import { fetchReducer, tableReducer } from '@util/reducers'
import { WithRequired } from '@interfaces/util'

import useEdit from './useEdit'
import { failedMessage, successMessage } from '@components/shared/Table/message'

export default function useTable<
  T extends {
    [key: string]: any
    id: number
  }
>(
  records: T[] = [],
  pagination: TablePagination = {
    pageSize: 10,
    current: 1,
    total: records.length,
  },
  fetchAll?: (params: TableQuery<T>) => Promise<TableProps<T>>,
  initialRequest = false
) {
  const initialRequestRef = React.useRef(initialRequest)
  const FetchReducer = fetchReducer<T>()
  const [{ isLoading, error }, fetchDispatch] = React.useReducer(FetchReducer, {
    isLoading: false,
  })

  const TableReducer = tableReducer<T>()
  const [table, tableDispatch] = React.useReducer(TableReducer, {
    records,
    pagination,
  })

  const getAll = React.useCallback(
    async (params: Omit<TableOnChange<T>, 'extras'>) => {
      if (typeof fetchAll !== 'function') throw 'fetchAll not defined.'
      fetchDispatch({ type: 'PENDING' })
      await fetchAll(params)
        .then(({ pageLength, records }) => {
          tableDispatch({
            type: 'ALL',
            records,
            pagination: {
              ...params.pagination,
              pageSize: params.pagination?.pageSize as number,
              current: params.pagination?.current as number,
              total: pageLength,
            },
          })
          fetchDispatch({ type: 'RESOLVE' })
        })
        .catch((err) => {
          fetchDispatch({ type: 'REJECT', error: err.message })
          throw err
        })
    },
    [fetchAll]
  )

  React.useEffect(() => {
    if (initialRequestRef.current === true) {
      initialRequestRef.current = false
      getAll({ pagination })
    }
  }, [getAll, pagination])

  const onChange = async (
    pagination: WithRequired<TablePagination, 'total'>,
    filters: Record<keyof T, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    tableDispatch({ type: 'CHANGE', change: { filters, pagination, sorter } })
    await getAll({
      pagination,
      sorter,
      filters,
    }).catch((err) => {
      throw err
    })
  }

  const save = (id: number, row: T) => {
    const tableRecords = [...table.records]
    const index = tableRecords.findIndex((record) => id === record.id)

    if (index > -1) {
      const oldRow = tableRecords[index]
      tableRecords.splice(index, 1, {
        ...oldRow,
        ...row,
      })

      tableDispatch({
        type: 'SAVE',
        records: tableRecords,
      })
    } else {
      throw 'No id found.'
    }
  }

  const add = (item: T) => {
    tableDispatch({ type: 'ADD', item })
  }

  const del = (id: number) => {
    tableDispatch({ type: 'DELETE', id })
    /* table.records.length === 1 is actually 0 as state
           hasn't updated yet same with table.pagination.total */
    if (table.records.length === 1 && table.pagination.total > 1) {
      const { filters, sorter, pagination } = table.change as Required<
        Omit<TableOnChange<T>, 'extra'>
      >
      onChange(pagination, filters, sorter)
    }
  }

  const findRecord = (propertyKey: keyof T, propertyValue: string) => {
    return new Promise<T>((resolve, reject) => {
      const record = table.records.filter(
        (record) => record[propertyKey] === propertyValue
      )

      if (record[0]) {
        resolve(record[0])
      }

      reject('Record not found')
    })
  }

  function handleTableFetch(
    API: Promise<void>,
    success: string,
    error: string
  ) {
    fetchDispatch({ type: 'PENDING' })
    API.then(() => {
      successMessage(success)
      fetchDispatch({ type: 'RESOLVE' })
    }).catch((err) => {
      failedMessage(err.message || error)
      fetchDispatch({ type: 'REJECT', error: err.message })
    })
  }

  return {
    records: table.records,
    pagination: table.pagination,
    fetch: {
      handleTableFetch,
      isLoading,
      error,
    },
    util: {
      findRecord,
    },
    action: {
      onChange,
      add,
      del,
      save,
    },
  }
}

export function useTableEdit<T extends { id: number }>(
  formInstance: FormInstance<T>
) {
  const edit = useEdit<T>(formInstance)

  const mergedEditWColumns = (columns: ColumnType<T>[]) =>
    columns.map((col) => {
      if (col.editable) {
        return {
          ...col,
          onCell: (record: T): EditableCellProps => ({
            record,
            inputNode: col.inputNode ? col.inputNode : <Input />,
            formItem: col.formItem
              ? col.formItem
              : {
                  style: { margin: 0 },
                  validateFirst: true,
                  validateTrigger: 'onBlur',
                },
            dataIndex: col.dataIndex as string,
            title: col.title,
            editing: edit.isEditing(record.id),
          }),
        }
      }

      return col
    })

  return {
    ...edit,
    mergedEditWColumns,
  }
}

export function useColumnSearch<T>() {
  const searchInput = React.useRef<InputRef>(null)
  const [searchText, setSearchText] = React.useState('')
  const [searchedColumn, setSearchedColumn] = React.useState('')

  const searchColumn = (
    dataIndex: string,
    placeholder?: string
  ): ColumnType<T> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={placeholder ? placeholder : `Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#d42e12' : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: string
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  return searchColumn
}
