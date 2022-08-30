// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'
import { Input, Select, Table as AntDTable } from 'antd'

import { API, BREAK_POINTS, MSL_LEVEL_OPTIONS } from '@const'

import AuthContext from '@context/AuthContext'

import useTable, { useColumnSearch } from '@util/useTable'

import { ColumnType, TableProps } from '@interfaces/table'
import { FetchError } from '@interfaces/fetch'

import { TimeColumn } from '@components/shared/Table'
import Spin from '@components/shared/Spin'

import TableHeader from './TableHeader'
import { ActionColumn } from '@components/shared/Table/Columns'
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

  const table = useTable<Floorlife>(
    records,
    { pageSize: 10, current: 1, total: pageLength },
    {
      url: `${API.BAKE_COMPONENT}`,
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
    async (values: Partial<Floorlife>): Promise<Floorlife & FetchError> => {
      const res = await fetch(`${API.FLOORLIFE}/add`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(values),
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

  /* 
  2, 2a, 3, 4, 5, 5a Anytime ≤40°C/85% RH

  2, 2a, 3, 4, 5, 5a > floor life ≤30°C/60% RH
  
  2, 2a, 3 >12 hrs ≤30°C/60% RH
  
  4, 5, 5a >8 hrs ≤30°C/60% RH
  
  
  
  
  */

  // msllevel
  // finished time
  //

  const BAKING_COLUMNS: ColumnType<Floorlife>[] = React.useMemo(
    () => [
      {
        title: 'MSL Level',
        dataIndex: 'mslLevel',
        key: 'mslLevel',
        ellipsis: {
          showTitle: false,
        },
        inputNode: (
          <Select
            style={{ width: '100%' }}
            placeholder="select a level"
            options={MSL_LEVEL_OPTIONS.map((level) => ({
              label: level,
              value: level,
            }))}
          />
        ),
        filters: MSL_LEVEL_OPTIONS.map((level) => ({
          text: level,
          value: level,
        })),
        sorter: (a, b) =>
          (a.mslLevel as string).localeCompare(b.mslLevel as string),
        onFilter: (value, record): boolean => record.mslLevel === value,
        editable: true,
      },
      {
        title: 'Finished Time',
        key: 'availableAt',
        ellipsis: true,
        dataIndex: 'availableAt',
        ...searchBar('availableAt', '20/0/2023'),
        sorter: (a, b) => a.availableAt - b.availableAt,
        editable: true,
        inputNode: <Input />,
        render: (value): JSX.Element => (
          <React.Fragment>
            {value ? (
              <TimeColumn
                date={value}
                finishedStatus={'success'}
                finishedText={'FINISHED'}
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
              del: () => table.action.del(record.id, del),
              message: 'Delete this from baking?',
            }}
          />
        ),
      },
    ],
    [searchBar, table, del]
  )

  return (
    <React.Fragment>
      <AntDTable
        dataSource={[...table.records]}
        onChange={table.action.onChange as any}
        columns={BAKING_COLUMNS}
        rowKey={'id'}
        title={() => (
          <TableHeader
            add={(values: Partial<Floorlife>) => table.action.add(values, add)}
          />
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
