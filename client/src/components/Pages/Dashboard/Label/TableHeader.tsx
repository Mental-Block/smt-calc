import React from 'react'
import { Button, Form, FormItemProps, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { REGEX } from '@const'
import { FormModal } from '@components/shared/Table'

import { usePrivateApi } from '@API'
import useModal from '@util/useModal'
import { isWholeNumber } from '@util/formRules'
import useFocus from '@util/useFocus'
import useBarcodeScanner from '@util/useBarcodeScanner'

import type { ComponentProps } from '@interfaces/component'
import type { LabelProps } from '@interfaces/label'

interface TableHeaderProps {
  add: (values: any) => void
}

type ManufactorPartnumber = Pick<ComponentProps, 'partnumberManufactor'>

const TableHeader: React.FC<TableHeaderProps> = ({ add }) => {
  const [form] = Form.useForm()
  const API = usePrivateApi()
  const { visible, close, open } = useModal()
  const [inputRef, setFocus] = useFocus()
  const [inputRef1, setFocus1] = useFocus()
  const barcode = useBarcodeScanner()

  const [hideInput, setHideInput] = React.useState(true)
  const [options, setOptions] = React.useState<ManufactorPartnumber[]>([])

  React.useEffect(() => {
    if (inputRef) setFocus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, inputRef])

  React.useEffect(() => {
    if (barcode) {
      open()
    }
  }, [barcode, open])

  const isOnlyInternalPartNumber = async (
    partnumberManufactor: string | undefined,
    partnumber_internal: string
  ) => {
    await API<ManufactorPartnumber[]>(
      'internalPartNumConflict',
      partnumber_internal
    )
      .then((data) => {
        if (data.length > 1 && !partnumberManufactor) {
          setHideInput(false)
          setOptions(data)
          throw 'Theres a part number conflict. Please specify.'
        }

        form.setFieldsValue({
          partnumberManufactor: data[0].partnumberManufactor,
        })
        setHideInput(true)
        return Promise.resolve(true)
      })
      .catch((err) => Promise.reject(err))
  }

  const LABEL_ITEMS: FormItemProps<LabelProps>[] = [
    {
      label: 'Part UUId',
      id: 'partId',
      name: 'partId',
      validateFirst: true,
      validateTrigger: 'onBlur',
      rules: [
        { required: true, message: 'Part uuid is required!' },
        {
          validator: isWholeNumber,
          message: 'Needs to be a valid uuid',
        },
      ],
      children: (
        <Input
          ref={inputRef}
          onPressEnter={setFocus1}
          onChange={() => {
            if (barcode) setFocus1()
          }}
          placeholder="31234213123432"
        />
      ),
    },
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
        ({ getFieldValue }: any) => ({
          validator: async (_: any, value: string) => {
            await isOnlyInternalPartNumber(
              getFieldValue('partnumberManufactor'),
              value
            )
          },
        }),
      ],
      children: (
        <Input
          ref={inputRef1}
          onChange={() => {
            if (form.getFieldValue('partnumberManufactor')) {
              form.setFieldsValue({ partnumberManufactor: undefined })
              setOptions([])
            }
          }}
          placeholder="20-00220"
        />
      ),
    },
    {
      id: 'partnumberManufactor',
      name: 'partnumberManufactor',
      label: 'Manufactor Part Number',
      validateFirst: true,
      validateTrigger: 'onSelect',
      hidden: hideInput,
      requiredMark: true,
      rules: [
        {
          required: false,
          message: 'Manufactor part number is required!',
        },
        {
          pattern: REGEX.partNumber,
          message: 'Needs to be a valid manufactor part number!',
        },
      ],
      children: (
        <Select
          onChange={() => {
            setHideInput(true)
            setFocus1()
          }}
          options={options.map(({ partnumberManufactor }) => ({
            text: partnumberManufactor,
            value: partnumberManufactor,
          }))}
          placeholder={'Select Manufactor Part Number'}
        />
      ),
    },
  ]
  return (
    <div className="flex-center-space">
      <Button type="primary" icon={<PlusOutlined />} onClick={open}>
        Add
      </Button>
      <FormModal
        formItems={LABEL_ITEMS}
        onOk={add}
        onCancel={close}
        visible={visible}
        form={form}
      />
    </div>
  )
}

export default TableHeader
