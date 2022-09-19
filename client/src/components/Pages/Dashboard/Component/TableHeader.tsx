import React from 'react'
import {
  Button,
  FormItemProps,
  Input,
  InputNumber,
  message,
  Select,
} from 'antd'
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import { REGEX, MSL_LEVEL_OPTIONS, PACKAGE_TYPE_OPTIONS } from '@const'

import { DropDown } from '@components/shared/Form'
import { FormModal } from '@components/shared/Table'

import useModal from '@util/useModal'
import { isWholeNumber } from '@util/formRules'
import { useDropDown } from '@util/useDropDown'

import type { OptionType } from '@interfaces/form'
import type { ComponentProps } from '@interfaces/component'

import { usePrivateApi } from '@API'
import useAsyncComponentName from '@util/useAsyncComponentName'

interface TableHeaderProps {
  add: (values: Omit<ComponentProps, 'id'>) => void
}

const TableHeader: React.FC<TableHeaderProps> = ({ add }) => {
  const { visible, close, open } = useModal()
  const [value, setSearch] = React.useState<string>('')
  const API = usePrivateApi()

  const { options } = useAsyncComponentName(value)
  const dropdown = useDropDown(options)

  const addName = React.useCallback(
    async (value: string): Promise<void> => {
      await API<OptionType>('componentNameAdd', value)
        .then(dropdown.add)
        .catch((error: string) => {
          message.error({ content: error })
        })
    },
    [API, dropdown]
  )

  const delName = React.useCallback(
    async (value: string) => {
      await dropdown
        .getOption(value)
        .then(({ id }) => {
          API('componentNameDel', id)
          dropdown.del(id)
        })
        .catch((error: string) => {
          message.error({ content: error })
        })
    },
    [dropdown, API]
  )

  const COMPONENT_ITEMS: FormItemProps<ComponentProps>[] = React.useMemo(
    () => [
      {
        id: 'partnumberInternal',
        name: 'partnumberInternal',
        label: 'Part Number',
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [
          { required: true, message: 'Part number is required!' },
          {
            pattern: REGEX.partNumber,
            message: 'Needs to be a valid part number!',
          },
        ],
        children: <Input placeholder="20-00220" />,
      },
      {
        id: 'partnumberManufactor',
        name: 'partnumberManufactor',
        label: 'Manufactor Part Number',
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [
          { required: true, message: 'Manufactor part number is required!' },
          {
            pattern: REGEX.partNumber,
            message: 'Needs to be a valid manufactor part number!',
          },
        ],
        children: <Input placeholder="CL05A106MQ5NuNC" />,
      },
      {
        id: 'vendor',
        name: 'vendor',
        label: 'Vendor',
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [{ required: true, message: 'vendor is required!' }],
        children: <Input placeholder="texas instruments" />,
      },
      {
        id: 'name',
        name: 'name',
        label: 'Component Type',
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [{ required: true, message: 'Component type is required!' }],
        children: (
          <Select
            showSearch
            onSearch={setSearch}
            value={value}
            placeholder="select a package"
            defaultActiveFirstOption={false}
            showArrow={true}
            filterOption={false}
            listHeight={180}
            dropdownRender={(menu) => (
              <DropDown
                inputProps={{
                  style: { width: '268px' },
                  placeholder: 'BGA (Ball Grid Array)',
                  value: dropdown.value,
                  onChange: dropdown.onChange,
                }}
                add={() => addName(dropdown.value)}
                del={() => delName(dropdown.value)}
              >
                {menu}
              </DropDown>
            )}
          >
            {dropdown.options.map(({ id, value, text }) => (
              <Select.Option key={id} value={value}>
                {text}
              </Select.Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'mslLevel',
        name: 'mslLevel',
        label: 'MSL Code',
        tooltip: {
          title: 'The moisture sensitivity level. Following JEDEC J-STD-020',
          icon: <QuestionCircleOutlined />,
        },
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [{ required: true, message: 'MSL code is required!' }],
        children: (
          <Select
            placeholder="select a level"
            options={MSL_LEVEL_OPTIONS.map((level) => ({
              value: level,
              text: level,
            }))}
          />
        ),
      },
      {
        id: 'packageType',
        name: 'packageType',
        label: 'Package Type',
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [{ required: true, message: 'Package type is required!' }],
        children: (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="select type"
            options={PACKAGE_TYPE_OPTIONS.map((item) => ({
              value: item,
              text: item,
            }))}
          />
        ),
      },
      {
        id: 'bodyThickness',
        name: 'bodyThickness',
        label: 'Package Body Thickness',
        tooltip: {
          title: 'The thickness of the component in mm.',
          icon: <QuestionCircleOutlined />,
        },
        validateFirst: true,
        validateTrigger: 'onBlur',
        rules: [{ required: true, message: 'Package Body is required!' }],
        children: <InputNumber placeholder="2.4" />,
      },
      {
        id: 'pinCount',
        name: 'pinCount',
        label: 'Pin Count',
        validateFirst: true,
        validateTrigger: 'onBlur',
        initialValue: 0,
        rules: [
          { required: true, message: 'Pin Count is required!' },
          {
            validator: isWholeNumber,
            message: 'Needs to be a whole number!',
          },
        ],
        children: <InputNumber min={0} placeholder="0" />,
      },
      {
        id: 'description',
        name: 'description',
        label: 'Description',
        validateFirst: true,
        validateTrigger: 'onBlur',
        children: (
          <Input.TextArea
            showCount
            maxLength={250}
            rows={4}
            placeholder="CAP, CER, 10U, 6V3, 20%, X5R, 0402"
          />
        ),
      },
    ],
    [value, setSearch, dropdown, addName, delName]
  )

  return (
    <div className="flex-center-space">
      <Button type="primary" icon={<PlusOutlined />} onClick={open}>
        Add
      </Button>
      <FormModal
        formItems={COMPONENT_ITEMS}
        onOk={add}
        onCancel={close}
        visible={visible}
      />
    </div>
  )
}

export default TableHeader
