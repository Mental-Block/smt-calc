import React from 'react'
import { Form, Select, Table as AntDTable } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { BREAK_POINTS, REGEX, ROLE_OPTIONS } from '@const'

import { EditableCell } from '@components/shared/Table'
import Spin from '@components/shared/Spin'
import { ActionColumn } from '@components/shared/Table/Columns'

import type { UserDataProps, UserProps } from '@interfaces/user'
import type { ColumnType, TableProps } from '@interfaces/table'

import { isChangeUsername } from '@util/formRules'
import useTable, { useColumnSearch, useTableEdit } from '@util/useTable'

import UsersTableHeader from './TableHeader'

import { usePrivateApi } from '@API'

const UserTable: React.FC = () => {
  const [form] = useForm<UserDataProps>()
  const EDIT = useTableEdit(form)
  const API = usePrivateApi()

  const TABLE = useTable<UserDataProps>(
    [],
    undefined,
    (params) => API<TableProps<UserDataProps>>('userAll', params),
    true
  )

  const save = async (id: Pick<UserDataProps, 'id'>['id']) => {
    const row = await EDIT.validateEdit()

    TABLE.fetch.handleTableFetch(
      API('userSave', { ...row, id })
        .then(() => TABLE.action.save(id, row))
        .then(() => EDIT.cancel()),
      `Saved User.`,
      `Failed to save user.`
    )
  }

  const add = (values: UserProps) => {
    TABLE.fetch.handleTableFetch(
      API<UserDataProps>('userAdd', values).then((record) =>
        TABLE.action.add(record)
      ),
      'User Added.',
      'Failed to add user.'
    )
  }

  const del = (id: Pick<UserDataProps, 'id'>['id']) => {
    TABLE.fetch.handleTableFetch(
      API('userDel', id).then(() => TABLE.action.del(id)),
      `User deleted.`,
      `Failed to deleted user.`
    )
  }

  const searchBar = useColumnSearch<UserDataProps>()
  const USER_COLUMNS: ColumnType<UserDataProps>[] = [
    {
      title: 'UID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: '100px',
      ...searchBar('id', '8'),
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      formItem: {
        style: { margin: 0 },
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [
          {
            pattern: REGEX.numbersLetter,
            message: 'Username can only have letters and numbers!',
          },
          { required: true, message: 'Username is required!' },
          {
            max: 20,
            message: 'Username cannot be longer than 20 characters!',
          },
          ({ getFieldValue }: any) => ({
            validator: async (_: any, value: Pick<UserDataProps, 'username'>) =>
              await isChangeUsername(parseInt(getFieldValue('id')), value),
            message: 'This account is already in use!',
          }),
        ],
      },
      sorter: (a, b) => a.username.localeCompare(b.username),
      editable: true,
      ...searchBar('username', 'John Doe'),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: ROLE_OPTIONS.map((value) => ({
        value: value,
        text: value,
      })),
      inputNode: (
        <Select
          placeholder="Allow Admin Access"
          options={ROLE_OPTIONS.map((value) => ({
            value: value,
            label: value,
          }))}
        />
      ),
      formItem: {
        rules: [{ required: true, message: 'This is required!' }],
      },
      sorter: (a, b) => a.role.localeCompare(b.role),
      onFilter: (value, record): boolean => record.role === value,
      editable: true,
    },
    {
      title: 'Actions',
      key: 'action',
      dataIndex: 'action',
      className: 'flex-center-center',
      width: '125px',
      // eslint-disable-next-line react/display-name
      render: (_, record) => (
        <ActionColumn
          edit={{
            action: {
              edit: () => EDIT.edit(record),
              save: () => save(record.id),
              cancel: EDIT.cancel,
            },
            editable: EDIT.isEditing(record.id),
            disable: !!EDIT.editingKey,
            message: {
              save: 'Save this user?',
            },
          }}
          del={{
            del: () => del(record.id),
            message: 'Delete this user?',
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
          columns={EDIT.mergedEditWColumns(USER_COLUMNS)}
          rowKey={'id'}
          title={() => <UsersTableHeader add={add} />}
          className="page"
          bordered={true}
          showHeader={true}
          sticky={true}
          tableLayout={'fixed'}
          scroll={{ x: BREAK_POINTS.md }}
          size={BREAK_POINTS.md ? 'middle' : 'small'}
          pagination={{
            ...TABLE.pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              ` ${range[0]}-${range[1]} of ${total} items`,
          }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          loading={{
            delay: 200,
            spinning: TABLE.fetch.isLoading,
            indicator: <Spin />,
          }}
        />
      </Form>
    </React.Fragment>
  )
}

export default UserTable
