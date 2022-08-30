// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'

import { Form, InputNumber, Select, Table as AntDTable } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import {
  API,
  BREAK_POINTS,
  MSL_LEVEL_OPTIONS,
  PACKAGE_TYPE_OPTIONS,
} from '@const'
import AuthContext from '@context/AuthContext'

import Spin from '@components/shared/Spin'
import { EditableCell } from '@components/shared/Table'
import { ActionColumn } from '@components/shared/Table/Columns'

import { ColumnType, TableProps } from '@interfaces/table'
import { ComponentProps, PackageType } from '@interfaces/component'

import useTable, { useTableEdit, useColumnSearch } from '@util/useTable'
import useSearchDropDown from '@util/useSearchDropDown'
import useComponentType from '@util/useComponentType'

import TableHeader from './TableHeader'
import { FetchError } from '@interfaces/fetch'

const Table: React.FC<TableProps<ComponentProps>> = ({
  records,
  pageLength,
}) => {
  const { auth } = React.useContext(AuthContext)
  const [form] = useForm<ComponentProps>()

  const { componentTypeCB, options } = useComponentType()
  const search = useSearchDropDown(componentTypeCB, options)

  const edit = useTableEdit(form)
  const searchBar = useColumnSearch<ComponentProps>()
  const table = useTable<ComponentProps>(
    records,
    { pageSize: 10, current: 1, total: pageLength },
    {
      url: `${API.COMPONENT}`,
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

  const save = React.useCallback(
    async (id: number, row: Partial<ComponentProps>): Promise<FetchError> => {
      const res = await fetch(`${API.COMPONENT}/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'PATCH',
        body: JSON.stringify(row),
      })

      if (!res.ok) throw new Error(`Failed to save component.`)

      return { message: 'Saved component.' }
    },
    [auth.accessToken]
  )

  const add = React.useCallback(
    async (
      values: Partial<ComponentProps>
    ): Promise<ComponentProps & FetchError> => {
      const res = await fetch(`${API.COMPONENT}/add`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error(`Failed to add component.`)

      const data: ComponentProps = await res.json()

      return {
        ...data,
        message: `Component Added.`,
      }
    },
    [auth.accessToken]
  )

  const del = React.useCallback(
    async (id: number): Promise<FetchError> => {
      const res = await fetch(`${API.COMPONENT}/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'DELETE',
      })

      if (!res.ok) throw new Error(`Failed to deleted component.`)

      return { message: `Component deleted.` }
    },
    [auth.accessToken]
  )

  const COMPONENT_COLUMNS: ColumnType<ComponentProps>[] = React.useMemo(
    () => [
      {
        title: 'Part Number',
        dataIndex: 'partnumberInternal',
        key: 'partnumberInternal',
        ...searchBar('partnumberInternal', '213-00100'),
        editable: true,
        ellipsis: {
          showTitle: false,
        },
        sorter: (a, b) =>
          a.partnumberInternal.localeCompare(b.partnumberInternal),
      },
      {
        title: 'Manufactor Part Number',
        dataIndex: 'partnumberManufactor',
        key: 'partnumberManufactor',
        ...searchBar('partnumberManufactor', 'X727322ND11FG3'),
        ellipsis: {
          showTitle: false,
        },
        editable: true,
        sorter: (a, b) =>
          a.partnumberManufactor.localeCompare(b.partnumberManufactor),
      },
      {
        title: 'Vendor',
        dataIndex: 'vendor',
        key: 'vendor',
        ...searchBar('vendor', 'texas instruments'),
        ellipsis: {
          showTitle: false,
        },
        editable: true,
        sorter: (a, b) => a.vendor.localeCompare(b.vendor),
      },
      {
        title: 'Component Type',
        dataIndex: 'name',
        key: 'name',
        editable: true,
        ellipsis: {
          showTitle: false,
        },
        inputNode: (
          <Select
            showSearch
            value={search.value}
            placeholder="select a component"
            defaultActiveFirstOption={false}
            showArrow={true}
            filterOption={false}
            onSearch={search.onSearch}
            listHeight={180}
            options={!search.value.trim() ? options : search.options}
          />
        ),
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...searchBar('name', 'BGA (Ball Grid Array)'),
      },
      {
        title: 'Package Body Thickness',
        dataIndex: 'bodyThickness',
        key: 'bodyThickness',
        editable: true,
        ellipsis: {
          showTitle: false,
        },
        inputNode: <InputNumber style={{ width: '100%' }} min={0} />,
        sorter: (a, b) => a.bodyThickness - b.bodyThickness,
        ...searchBar('bodyThickness', '2.4'),
      },
      {
        title: 'Pin Count',
        dataIndex: 'pinCount',
        key: 'pinCount',
        editable: true,
        ellipsis: {
          showTitle: false,
        },
        inputNode: <InputNumber style={{ width: '100%' }} min={0} />,
        sorter: (a, b) => a.pinCount - b.pinCount,
        ...searchBar('pinCount', '2'),
      },
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
        title: 'Package Type',
        dataIndex: 'packageType',
        key: 'packageType',
        editable: true,
        ellipsis: {
          showTitle: false,
        },
        inputNode: (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="select types"
            options={PACKAGE_TYPE_OPTIONS.map((item) => ({
              value: item,
              text: item,
            }))}
          />
        ),
        onFilter: (value, record): boolean =>
          record.packageType.includes(value as PackageType) ? true : false,
        filters: PACKAGE_TYPE_OPTIONS.map((level) => ({
          text: level,
          value: level,
        })),
        render: (text, record) => (
          <div>
            {record.packageType.length >= 1
              ? (record.packageType as unknown as PackageType[]).join(' ')
              : text}
          </div>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: {
          showTitle: false,
        },
        editable: true,
        ...searchBar('description', 'CAP, CER, 10U, Ect...'),
      },
      {
        title: 'Actions',
        key: 'action',
        dataIndex: 'action',
        className: 'flex-center-center',
        width: '125px',
        render: (_: any, record) => (
          <ActionColumn
            edit={{
              action: {
                edit: () => edit.edit(record),
                save: () => {
                  table.action.save(record.id, form, save)
                  edit.cancelEdit()
                },
                cancel: () => edit.cancelEdit(),
              },
              editable: edit.isEditing(record.id),
              disable: !!edit.editingKey,
              message: {
                save: 'Save this Component?',
              },
            }}
            del={{
              del: () => table.action.del(record.id, del),
              message: 'Delete this Component?',
            }}
          />
        ),
      },
    ],
    [
      searchBar,
      save,
      del,
      edit,
      form,
      table,
      search.onSearch,
      search.value,
      search.options,
      options,
    ]
  )

  return (
    <React.Fragment>
      <Form form={form} component={false}>
        <AntDTable<ComponentProps>
          dataSource={table.records}
          onChange={table.action.onChange as any}
          columns={edit.mergedEditWColumns(COMPONENT_COLUMNS)}
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
          components={{
            body: {
              cell: EditableCell,
            },
          }}
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
      </Form>
    </React.Fragment>
  )
}

export default Table
