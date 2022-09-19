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
  current: number
  pageSize: number
}

export interface TableProps<T> {
  records: T[]
  pageLength: number
}

export interface TableState<T> {
  records: T[]
  pagination: TablePagination
  change?: TableOnChange<T>
}

export interface TableContext<T> {
  table: TableState<T>
  setTable: (table: Omit<TableState<T>, 'change'>) => void
}

export interface TableOnChange<T> {
  pagination?: TablePagination
  filters?: Record<keyof T, FilterValue | null>
  sorter?: SorterResult<T> | SorterResult<T>[]
  extra?: TableCurrentDataSource<T>
}

export type TableAction<T> =
  | { type: 'SAVE'; records: T[] }
  | { type: 'ALL'; pagination: TablePagination; records: T[] }
  | { type: 'CHANGE'; change: Required<Omit<TableOnChange<T>, 'extra'>> }
  | { type: 'ADD'; item: T }
  | { type: 'DELETE'; id: number }

export interface ColumnType<T> extends AntColumnType<T> {
  editable?: boolean
  inputNode?: React.ReactChild
  formItem?: FormItemProps
}

export interface TableQuery<T> {
  pagination?: TablePagination
  sorter?: SorterResult<T>[] | SorterResult<T>
  field?: string
  order?: string
  filters?: any
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
  date: string | number
}

export interface TimeColumnProps {
  date: string
  finished?: {
    className?: string
    text: string
  }
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
