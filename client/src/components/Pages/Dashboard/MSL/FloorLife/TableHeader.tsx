import React from 'react'
import {
  Button,
  FormItemProps,
  Input,
  InputRef,
  Modal,
  Space,
  Typography,
} from 'antd'
import { PlusOutlined, PrinterFilled } from '@ant-design/icons'

import { FormModal } from '@components/shared/Table'

import useModal from '@util/useModal'
import { isWholeNumber } from '@util/formRules'
import { LabelProps } from '@interfaces/label'
import useBarcodeScanner from '@util/useBarcodeScanner'

const TableHeader: React.FC<any> = ({ add }) => {
  const { visible, close, open } = useModal()
  const [modal] = Modal.useModal()
  const inputRef = React.useRef<InputRef>(null)
  const barcode = useBarcodeScanner(inputRef)

  React.useEffect(() => {
    if (barcode && !visible) {
      modal.confirm({
        onOk: add({ partId: parseInt(barcode) } as Partial<LabelProps>),
      })
    }
  }, [barcode, visible, modal, add])

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
      <Space size={'small'} className="flex-center-space">
        <Button type="primary" icon={<PlusOutlined />} onClick={open}>
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

      <FormModal
        formItems={FLOORLIFE_ITEMS}
        onOk={add}
        onCancel={close}
        visible={visible}
      />
    </div>
  )
}

export default TableHeader
