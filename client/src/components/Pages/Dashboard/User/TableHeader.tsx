import React from 'react'
import { FormItemProps, Input, Select, Button } from 'antd'
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons'

import { FormModal } from '@components/shared/Table'
import { REGEX } from '@const'
import { UserDataProps } from '@interfaces/user'

import { isExistingUser, confirmPassword } from '@util/formRules'
import useModal from '@util/useModal'

const UsersTableHeader: React.FC<{
  add: (values: UserDataProps) => void
}> = ({ add }) => {
  const MODAL = useModal()

  const USER_ITEMS: FormItemProps<UserDataProps>[] = [
    {
      id: 'username',
      label: 'Username',
      name: 'username',
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
        {
          validator: async (_, username: string) =>
            await isExistingUser(username),
          message: `This account is already in use!`,
        },
      ],
      children: <Input placeholder="Your Username" />,
    },
    {
      id: 'role',
      label: 'Role',
      name: 'role',
      validateFirst: true,
      validateTrigger: 'onBlur',
      rules: [{ required: true, message: 'This is required!' }],
      tooltip: {
        title:
          'Giving the user permissions such as creating and deleting accounts.',
        icon: <InfoCircleOutlined />,
      },
      children: (
        <Select placeholder="Select A User Role">
          <Select.Option value="user">User</Select.Option>
          <Select.Option value="admin">Admin</Select.Option>
        </Select>
      ),
    },
    {
      id: 'password',
      label: 'Password',
      name: 'password',
      validateFirst: true,
      validateTrigger: 'onBlur',
      rules: [
        { required: true, message: 'Password is required!' },
        {
          min: 8,
          message: 'Password must be at least 8 characters long!',
        },
        {
          pattern: REGEX.password,
          message:
            'Password must have a lowercase, uppercase, special character',
        },
        {
          max: 100,
          message: 'Password cannot be longer than 100 characters!',
        },
      ],
      children: <Input.Password placeholder="Your Password" />,
    },
    {
      id: 'confirmPassword',
      label: 'Confirm Password',
      name: 'confirmPassword',
      validateFirst: true,
      validateTrigger: 'onBlur',
      rules: [
        { required: true, message: 'Confirm password is required!' },
        ({ getFieldValue }: any) => ({
          validator: async (_: any, value: string) => {
            await confirmPassword(getFieldValue('password'), value)
          },
          message: 'The two passwords that you entered do not match!',
        }),
      ],
      children: <Input.Password placeholder="Confirm Your Password" />,
    },
  ]

  return (
    <div className="flex-center-space">
      <Button type="primary" icon={<PlusOutlined />} onClick={MODAL.open}>
        Add
      </Button>
      <FormModal
        formItems={USER_ITEMS}
        onOk={add}
        onCancel={MODAL.close}
        visible={MODAL.visible}
      />
    </div>
  )
}

export default UsersTableHeader
