import { Divider, Space, Input, Button } from 'antd'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import React from 'react'
import { DropDownProps } from '@interfaces/dropdown'

const DropDown: React.FC<DropDownProps> = ({
  add,
  del,
  inputProps,
  children,
}) => {
  return (
    <React.Fragment>
      {children}
      <Divider style={{ margin: '8px 0' }} />
      <Space
        className="flex-center-space"
        align="center"
        style={{ width: '100%', padding: '0 8px 4px' }}
      >
        <Input {...inputProps} />
        <Space>
          <Button
            onClick={add}
            style={{ whiteSpace: 'nowrap' }}
            type="dashed"
            icon={<PlusOutlined />}
          >
            Add
          </Button>
          <Button
            onClick={del}
            style={{ whiteSpace: 'nowrap' }}
            type="dashed"
            icon={<MinusOutlined />}
          >
            Delete
          </Button>
        </Space>
      </Space>
    </React.Fragment>
  )
}

export default DropDown
