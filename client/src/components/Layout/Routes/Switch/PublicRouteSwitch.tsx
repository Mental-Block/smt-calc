import React from 'react'

import { RouteProps } from '@interfaces/layout'

import FourOhFourSwitch from './FourOhFourSwitch'
import PublicRoute from '../Routes/PublicRoute'

const PublicRouteSwitch: React.FC<{ routes: RouteProps[] }> = ({
  routes,
}): JSX.Element => {
  return (
    <FourOhFourSwitch>
      {routes.map((route, key) => (
        <PublicRoute key={key} {...route} />
      ))}
    </FourOhFourSwitch>
  )
}
export default PublicRouteSwitch
