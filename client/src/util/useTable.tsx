// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'
import Highlighter from 'react-highlight-words'

import {
  Button,
  FormInstance,
  Input,
  InputRef,
  message as antMessage,
  Space,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import {
  FilterConfirmProps,
  FilterValue,
  SorterResult,
} from 'antd/lib/table/interface'

import {
  ColumnType,
  TableProps,
  TableOnChange,
  EditableCellProps,
  TablePagination,
} from '@interfaces/table'

import { fetchReducer, tableReducer } from '@util/reducers'
import { WithRequired } from '@interfaces/util'
import { useForm } from 'antd/lib/form/Form'

import { FetchError } from '@interfaces/fetch'

import useEdit from './useEdit'
import qs from 'qs'

function tableQuery(params: any) {
  return {
    pageSize: params.pagination.pageSize,
    page: params.pagination.current,
    sortField: params.sorter.field,
    sortOrder: params.sorter.order,
    ...filtersIntoQueryString(params.filters),
  }
}

function filtersIntoQueryString<T>(
  filters: Record<keyof T, FilterValue | null>
) {
  const newFilter = { ...filters }

  Object.values(filters).map((value, i) => {
    if (Array.isArray(value) && value.length > 1) {
      ;(newFilter[Object.keys(newFilter)[i] as keyof T] as any) =
        value?.join(' ')
    }

    return value
  })

  return newFilter
}

export default function useTable<T extends { id: number }>(
  records: T[],
  pagination: TablePagination = {
    pageSize: 10,
    current: 1,
    total: records.length,
  },
  /**
   * @param fetchAll
   * fetchAll function is needed for onChange and del inorder for tables with AJAX pagination to work.
   * If your not using pagination then you can ignore this function.
   */
  fetchAll?:
    | { url: RequestInfo; options?: RequestInit }
    | ((params: any) => Promise<TableProps<T>>)
) {
  if (typeof fetchAll === 'object' && fetchAll.url) {
    const { url, options } = fetchAll
    fetchAll = async (params: any) =>
      await fetch(url + `?${qs.stringify(tableQuery(params))}`, options)
        .then((res) => res.json())
        .catch(() => {
          throw 'Failed to load data.'
        })
  }

  const TableReducer = tableReducer<T>()
  const [table, tableDispatch] = React.useReducer(TableReducer, {
    records,
    pagination,
  })

  const FetchReducer = fetchReducer<T[]>()
  const [{ isLoading }, fetchDispatch] = React.useReducer(FetchReducer, {
    isLoading: false,
  })

  const _errorHandler = (err: unknown) => {
    let msg
    if (err instanceof Error) {
      msg = err.message
    } else {
      msg = '500 Server Error'
    }
    fetchDispatch({ type: 'REJECT', error: msg })
    antMessage.error({
      content: msg,
      className: 'table-message',
    })
  }

  const _getAll = async (params: Omit<TableOnChange<T>, 'extras'> = {}) => {
    try {
      if (typeof fetchAll !== 'function') throw 'fetchAll not defined.'
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
          throw err
        })
    } catch (err) {
      _errorHandler(err)
    }
  }

  const onChange = async (
    pagination: WithRequired<TablePagination, 'total'>,
    filters: Record<keyof T, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    try {
      fetchDispatch({ type: 'PENDING' })
      tableDispatch({ type: 'CHANGE', change: { filters, pagination, sorter } })
      await _getAll({
        pagination,
        sorter,
        filters,
      }).catch((err) => {
        throw err
      })
    } catch (err) {
      _errorHandler(err)
    }
  }

  const save = async (
    id: number,
    form: FormInstance<T>,
    fetchCB: (id: number, row: Partial<T>) => Promise<FetchError>
  ) => {
    try {
      fetchDispatch({ type: 'PENDING' })
      const row = await form.validateFields().catch((err) => {
        throw err.errorFields[0].errors
      })

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

        await fetchCB(id, row)
          .then(({ message }) => {
            fetchDispatch({ type: 'RESOLVE' })
            antMessage.success({
              content: message,
              className: 'table-message',
            })
          })
          .catch((err) => {
            throw err
          })
      } else {
        throw 'No index found.'
      }
    } catch (err) {
      _errorHandler(err)
    }
  }

  const add = async (
    values: Partial<T>,
    fetchCB: (values: Partial<any>) => Promise<T & FetchError>
  ) => {
    try {
      fetchDispatch({ type: 'PENDING' })
      await fetchCB(values)
        .then(({ message, ...record }) => {
          tableDispatch({ type: 'ADD', item: record as unknown as T })
          fetchDispatch({ type: 'RESOLVE' })
          antMessage.success({
            content: message,
            className: 'table-message',
          })
        })
        .catch((err) => {
          throw err
        })
    } catch (err) {
      _errorHandler(err)
    }
  }

  const del = async (
    id: number,
    fetchCB: (id: number) => Promise<FetchError>
  ) => {
    try {
      fetchDispatch({ type: 'PENDING' })
      tableDispatch({ type: 'DELETE', id })

      await fetchCB(id)
        .then(({ message }) => {
          /* table.records.length === 1 is actually 0 as state
           hasn't updated yet same with table.pagination.total */
          if (table.records.length === 1 && table.pagination.total > 1) {
            const { filters, sorter, pagination } = table.change as Required<
              Omit<TableOnChange<T>, 'extra'>
            >
            onChange(pagination, filters, sorter)
          }

          fetchDispatch({ type: 'RESOLVE' })
          antMessage.success({
            content: message,
            className: 'table-message',
          })
        })
        .catch((err) => {
          throw err
        })
    } catch (err) {
      _errorHandler(err)
    }
  }

  return {
    isLoading,
    records: table.records,
    pagination: table.pagination,
    action: {
      onChange,
      add,
      del,
      save,
    },
  }
}

export function useTableEdit<T extends { id: number }>(
  formInstance?: FormInstance<T>
) {
  const [form] = useForm(formInstance)
  const edit = useEdit<T>(form)

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
