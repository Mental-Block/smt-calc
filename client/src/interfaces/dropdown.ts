import { InputProps } from 'antd'

export interface DropDownProps {
  del: () => Promise<void>
  add: () => Promise<void>
  inputProps?: InputProps
}
