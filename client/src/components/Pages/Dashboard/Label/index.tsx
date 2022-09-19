// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'
import { Table as AntDTable } from 'antd'

import { BREAK_POINTS } from '@const'
import Spin from '@components/shared/Spin'
import { ActionColumn } from '@components/shared/Table/Columns'

import useTable, { useColumnSearch } from '@util/useTable'

import type { ColumnType } from '@interfaces/table'
import type { Label } from '@interfaces/label'

import TableHeader from './TableHeader'
import { usePrivateApi } from '@API'

const LabelTable: React.FC = () => {
  const searchBar = useColumnSearch<Label>()
  const API = usePrivateApi()

  const TABLE = useTable<Label>(
    [],
    undefined,
    (params) => API('labelAll', params),
    true
  )

  const add = (values: Omit<Label, 'id'>) => {
    TABLE.fetch.handleTableFetch(
      API<Label>('labelAdd', values).then((record) => TABLE.action.add(record)),
      'Label Added.',
      'Failed to add label.'
    )
  }

  const del = (id: Pick<Label, 'id'>['id']) => {
    TABLE.fetch.handleTableFetch(
      API('labelDel', id).then(() => TABLE.action.del(id)),
      `Label deleted..`,
      `Failed to add Label`
    )
  }

  const LABEL_COLUMNS: ColumnType<Label>[] = [
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
            del: () => del(record.id),
            message: 'Delete this Label?',
          }}
        />
      ),
    },
  ]

  return (
    <React.Fragment>
      <AntDTable<Label>
        dataSource={TABLE.records}
        onChange={TABLE.action.onChange as any}
        columns={LABEL_COLUMNS}
        rowKey={'id'}
        title={() => <TableHeader add={add} />}
        className="page"
        bordered={true}
        showHeader={true}
        sticky={true}
        tableLayout={'fixed'}
        scroll={{ x: BREAK_POINTS.md }}
        size={BREAK_POINTS.md ? 'middle' : 'small'}
        loading={{
          delay: 200,
          spinning: TABLE.fetch.isLoading,
          indicator: <Spin delay={200} />,
        }}
        pagination={{
          ...TABLE.pagination,
          showSizeChanger: true,
          showTotal: (total, range) =>
            ` ${range[0]}-${range[1]} of ${total} items`,
        }}
      />
    </React.Fragment>
  )
}

export default LabelTable
