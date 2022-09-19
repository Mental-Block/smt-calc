import { message as AntdMessage } from 'antd'

export function successMessage(message: string) {
  return AntdMessage.success({
    content: message,
    className: 'table-message',
  })
}

export function failedMessage(message: string) {
  return AntdMessage.error({
    content: message,
    className: 'table-message',
  })
}
