import React from 'react'

import { RouteProps } from '@interfaces/layout'

import PrivateRoute from '../Routes/PrivateRoute'
import FourOhFourSwitch from './FourOhFourSwitch'

const PrivateRouteSwitch: React.FC<{ routes: RouteProps[] }> = ({
  routes,
}): JSX.Element => {
  return (
    <FourOhFourSwitch>
      {routes.map((route) => (
        <PrivateRoute key={route.path as string} {...route} />
      ))}
    </FourOhFourSwitch>
  )
}
export default PrivateRouteSwitch
