import React, { useRef } from 'react'
import qs from 'qs'

import { API, TIME } from '@const'
import AuthContext from '@context/AuthContext'
import { ComponentNameProps } from '@interfaces/component'
import { OptionType } from '@interfaces/form'

let currentValue: string
let timeout: ReturnType<typeof setTimeout> | null

const useComponentType = (initalRequest = true) => {
  const { auth } = React.useContext(AuthContext)
  const [options, setOptions] = React.useState<OptionType[]>([])
  const initalRequestRef = useRef(initalRequest)

  const fetchComponentType = React.useCallback(
    (value: string, callback: (option: OptionType[]) => void) => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      currentValue = value

      const packageType = async () => {
        await fetch(
          `${API.COMPONENT_NAME}/?${qs.stringify({
            name: value,
          })}`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              authorization: `bearer ${auth.accessToken}`,
            },
            credentials: 'include',
            method: 'GET',
          }
        )
          .then((res) => res.json())
          .then((data: ComponentNameProps[]) => {
            if (currentValue === value) {
              const result: OptionType[] = data.map(({ name, id }) => ({
                id,
                text: name,
                value: name,
              }))

              callback(result)
            }
          })
      }

      if (initalRequestRef.current) {
        initalRequestRef.current = false
        packageType()
      } else {
        timeout = setTimeout(packageType, TIME.ONE_SECOND / 3)
      }
    },
    [auth.accessToken]
  )

  React.useEffect(() => {
    fetchComponentType('', setOptions)
  }, [fetchComponentType, setOptions])

  return {
    options,
    componentTypeCB: fetchComponentType,
  }
}

export default useComponentType
