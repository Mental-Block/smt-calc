import React from 'react'
import { RouteProps } from '@interfaces/layout'

import RouteWithSubRoutes from './RoutesWithSubRoutes'
import AuthContext from '@context/AuthContext'

const PublicRoute: React.FC<RouteProps> = (route): JSX.Element => {
  const { auth } = React.useContext(AuthContext)

  return (
    <React.Fragment>
      {route.restricted !== true && auth.ok === false && (
        <RouteWithSubRoutes {...route} />
      )}
    </React.Fragment>
  )
}

export default PublicRoute
