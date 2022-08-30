import React from 'react'
import { Route, useRouteMatch } from 'react-router-dom'

import { PATH } from '@const'
import Spin from '@components/shared/Spin'

import RenderRoutes from './Routes'
import { FourOhFourSwitch } from './Switch'

const FOUR_OH_FOUR = React.lazy(() => import('@components/Pages/FourOhFour'))

const Routes: React.FC = (): JSX.Element => {
  const hasMatchedNotFound = useRouteMatch(`${PATH.FOUROHFOUR}`)

  return (
    <React.Fragment>
      <React.Suspense fallback={<Spin tip="Loading Page..." />}>
        <React.Fragment>
          <Route path={`${PATH.FOUROHFOUR}`} component={FOUR_OH_FOUR} />
          <FourOhFourSwitch>
            {!hasMatchedNotFound && <RenderRoutes />}
          </FourOhFourSwitch>
        </React.Fragment>
      </React.Suspense>
    </React.Fragment>
  )
}

export default Routes
