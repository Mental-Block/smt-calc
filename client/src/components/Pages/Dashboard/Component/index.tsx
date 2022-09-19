// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */
import React from 'react'

import { Form, InputNumber, Select, Table as AntDTable } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { usePrivateApi } from '@API'

import { BREAK_POINTS, MSL_LEVEL_OPTIONS, PACKAGE_TYPE_OPTIONS } from '@const'

import Spin from '@components/shared/Spin'
import { EditableCell } from '@components/shared/Table'
import { ActionColumn } from '@components/shared/Table/Columns'

import type { ColumnType, TableProps } from '@interfaces/table'
import type { ComponentProps, PackageType } from '@interfaces/component'

import useAsyncComponentName from '@util/useAsyncComponentName'
import useTable, { useTableEdit, useColumnSearch } from '@util/useTable'

import TableHeader from './TableHeader'

const ComponentTable: React.FC<TableProps<ComponentProps>> = () => {
  const [form] = useForm<ComponentProps>()
  const EDIT = useTableEdit(form)

  const [value, setSearch] = React.useState('')
  const { options } = useAsyncComponentName(value)
  const API = usePrivateApi()

  const TABLE = useTable<ComponentProps>(
    [],
    undefined,
    (params) => API('componentAll', params),
    true
  )

  const save = async (id: Pick<ComponentProps, 'id'>['id']) => {
    const row = await EDIT.validateEdit()

    TABLE.fetch.handleTableFetch(
      API('componentSave', { ...row, id })
        .then(() => TABLE.action.save(id, row))
        .then(() => EDIT.cancel()),
      `Saved component.`,
      `Failed to save component.`
    )
  }

  const add = (values: Omit<ComponentProps, 'id'>) => {
    TABLE.fetch.handleTableFetch(
      API<ComponentProps>('componentAdd', values).then((record) =>
        TABLE.action.add(record)
      ),
      'Component added.',
      'Failed to add compoent.'
    )
  }

  const del = (id: Pick<ComponentProps, 'id'>['id']) => {
    TABLE.fetch.handleTableFetch(
      API('componentDel', id).then(() => TABLE.action.del(id)),
      `Component deleted.`,
      `Failed to deleted component.`
    )
  }

  const searchBar = useColumnSearch<ComponentProps>()
  const COMPONENT_COLUMNS: ColumnType<ComponentProps>[] = [
    {
      title: 'Part Number',
      dataIndex: 'partnumberInternal',
      key: 'partnumberInternal',
      ...searchBar('partnumberInternal', '213-00100'),
      editable: true,
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
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
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
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
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
      sorter: (a, b) => a.vendor.localeCompare(b.vendor),
    },
    {
      title: 'Component Type',
      dataIndex: 'name',
      key: 'name',
      editable: true,
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
      ellipsis: {
        showTitle: false,
      },
      inputNode: (
        <Select
          showSearch
          value={value}
          placeholder="select a component"
          defaultActiveFirstOption={false}
          showArrow={true}
          filterOption={false}
          onSearch={setSearch}
          listHeight={180}
          options={options}
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
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
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
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
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
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
    },
    {
      title: 'Package Type',
      dataIndex: 'packageType',
      key: 'packageType',
      editable: true,
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
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
              edit: () => EDIT.edit(record),
              save: () => save(record.id),
              cancel: () => EDIT.cancel(),
            },
            editable: EDIT.isEditing(record.id),
            disable: !!EDIT.editingKey,
            message: {
              save: 'Save this Component?',
            },
          }}
          del={{
            del: () => del(record.id),
            message: 'Delete this Component?',
          }}
        />
      ),
    },
  ]

  return (
    <React.Fragment>
      <Form form={form} component={false}>
        <AntDTable<ComponentProps>
          dataSource={TABLE.records}
          onChange={TABLE.action.onChange as any}
          columns={EDIT.mergedEditWColumns(COMPONENT_COLUMNS)}
          rowKey={'id'}
          title={() => <TableHeader add={add} />}
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
      </Form>
    </React.Fragment>
  )
}

export default ComponentTable
