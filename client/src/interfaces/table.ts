import React from 'react'

import { FormItemProps } from 'antd'
import { ColumnType as AntColumnType } from 'antd/lib/table'
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
  TablePaginationConfig,
} from 'antd/lib/table/interface'

export type TablePagination = TablePaginationConfig & {
  total: number
  current: number
  pageSize: number
}

export interface TableContextProps<T> {
  records: T[]
  pagination?: TablePagination
}

export interface TableState<RecordType> {
  records: RecordType[]
  pagination: TablePagination
  change?: TableOnChange<RecordType>
}

export interface TableOnChange<RecordType> {
  pagination?: TablePagination
  filters?: Record<keyof RecordType, FilterValue | null>
  sorter?: SorterResult<RecordType> | SorterResult<RecordType>[]
  extra?: TableCurrentDataSource<RecordType>
}

export type TableAction<T> =
  | { type: 'SAVE'; records: T[] }
  | { type: 'ALL'; pagination: TablePagination; records: T[] }
  | { type: 'CHANGE'; change: Required<Omit<TableOnChange<T>, 'extra'>> }
  | { type: 'ADD'; item: T }
  | { type: 'DELETE'; id: number }

export interface ColumnType<RecordType> extends AntColumnType<RecordType> {
  editable?: boolean
  inputNode?: React.ReactChild
  formItem?: FormItemProps
}

export interface TableQuery {
  pagination?: TablePagination
  sorter?: SorterResult<any> | SorterResult<any>[]
  sortField?: string
  sortOrder?: string
}

export interface TableProps<RecordType> {
  records: RecordType[]
  pageLength: number
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  inputNode: React.ReactNode
  formItem: Omit<FormItemProps, 'children'>
  record: any
  title?: any
  index?: number
  children?: React.ReactNode
  rest?: any
}

export interface RenderColumn {
  text?: string
  record?: any
}

export interface DateColumnProps {
  date: Date
}

export interface TimeColumnProps {
  date: Date
  finishedText: string
  finishedStatus: 'error' | 'success'
}

export interface ActionColumnProps {
  edit?: {
    showIcon?: boolean
    editable: boolean
    disable?: boolean
    action: {
      save: () => void
      edit: () => void
      cancel: () => void
    }
    message?: {
      save?: string
      cancel?: string
    }
  }
  del?: {
    showIcon?: boolean
    del?: () => void
    message?: string
  }
  pause?: {
    showIcon?: boolean
    isPaused: boolean
    message?: {
      pause: string
      unpause: string
    }
    action: {
      pause: () => void
      unPause: () => void
    }
  }
}
