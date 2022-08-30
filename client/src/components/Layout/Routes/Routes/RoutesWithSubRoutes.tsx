import { RouteProps } from '@interfaces/layout'
import { Route } from 'react-router-dom'

const RouteWithSubRoutes: React.FC<RouteProps> = (route) => {
  return (
    <Route
      path={route.path}
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  )
}

export default RouteWithSubRoutes
