import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const useRouteKey = () => {
  const [key, setK] = React.useState('')
  const history = useHistory()
  const { pathname } = useLocation()

  React.useEffect(() => {
    if (pathname.endsWith('/')) {
      const newKey = pathname.slice(0, pathname.length - 1)
      setK(newKey)
    } else {
      setK(pathname)
    }
  }, [pathname])

  const setKey = (path: string) => {
    history.push(path as string)
  }

  return [key, setKey] as const
}

export default useRouteKey
