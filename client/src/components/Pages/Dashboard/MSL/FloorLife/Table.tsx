// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'
import { Form, Input, Table as AntDTable } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import {
  API,
  BREAK_POINTS,
  MSL_LEVEL_OPTIONS,
  MSL_STATUS_OPTIONS,
  TIME,
} from '@const'

import AuthContext from '@context/AuthContext'

import useTable, { useColumnSearch, useTableEdit } from '@util/useTable'

import { ColumnType, TableProps } from '@interfaces/table'
import { FetchError } from '@interfaces/fetch'

import { EditableCell, TimeColumn } from '@components/shared/Table'
import Spin from '@components/shared/Spin'

import TableHeader from './TableHeader'
import { ActionColumn, DateColumn } from '@components/shared/Table/Columns'
import { FloorLifeProps } from '@interfaces/msl'
import { DeepFlatten } from '@interfaces/util'
import { ComponentProps } from '@interfaces/component'
import { LabelProps } from '@interfaces/label'

type FloorlifeTable = FloorLifeProps & {
  label: Pick<LabelProps, 'partId'>
  label_component: Pick<ComponentProps, 'partnumberInternal'>
}

type Floorlife = DeepFlatten<FloorlifeTable, '_'>

const Table: React.FC<TableProps<Floorlife>> = ({ records, pageLength }) => {
  const { auth } = React.useContext(AuthContext)
  const searchBar = useColumnSearch<Floorlife>()
  const [form] = useForm<Floorlife>()
  const edit = useTableEdit<Floorlife>(form)
  const table = useTable<Floorlife>(
    records,
    { pageSize: 10, current: 1, total: pageLength },
    {
      url: `${API.FLOORLIFE}`,
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
    async ({
      partId,
    }: Partial<LabelProps>): Promise<Floorlife & FetchError> => {
      const res = await fetch(`${API.FLOORLIFE}/${partId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
      })

      if (!res.ok) throw new Error(`Failed to add MSL.`)

      const data: any = await res.json()

      return {
        ...data,
        message: `MSL Added.`,
      }
    },
    [auth.accessToken]
  )

  const del = React.useCallback(
    async (id: number): Promise<FetchError> => {
      const res = await fetch(`${API.FLOORLIFE}/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'DELETE',
      })

      if (!res.ok) throw new Error(`Failed to delete MSL.`)

      return { message: `MSL deleted.` }
    },
    [auth.accessToken]
  )

  const unpause = React.useCallback(
    async (id: number): Promise<Floorlife> => {
      const res = await fetch(`${API.FLOORLIFE}/unpause/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
      })

      const data = (await res.json()) as Floorlife

      return data
    },
    [auth.accessToken]
  )

  const pause = React.useCallback(
    async (id: number): Promise<Floorlife> => {
      const res = await fetch(`${API.FLOORLIFE}/pause/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
      })

      const data = (await res.json()) as Floorlife

      return data
    },
    [auth.accessToken]
  )

  const handleUnpause = React.useCallback(
    async (record: Floorlife) => {
      const save = (_: any, row: Partial<Floorlife>) =>
        new Promise<FetchError>((resolve, reject) => {
          if (row) {
            resolve({ message: 'Msl unpaused.' })
          } else {
            reject({ message: `Failed to unpause msl.` })
          }
        })

      await unpause(record.id)
        .then((newRecord) => {
          edit.edit(record, newRecord)
        })
        .then(() => {
          table.action.save(record.id, form, save)
          edit.cancelEdit()
        })
    },
    [edit, form, table, unpause]
  )

  const handlePause = React.useCallback(
    async (record: Floorlife) => {
      const save = (__: any, row: Partial<Floorlife>) =>
        new Promise<FetchError>((resolve, reject) => {
          if (row) {
            resolve({ message: 'Msl paused.' })
          } else {
            reject({ message: `Failed to unpause msl.` })
          }
        })

      await pause(record.id)
        .then((newRecord) => {
          edit.edit(record, newRecord)
        })
        .then(() => {
          table.action.save(record.id, form, save)
          edit.cancelEdit()
        })
    },
    [form, pause, table, edit]
  )

  const FLOORLIFE_COLUMNS: ColumnType<Floorlife>[] = React.useMemo(
    () => [
      {
        title: 'Part UUId',
        dataIndex: 'label_partId',
        key: 'label_partId',
        ...searchBar('label_partId', '23849239843289832'),
      },
      {
        title: 'Part Number',
        dataIndex: 'label_component_partnumberInternal',
        key: 'component_partnumberInternal',
        ...searchBar('component_partnumberInternal', '213-00100'),
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) =>
          a.label_component_partnumberInternal.localeCompare(
            b.label_component_partnumberInternal
          ),
      },
      {
        title: 'MSL Level',
        dataIndex: 'level',
        key: 'level',
        ellipsis: { showTitle: false },
        filters: MSL_LEVEL_OPTIONS.map((level) => ({
          text: level,
          value: level,
        })),
        sorter: (a, b) => (a.level as string).localeCompare(b.level as string),
        onFilter: (value, record): boolean => record.level === value,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        ellipsis: { showTitle: false },
        className: 'column-status',
        filters: MSL_STATUS_OPTIONS.map((level) => ({
          text: level.toLowerCase(),
          value: level,
        })).filter(
          ({ value }) =>
            value === 'PAUSED' || value === 'RECOVERING' || value === 'EXPIRING'
        ),
        editable: true,
        inputNode: <Input />,
        sorter: (a, b) =>
          (a.status as string).localeCompare(b.status as string),
        onFilter: (value, record): boolean => record.status === value,
      },
      {
        title: 'Created At',
        key: 'createdAt',
        ellipsis: true,
        dataIndex: 'createdAt',
        ...searchBar('createdAt', '20/0/2022'),
        sorter: (a, b) => a.createdAt - b.createdAt,
        render: (value): JSX.Element => <DateColumn date={value} />,
      },
      {
        title: 'Last Return',
        key: 'updatedAt',
        ellipsis: true,
        dataIndex: 'updatedAt',
        editable: true,
        inputNode: <Input />,
        ...searchBar('updatedAt', '20/0/2022'),
        sorter: (a, b) => a.updatedAt - b.updatedAt,
        render: (value): JSX.Element => <DateColumn date={value} />,
      },
      {
        title: 'Expires / Recovers At',
        key: 'availableAt',
        ellipsis: true,
        dataIndex: 'availableAt',
        ...searchBar('availableAt', '20/0/2023'),
        sorter: (a, b) => a.availableAt - b.availableAt,
        editable: true,
        inputNode: <Input />,
        render: (value, record): JSX.Element => (
          <React.Fragment>
            {value && record.status === 'RECOVERING' && (
              <TimeColumn
                date={value}
                finishedStatus={'success'}
                finishedText={'RECOVERED'}
              />
            )}

            {value && record.status === 'EXPIRING' && (
              <TimeColumn
                date={value}
                finishedStatus={'error'}
                finishedText={'EXPIRED'}
              />
            )}

            {!value || (record.status === 'PAUSED' && <div>NA</div>)}
          </React.Fragment>
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
              message: 'Delete this MSL?',
            }}
            pause={{
              showIcon:
                new Date(record.availableAt).getTime() - Date.now() >= TIME.NOW,
              isPaused: record.status !== 'EXPIRING',
              action: {
                pause: () => handlePause(record),
                unPause: () => handleUnpause(record),
              },
              message: {
                pause: 'MSL back in cabinet?',
                unpause: 'MSL out of cabinet?',
              },
            }}
          />
        ),
      },
    ],
    [searchBar, table, del, handleUnpause, handlePause]
  )

  return (
    <React.Fragment>
      <Form form={form} component={false}>
        <AntDTable
          dataSource={[...table.records]}
          onChange={table.action.onChange as any}
          columns={edit.mergedEditWColumns(FLOORLIFE_COLUMNS)}
          rowKey={'id'}
          title={() => (
            <TableHeader add={(record: any) => table.action.add(record, add)} />
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
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          pagination={{
            ...table.pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              ` ${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Form>
    </React.Fragment>
  )
}

export default Table
