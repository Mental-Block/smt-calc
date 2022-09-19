import React from 'react'

import { Form, Button, Input, Card, FormItemProps } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import useAuth from '@util/useAuth'
import useGenerateId from '@util/useGenerateId'

import { LoginProps } from '@interfaces/user'

const LoginPage: React.FC = (): JSX.Element => {
  const { login } = useAuth()
  const [form] = Form.useForm()
  const generateId = useGenerateId()

  const onFinish = async (values: LoginProps) => {
    await login(values).catch((err) => {
      Object.keys(values).map((name) => {
        form.setFields([
          {
            name,
            value: form.getFieldValue(name),
            errors: [err],
          },
        ])
      })
    })
  }

  const formItems: FormItemProps<LoginProps>[] = [
    {
      label: 'Username',
      name: 'username',
      validateFirst: true,
      validateTrigger: 'onBlur',
      rules: [{ required: true, message: 'Username is required!' }],
      children: (
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Jdoe"
          type="text"
        />
      ),
    },
    {
      label: 'Password',
      name: 'password',
      validateFirst: true,
      validateTrigger: 'onBlur',
      rules: [{ required: true, message: 'Password is required!' }],
      children: (
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Example123!"
          type="password"
        />
      ),
    },
  ]

  return (
    <div className="page-center">
      <Card bordered size="default" className="login-form">
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          name={generateId('login')}
        >
          {formItems.map((item, id) => (
            <Form.Item key={id} {...item}>
              {item.children}
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage
