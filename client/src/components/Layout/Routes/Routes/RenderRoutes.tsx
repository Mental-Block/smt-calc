import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { PATH } from '@const'
import AuthContext from '@context/AuthContext'

import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

import { ROOT_ROUTES } from '../Paths'
import { FourOhFourSwitch } from '../Switch'
import RouteWithSubRoutes from './RoutesWithSubRoutes'

const RenderRoutes: React.FC = (): JSX.Element => {
  const { auth } = React.useContext(AuthContext)
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

  return (
    <FourOhFourSwitch>
      {ROOT_ROUTES.map((route) =>
        route.private === true ? (
          <PrivateRoute key={route.path as string} {...route} />
        ) : route.private === false ? (
          <PublicRoute key={route.path as string} {...route} />
        ) : (
          <RouteWithSubRoutes key={route.path as string} {...route} />
        )
      )}
    </FourOhFourSwitch>
  )
}

export default RenderRoutes
