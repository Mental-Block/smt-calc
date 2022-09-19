import React from 'react'

import { PATH, ROLE } from '@const'
import useAuthContext from '@context/AuthContext'
import { RouteProps } from '@interfaces/layout'

import RouteWithSubRoutes from './RoutesWithSubRoutes'
import { Redirect } from 'react-router-dom'

const PrivateRoute: React.FC<RouteProps> = (route): JSX.Element => {
  const { auth } = useAuthContext()

  return (
    <React.Fragment>
      {auth.ok === true && route.restricted !== true ? (
        <RouteWithSubRoutes {...route} />
      ) : auth.role === ROLE.admin ? (
        <RouteWithSubRoutes {...route} />
      ) : (
        <Redirect to={PATH.DASHBOARD} />
      )}
    </React.Fragment>
  )
}

export default PrivateRoute
