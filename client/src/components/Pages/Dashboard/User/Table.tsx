// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/display-name */

import React from 'react'
import { Form, Select, Table } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { API, BREAK_POINTS, REGEX, ROLE_OPTIONS } from '@const'

import { EditableCell } from '@components/shared/Table'
import { ActionColumn } from '@components/shared/Table/Columns'
import Spin from '@components/shared/Spin'

import { UserDataProps } from '@interfaces/user'
import { ColumnType, TableProps } from '@interfaces/table'
import { FetchError } from '@interfaces/fetch'

import { isChangeUsername } from '@util/formRules'
import useTable, { useTableEdit, useColumnSearch } from '@util/useTable'

import AuthContext from '@context/AuthContext'

import TableHeader from './TableHeader'

const UsersTable: React.FC<TableProps<UserDataProps>> = ({
  records,
  pageLength,
}) => {
  const { auth } = React.useContext(AuthContext)
  const [form] = useForm<UserDataProps>()
  const edit = useTableEdit<UserDataProps>(form)
  const searchBar = useColumnSearch<UserDataProps>()
  const table = useTable<UserDataProps>(
    records,
    { pageSize: 10, current: 1, total: pageLength },
    {
      url: `${API.USER}`,
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
    async (id: number, row: Partial<UserDataProps>): Promise<FetchError> => {
      const res = await fetch(`${API.USER}/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'PATCH',
        body: JSON.stringify(row),
      })

      if (!res.ok) throw new Error(`Failed to save user.`)

      return { message: `Saved User.` }
    },
    [auth.accessToken]
  )

  const add = React.useCallback(
    async (
      values: Partial<UserDataProps>
    ): Promise<UserDataProps & FetchError> => {
      const res = await fetch(`${API.USER}/register`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(values),
      })

      if (!res.ok) throw new Error(`Failed to add user.`)

      const data: UserDataProps = await res.json()

      return {
        ...data,
        message: `User Added.`,
      }
    },
    [auth.accessToken]
  )

  const del = React.useCallback(
    async (id: number): Promise<FetchError> => {
      const res = await fetch(`${API.USER}/${id}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authorization: `bearer ${auth.accessToken}`,
        },
        credentials: 'include',
        method: 'DELETE',
      })

      if (!res.ok) throw new Error(`Failed to deleted user.`)

      return { message: `User deleted.` }
    },
    [auth.accessToken]
  )

  const USER_COLUMNS: ColumnType<UserDataProps>[] = React.useMemo(
    () => [
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
              validator: async (
                _: any,
                value: Pick<UserDataProps, 'username'>
              ) => await isChangeUsername(parseInt(getFieldValue('id')), value),
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
        render: (_, record) => (
          <ActionColumn
            edit={{
              action: {
                edit: () =>
                  edit.edit(record, {
                    role: record.role,
                    username: record.username,
                  }),
                save: () => {
                  table.action.save(record.id, form, save)
                  edit.cancelEdit()
                },
                cancel: () => edit.cancelEdit(),
              },
              editable: edit.isEditing(record.id),
              disable: !!edit.editingKey,
              message: {
                save: 'Save this user?',
              },
            }}
            del={{
              del: () => table.action.del(record.id, del),
              message: 'Delete this user?',
            }}
          />
        ),
      },
    ],
    [searchBar, edit, del, save, form, table]
  )

  return (
    <React.Fragment>
      <Form form={form} component={false}>
        <Table<UserDataProps>
          dataSource={table.records}
          onChange={table.action.onChange as any}
          columns={edit.mergedEditWColumns(USER_COLUMNS)}
          pagination={{
            ...table.pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              ` ${range[0]}-${range[1]} of ${total} items`,
          }}
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
            indicator: <Spin />,
          }}
        />
      </Form>
    </React.Fragment>
  )
}

export default UsersTable
