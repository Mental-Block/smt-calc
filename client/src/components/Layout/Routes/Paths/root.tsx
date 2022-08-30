import React from 'react'

import { PATH } from '@const'
import { RouteProps } from '@interfaces/layout'

import DASHBOARD_ROUTES from './dashboard'

import PrivateRouteSwitch from '../Switch/PrivateRouteSwitch'

const LOGIN = React.lazy(() => import('@components/Pages/Login'))

const ROOT_ROUTES: RouteProps[] = [
  {
    path: PATH.ROOT,
    component: LOGIN,
    exact: true,
    private: false,
  },
  {
    path: PATH.DASHBOARD,
    component: PrivateRouteSwitch,
    private: true,
    routes: DASHBOARD_ROUTES,
  },
]

export default ROOT_ROUTES
