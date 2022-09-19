import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { PATH } from '@const'
import useAuthContext from '@context/AuthContext'

const LocateRoute: React.FC = () => {
  const { auth } = useAuthContext()
  const { push } = useHistory()
  const { pathname } = useLocation()

  React.useEffect(() => {
    if (auth.ok === true && pathname === PATH.ROOT) {
      push(PATH.DASHBOARD)
    }

    if (!auth.ok && pathname.includes(PATH.DASHBOARD)) {
      push(PATH.ROOT)
    }
  }, [pathname, push, auth])
  return null
}

export default LocateRoute
