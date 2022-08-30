import React from 'react'

import { PATH } from '@const'
import { RouteProps } from '@interfaces/layout'

import MSL_ROUTES from './msl'

import PrivateRouteSwitch from '../Switch/PrivateRouteSwitch'

const DASHBOARD = React.lazy(() => import('@components/Pages/Dashboard/Home'))
const USER_TABLE = React.lazy(() => import('@components/Pages/Dashboard/User'))
const SETTINGS = React.lazy(
  () => import('@components/Pages/Dashboard/Settings')
)
const COMPONENT = React.lazy(
  () => import('@components/Pages/Dashboard/Component')
)
const LABEL = React.lazy(() => import('@components/Pages/Dashboard/Label'))

const DASHBOARD_ROUTES: RouteProps[] = [
  {
    path: `${PATH.DASHBOARD}`,
    component: DASHBOARD,
    exact: true,
    private: true,
  },
  {
    path: `${PATH.DASHBOARD}/users`,
    component: USER_TABLE,
    exact: true,
    restricted: true,
    private: true,
  },
  {
    path: `${PATH.DASHBOARD}/components`,
    component: COMPONENT,
    private: true,
    exact: true,
    restricted: true,
  },
  {
    path: `${PATH.DASHBOARD}/labels`,
    component: LABEL,
    private: true,
    exact: true,
  },
  {
    path: `${PATH.MSL}`,
    component: PrivateRouteSwitch,
    routes: MSL_ROUTES,
    private: true,
  },
  {
    path: `${PATH.DASHBOARD}/settings`,
    component: SETTINGS,
    restricted: true,
    private: true,
    exact: true,
  },
]

export default DASHBOARD_ROUTES
