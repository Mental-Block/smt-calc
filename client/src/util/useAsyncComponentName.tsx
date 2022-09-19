import React from 'react'

import { TIME } from '@const'
import { ComponentNameProps } from '@interfaces/component'
import { OptionType } from '@interfaces/form'
import { usePrivateApi } from '@API'

let currentValue: string
let timeout: ReturnType<typeof setTimeout> | null

const useAsyncComponentName = (value = '', initalReq = true) => {
  const API = usePrivateApi()
  const [options, setOptions] = React.useState<OptionType[]>([])
  const [loading, setLoading] = React.useState(false)
  const initalReqRef = React.useRef(initalReq)

  const fetchComponentType = React.useCallback(() => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }

    currentValue = value

    const packageType = async () => {
      setLoading(true)

      await API<ComponentNameProps[]>('componentNameAll', value)
        .then((data) => {
          if (currentValue === value) {
            const result: OptionType[] = data.map(({ name, id }) => ({
              id,
              text: name,
              value: name,
            }))

            setOptions(result)
            setLoading(false)
          }
        })
        .catch((err) => {
          setLoading(false)
          throw err
        })
    }

    if (initalReqRef.current === true) {
      initalReqRef.current = false
      packageType()
    } else {
      timeout = setTimeout(packageType, TIME.ONE_SECOND / 3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  React.useEffect(() => {
    fetchComponentType()
  }, [fetchComponentType])

  return { options, loading }
}

export default useAsyncComponentName
