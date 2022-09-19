import React from 'react'
import { InputRef } from 'antd'

const useFocus = () => {
  const htmlElRef = React.useRef<InputRef>(null)
  const setFocus = (): void => {
    htmlElRef?.current?.focus()
  }

  return [htmlElRef, setFocus] as const
}

export default useFocus
