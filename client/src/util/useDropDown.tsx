import React from 'react'
import { OptionType } from '@interfaces/form'

export function useDropDown(options: OptionType[]) {
  const [value, setValue] = React.useState('')

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const getOption = (delValue: string) => {
    return new Promise<OptionType>((resolve, reject) => {
      const filteredOptions = options.filter(
        ({ value }) => value.trim().toLowerCase() === delValue
      )

      if (filteredOptions[0]) {
        resolve(filteredOptions[0])
      }

      reject('No option with this value.')
    })
  }

  const add = (value: OptionType) => {
    options.push(value)
    setValue('')
  }

  const del = (id: number) => {
    const index = options.findIndex((item) => id === item.id)
    options.splice(index, 1)
    setValue('')
  }

  return {
    options,
    value,
    onChange,
    del,
    add,
    getOption,
  }
}
