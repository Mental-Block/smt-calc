// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'
import { Form, Input, Table as AntDTable } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import {
  BREAK_POINTS,
  MSL_LEVEL_OPTIONS,
  MSL_STATUS_OPTIONS,
  TIME,
} from '@const'

import useTable, { useColumnSearch, useTableEdit } from '@util/useTable'

import type { ColumnType } from '@interfaces/table'
import type { Floorlife } from '@interfaces/msl'
import type { LabelProps } from '@interfaces/label'

import { EditableCell } from '@components/shared/Table'
import {
  ActionColumn,
  DateColumn,
  TimeColumn,
} from '@components/shared/Table/Columns'
import Spin from '@components/shared/Spin'

import TableHeader from './TableHeader'
import { usePrivateApi } from '@API'

const FloorLifeTable: React.FC = (): JSX.Element => {
  const [form] = useForm<Floorlife>()
  const EDIT = useTableEdit<Floorlife>(form)
  const searchBar = useColumnSearch<Floorlife>()
  const API = usePrivateApi()

  const TABLE = useTable<Floorlife>(
    [],
    undefined,
    (params) => API('floorlifeAll', params),
    true
  )

  const unPause = React.useCallback(
    async (partId: Pick<Floorlife, 'label_partId'>['label_partId']) => {
      TABLE.fetch.handleTableFetch(
        API<Floorlife>('floorlifeunPause', partId)
          .then((record) => {
            EDIT.edit(record)
            return record
          })
          .then((row) => {
            TABLE.action.save(row.id, row)
            EDIT.cancel()
          }),
        'MSL out of cabinet',
        `Failed to take MSL out of cabinet`
      )
    },
    [TABLE, API, EDIT]
  )

  const pause = (partId: Pick<Floorlife, 'label_partId'>['label_partId']) => {
    TABLE.fetch.handleTableFetch(
      API<Floorlife>('floorlifePause', partId)
        .then((record) => {
          EDIT.edit(record)
          return record
        })
        .then((row) => {
          TABLE.action.save(row.id, row)
          EDIT.cancel()
        }),
      'Msl back in cabinent',
      `Failed to put msl back into cabinent`
    )
  }

  const del = (partId: Pick<Floorlife, 'label_partId'>['label_partId']) => {
    TABLE.fetch.handleTableFetch(
      API('floorlifeDel', partId).then(() => {
        TABLE.util
          .findRecord('label_partId', partId.toString())
          .then(({ id }) => TABLE.action.del(id))
      }),
      `MSL deleted`,
      `Failed to delete MSL`
    )
  }

  const add = ({ partId }: Pick<LabelProps, 'partId'>) => {
    TABLE.fetch.handleTableFetch(
      API<Floorlife>('floorlifeAdd', partId).then(TABLE.action.add),
      `MSL added`,
      `Failed to add MSL`
    )
  }

  const save = async (
    partId: Pick<Floorlife, 'label_partId'>['label_partId']
  ) => {
    const { status } = await TABLE.util.findRecord(
      'label_partId',
      partId.toString()
    )

    if (status !== 'EXPIRING') {
      unPause(partId)
    } else {
      pause(partId)
    }
  }

  const FLOORLIFE_COLUMNS: ColumnType<Floorlife>[] = [
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
      sorter: (a, b) => (a.status as string).localeCompare(b.status as string),
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
          {value && record.status !== 'PAUSED' ? (
            <TimeColumn
              date={value}
              finished={{
                text: record.status === 'EXPIRING' ? 'EXPIRED' : 'RECOVERED',
                className:
                  record.status === 'EXPIRING'
                    ? 'column-error'
                    : 'column-success',
              }}
            />
          ) : (
            <div>NA</div>
          )}
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
            del: () => del(record.label_partId),
            message: 'Delete this MSL?',
          }}
          pause={{
            showIcon:
              new Date(record.availableAt).getTime() - Date.now() >= TIME.NOW ||
              record.status === 'PAUSED',
            isPaused: record.status !== 'EXPIRING',
            action: {
              pause: () => pause(record.label_partId),
              unPause: () => unPause(record.label_partId),
            },
            message: {
              pause: 'MSL back in cabinet?',
              unpause: 'MSL out of cabinet?',
            },
          }}
        />
      ),
    },
  ]

  return (
    <React.Fragment>
      <Form form={form} component={false}>
        <AntDTable
          dataSource={TABLE.records}
          onChange={TABLE.action.onChange as any}
          columns={EDIT.mergedEditWColumns(FLOORLIFE_COLUMNS)}
          rowKey={'id'}
          title={() => <TableHeader save={save} del={del} add={add} />}
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
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          pagination={{
            ...TABLE.pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              ` ${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </Form>
    </React.Fragment>
  )
}

export default FloorLifeTable
