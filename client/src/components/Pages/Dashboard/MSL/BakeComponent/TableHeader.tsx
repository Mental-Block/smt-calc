import React from 'react'
import { Button, FormItemProps, Input, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { FormModal } from '@components/shared/Table'

import useModal from '@util/useModal'
import { LabelProps } from '@interfaces/label'
import { REGEX } from '@const'

const TableHeader: React.FC<any> = ({ add }) => {
  const { visible, close, open } = useModal()

  const BAKING_ITEMS: FormItemProps<LabelProps>[] = [
    {
      id: 'partnumberInternal',
      name: 'partnumberInternal',
      label: 'Part Number',
      validateFirst: true,
      validateTrigger: ['onBlur'],
      rules: [
        { required: true, message: 'Part number is required!' },
        {
          pattern: REGEX.partNumber,
          message: 'Needs to be a valid part number!',
        },
        //   ({ getFieldValue }: any) => ({
        //     validator: async (_: any, value: string) => {
        //       await getManufactorPartData(
        //         getFieldValue('partnumberManufactor'),
        //         value
        //       )
        //     },
        //   }),
      ],
      children: <Input placeholder="20-00220" />,
    },
    // {
    //   id: 'partnumberManufactor',
    //   name: 'partnumberManufactor',
    //   label: 'Manufactor Part Number',
    //   validateFirst: true,
    //   validateTrigger: 'onSelect',
    //   requiredMark: true,
    //   rules: [
    //     {
    //       required: false,
    //       message: 'Manufactor part number is required!',
    //     },
    //     {
    //       pattern: REGEX.partNumber,
    //       message: 'Needs to be a valid manufactor part number!',
    //     },
    //   ],
    //   children: (
    //     <Select
    //       options={options.map(({ partnumberManufactor }) => ({
    //         text: partnumberManufactor,
    //         value: partnumberManufactor,
    //       }))}
    //       placeholder={'Select Manufactor Part Number'}
    //     />
    //   ),
    // },
  ]

  return (
    <div>
      <Typography.Text
        style={{ marginTop: '20px' }}
        strong={true}
        className="flex-center-center"
      >
        {
          'Table 4-1 & 4-3 Reference Conditions for Drying Mounted or Unmounted SMD Packages'
        }
      </Typography.Text>
      <Button type="primary" icon={<PlusOutlined />} onClick={open}>
        Add
      </Button>
      <FormModal
        formItems={BAKING_ITEMS}
        onOk={add}
        onCancel={close}
        visible={visible}
      />
    </div>
  )
}

export default TableHeader
