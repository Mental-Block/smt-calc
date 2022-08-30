import React from 'react'
import { message } from 'antd'

import { OptionType } from '@interfaces/form'
import { fetchReducer } from './reducers'

const useSearchDropDown = (
  CB: (
    value: string,
    option: React.Dispatch<React.SetStateAction<OptionType[]>>
  ) => void,
  options: OptionType[]
) => {
  const [optionItems, setOptions] = React.useState(options)
  const [value, setValue] = React.useState('')

  const onSearch = (newValue: string) => {
    setValue(newValue)
    CB(newValue, setOptions)
  }

  return {
    options: optionItems,
    value,
    onSearch,
  }
}

export default useSearchDropDown

export function useDropDownInput(options: OptionType[]) {
  const FetchReducer = fetchReducer()
  const [{ isLoading }, fetchDispatch] = React.useReducer(FetchReducer, {
    isLoading: false,
  })

  const [value, setValue] = React.useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const _handleError = (err: unknown) => {
    let msg
    if (typeof err === 'string') msg = err
    if (err instanceof Error) msg = err.message
    message.error(msg)
    fetchDispatch({ type: 'REJECT', error: msg || '500 server error' })
  }

  const add = async (fetchCallback: (values: any) => Promise<OptionType>) => {
    try {
      fetchDispatch({ type: 'PENDING' })
      if (!value.trim()) throw new Error("Can't be empty.")

      await fetchCallback(value)
        .then((value) => {
          options.push(value)
          setValue('')
          fetchDispatch({ type: 'RESOLVE' })
        })
        .catch((err) => {
          throw err
        })
    } catch (err) {
      _handleError(err || 'Failed to add.')
    }
  }

  const del = async (fetchCallback: (id: number) => Promise<any>) => {
    try {
      fetchDispatch({ type: 'PENDING' })
      if (!value.trim()) throw new Error("Can't be empty.")

      const curItem = options.filter((item) => {
        if (
          item.value
            .trim()
            .toLocaleLowerCase()
            .includes(value.trim().toLocaleLowerCase())
        )
          return item
      })[0]

      if (!curItem) throw new Error('No item found.')

      await fetchCallback(curItem.id as number)
        .then(() => {
          const index = options.findIndex((item) => curItem.id === item.id)
          options.splice(index, 1)
          setValue('')
          fetchDispatch({ type: 'RESOLVE' })
        })
        .catch((err) => {
          throw err
        })
    } catch (err) {
      _handleError(err || 'Failed to delete.')
    }
  }

  return {
    options,
    isLoading,
    value,
    onChange,
    del,
    add,
  }
}
