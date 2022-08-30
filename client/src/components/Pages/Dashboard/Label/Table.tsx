// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'
import { Table as AntDTable } from 'antd'

import { API, BREAK_POINTS } from '@const'
import AuthContext from '@context/AuthContext'

import Spin from '@components/shared/Spin'
import { ActionColumn } from '@components/shared/Table'

import useTable, { useColumnSearch } from '@util/useTable'

import { ColumnType, TableProps } from '@interfaces/table'
import { FetchError } from '@interfaces/fetch'
import { Label } from '@interfaces/label'

import TableHeader from './TableHeader'

const Table: React.FC<TableProps<Label>> = ({ records, pageLength }) => {
  const { auth } = React.useContext(AuthContext)
  const searchBar = useColumnSearch<Label>()

  const table = useTable<Label>(
    records,
    { pageSize: 10, current: 1, total: pageLength },
    {
      url: `${API.LABEL}`,
      options: {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'GET',
      },
    }
  )

  const add = React.useCallback(
    async (values: Partial<Label>): Promise<Label & FetchError> => {
      const res = await fetch(`${API.LABEL}/add`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error(`Failed to add label.`)

      const data: Label = await res.json()

      return {
        ...data,
        message: `Label Added.`,
      }
    },
    [auth.accessToken]
  )

  const del = React.useCallback(
    async (id: number): Promise<FetchError> => {
      const res = await fetch(`${API.LABEL}/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'DELETE',
      })

      if (!res.ok) throw new Error(`Failed to deleted label.`)

      return { message: `Label deleted.` }
    },
    [auth.accessToken]
  )

  const LABEL_COLUMNS: ColumnType<Label>[] = React.useMemo(
    () => [
      {
        title: 'Part UUId',
        dataIndex: 'partId',
        key: 'partId',
        ...searchBar('partId', '23849239843289832'),
      },
      {
        title: 'Part Number',
        dataIndex: 'component_partnumberInternal',
        key: 'component_partnumberInternal',
        ...searchBar('component_partnumberInternal', '213-00100'),
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) =>
          a.component_partnumberManufactor.localeCompare(
            b.component_partnumberManufactor
          ),
      },
      {
        title: 'Manufactor Part Number',
        dataIndex: 'component_partnumberManufactor',
        key: 'component_partnumberManufactor',
        ...searchBar('component_partnumberManufactor', 'X727322ND11FG3'),
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) =>
          a.component_partnumberManufactor.localeCompare(
            b.component_partnumberManufactor
          ),
      },
      {
        title: 'Actions',
        key: 'action',
        dataIndex: 'action',
        className: 'flex-center-center',
        width: '125px',
        render: (_: any, record) => (
          <ActionColumn
            del={{
              del: () => table.action.del(record.id, del),
              message: 'Delete this Label?',
            }}
          />
        ),
      },
    ],
    [searchBar, table, del]
  )

  return (
    <React.Fragment>
      <AntDTable<Label>
        dataSource={table.records}
        onChange={table.action.onChange as any}
        columns={LABEL_COLUMNS}
        rowKey={'id'}
        title={() => (
          <TableHeader add={(values) => table.action.add(values, add)} />
        )}
        className="page"
        bordered={true}
        showHeader={true}
        sticky={true}
        tableLayout={'fixed'}
        scroll={{ x: BREAK_POINTS.md }}
        size={BREAK_POINTS.md ? 'middle' : 'small'}
        loading={{
          delay: 200,
          spinning: table.isLoading,
          indicator: <Spin delay={200} />,
        }}
        pagination={{
          ...table.pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            ` ${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </React.Fragment>
  )
}

export default Table
