import { InputProps } from 'antd'

export interface DropDownProps {
  del: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>
  add: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>
  inputProps?: InputProps
}
