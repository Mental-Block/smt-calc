import React from 'react'

const useModal = (initalVisibleState = false) => {
  const [visible, setVisible] = React.useState(initalVisibleState)

  const open = () => {
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  return {
    open,
    close,
    visible,
  }
}

export default useModal
