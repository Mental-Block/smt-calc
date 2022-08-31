import { InputRef } from 'antd'
import React from 'react'
import useEvent from './useEvent'

const useBarcodeScanner = (
  inputRef?: React.RefObject<InputRef>,
  minLength = 10,
  timer = 300
) => {
  const [barcode, setBarcode] = React.useState('')
  const [reading, setReading] = React.useState(false)

  React.useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus()
    }
  }, [inputRef, barcode])

  useEvent('keypress', (e) => {
    if (e.keyCode === 13) {
      setBarcode(barcode.replace('Enter', ''))
    } else {
      setBarcode((barcode) => barcode + e.key)
    }

    if (!reading) {
      setReading(true)
      setTimeout(() => {
        setReading(false)
        setBarcode('')
      }, timer)
    }
  })

  if (!reading && barcode.length > minLength) {
    return barcode
  } else {
    return undefined
  }
}

export default useBarcodeScanner
