import React from 'react'

import { PATH } from '@const'
import { RouteProps } from '@interfaces/layout'
import FourOhFourPage from '@components/Pages/FourOhFour'

const FLOORLIFE = React.lazy(
  () => import('@components/Pages/Dashboard/MSL/FloorLife')
)

// const BAKE_COMPONENT = React.lazy(
//   () => import('@components/Pages/Dashboard/MSL/BakeComponent')
// )

// const BAKE_TIMESHEET = React.lazy(
//   () => import('@components/Pages/Dashboard/MSL/BakeTimesheet')
// )

const MSL_ROUTES: RouteProps[] = [
  {
    path: `${PATH.MSL}/floorlife`,
    component: FLOORLIFE,
    exact: true,
    private: true,
  },
  {
    path: `${PATH.MSL}/components`,
    component: FourOhFourPage,
    private: true,
  },
  // {
  //   path: `${PATH.BAKE}/timesheet`,
  //   component: BAKE_TIMESHEET,
  //   private: true,
  // },
]

export default MSL_ROUTES
