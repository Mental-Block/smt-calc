import React from 'react'
import { InputRef } from 'antd'

const useFocus = (): [any, () => void] => {
  const htmlElRef = React.useRef<InputRef>(null)
  const setFocus = (): void => {
    htmlElRef?.current?.focus()
  }

  return [htmlElRef, setFocus]
}

export default useFocus
