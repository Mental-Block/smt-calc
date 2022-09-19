import React from 'react'
import type { RouteProps } from '@interfaces/layout'
import useAuthContext from '@context/AuthContext'

import RouteWithSubRoutes from './RoutesWithSubRoutes'

const PublicRoute: React.FC<RouteProps> = (route): JSX.Element => {
  const { auth } = useAuthContext()

  return (
    <React.Fragment>
      {route.restricted !== true && auth.ok === false && (
        <RouteWithSubRoutes {...route} />
      )}
    </React.Fragment>
  )
}

export default PublicRoute
