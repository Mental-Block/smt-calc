import React from 'react'
import {
  Button,
  FormItemProps,
  Input,
  InputRef,
  Modal,
  Select,
  Space,
  Typography,
} from 'antd'
import { PlusOutlined, PrinterFilled } from '@ant-design/icons'

import { FormModal } from '@components/shared/Table'

import useModal from '@util/useModal'
import { isWholeNumber } from '@util/formRules'
import { LabelProps } from '@interfaces/label'
import useBarcodeScanner from '@util/useBarcodeScanner'

type Mode = 'add' | 'del' | 'save' | undefined

const TableHeader: React.FC<any> = ({ add, del, save }) => {
  const inputRef = React.useRef<InputRef>(null)
  const [modal] = Modal.useModal()
  const [mode, setAction] = React.useState<Mode>(undefined)
  const barcode = useBarcodeScanner(inputRef)

  const setMode = (value: Mode) => {
    setAction(value)
  }

  React.useEffect(() => {
    if (barcode && mode) {
      switch (mode) {
        case 'add':
          modal.confirm({
            onOk: add({ partId: parseInt(barcode) }),
          })
          break
        case 'del':
          modal.confirm({
            onOk: del(parseInt(barcode)),
          })
          break
        case 'save':
          modal.confirm({
            onOk: save(parseInt(barcode)),
          })
          break
        default:
          throw 'not a valid mode'
      }
    }
  }, [barcode, mode, modal, add, del, save])

  const MODAL = useModal()

  const print = () => window.print()

  const FLOORLIFE_ITEMS: FormItemProps<LabelProps>[] = [
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
      children: <Input ref={inputRef} placeholder="31234213123432" />,
    },
  ]

  return (
    <div>
      <Typography.Text
        style={{ margin: '20px 0px' }}
        strong={true}
        className="flex-center-center"
      >
        {
          'Table 4-3 & 5-1 Resetting or Pausing the Floor Life Clock at User Site For Dry Cabinets'
        }
      </Typography.Text>
      <Space style={{ width: '100%' }} className="flex-center-space">
        <Space size={'small'}>
          <Button type="primary" icon={<PlusOutlined />} onClick={MODAL.open}>
            Add
          </Button>
          <Button
            type="primary"
            icon={<PrinterFilled />}
            className="print-floorlife"
            onClick={print}
          >
            Print
          </Button>
        </Space>
        <Select
          onSelect={setMode}
          style={{ minWidth: '140px' }}
          placeholder={'barcode mode'}
        >
          <Select.Option value="add">Add</Select.Option>
          <Select.Option value="del">Delete</Select.Option>
          <Select.Option value="save">In / Out</Select.Option>
        </Select>
      </Space>

      <FormModal
        formItems={FLOORLIFE_ITEMS}
        onOk={add}
        onCancel={MODAL.close}
        visible={MODAL.visible}
      />
    </div>
  )
}

export default TableHeader
