import { FormInstance, FormItemProps } from 'antd'

export interface FormModalProps {
  onOk: (values: any) => void
  onCancel: () => void
  visible: boolean
  formItems: FormItemProps[]
  form?: FormInstance
}

export type OptionType = {
  text: string
  value: string
  id?: string | number
}
