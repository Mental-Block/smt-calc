import { Card, Form, FormItemProps, InputNumber, Space, Typography } from 'antd'
import { EditFilled } from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import React from 'react'

import { API } from '@const'
import AuthContext from '@context/AuthContext'
import { SettingsProps, SettingsDataProps } from '@interfaces/settings'
import useGenerateId from '@util/useGenerateId'
import useEdit from '@util/useEdit'
import { isWholeNumber } from '@util/formRules'
import { WithRequired } from '@interfaces/util'

const SettingsForm: React.FC<SettingsDataProps> = (record): JSX.Element => {
  const [form] = useForm()
  const edit = useEdit(form)
  const generateId = useGenerateId()
  const { auth } = React.useContext(AuthContext)
  const [setting, setSettingValue] = React.useState(record)

  const formItems: WithRequired<FormItemProps<SettingsProps>, 'name'>[] = [
    {
      id: 'tempature',
      label: 'Tempature °C',
      name: 'tempature',
      initialValue: setting.tempature,
      children: <InputNumber style={{ width: '100%' }} min={0} max={100} />,
      rules: [
        {
          required: true,
          message: 'Tempature is required',
        },
        {
          validator: isWholeNumber,
          message: 'Needs to be a whole number!',
        },
      ],
    },
    {
      id: 'humidity',
      label: 'Humidity RH%',
      name: 'humidity',
      initialValue: setting.humidity,
      children: <InputNumber style={{ width: '100%' }} min={0} max={100} />,
      rules: [
        {
          required: true,
          message: 'Humidity is required',
        },
        {
          validator: isWholeNumber,
          message: 'Needs to be a whole number!',
        },
      ],
    },
  ]

  const onFinish = async (value: SettingsDataProps) => {
    const newItem = {
      ...setting,
      ...value,
    }

    setSettingValue(newItem)

    await fetch(`${API.SETTINGS}/save`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `bearer ${auth.accessToken}`,
      },
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify(newItem),
    })

    edit.cancelEdit()
  }

  return (
    <React.Fragment>
      <Card title="Factory Settings" className="settings-form">
        <Form
          preserve={false}
          scrollToFirstError={true}
          layout="inline"
          name={generateId('settingsForm')}
          form={form}
          onFinish={onFinish}
          colon={false}
          requiredMark={false}
        >
          {formItems.map((item, key) => (
            <Form.Item key={key} style={{ marginBottom: '8px', width: '100%' }}>
              {edit.editingKey === item.id ? (
                <Space
                  style={{ whiteSpace: 'nowrap', width: '100%' }}
                  className="flex-center-space"
                  size={'small'}
                >
                  <Typography.Text>{item.label}</Typography.Text>
                  <Form.Item
                    {...item}
                    style={{
                      display: 'inline-block',
                      height: '32px',
                      marginRight: 0,
                      gap: 0,
                    }}
                    label=""
                  />
                  <Typography.Link
                    style={{ display: 'inline-block' }}
                    onClick={() => form.submit()}
                  >
                    Save
                  </Typography.Link>
                  <Typography.Link
                    style={{ display: 'inline-block' }}
                    onClick={() => edit.cancelEdit()}
                  >
                    Cancel
                  </Typography.Link>
                </Space>
              ) : (
                <Space style={{ width: '100%' }} className="flex-center-space">
                  {item.label}
                  {item.initialValue}
                  <Typography.Link
                    disabled={!!edit.editingKey}
                    onClick={() => {
                      edit?.edit({ ...record, id: item.id as string })
                    }}
                  >
                    <EditFilled />
                  </Typography.Link>
                </Space>
              )}
            </Form.Item>
          ))}
        </Form>
      </Card>
    </React.Fragment>
  )
}

export default SettingsForm
