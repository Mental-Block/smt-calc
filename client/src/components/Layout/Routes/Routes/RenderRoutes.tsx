import React from 'react'

import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

import { ROOT_ROUTES } from '../Paths'
import { FourOhFourSwitch } from '../Switch'
import RouteWithSubRoutes from './RoutesWithSubRoutes'

const RenderRoutes: React.FC = (): JSX.Element => {
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
