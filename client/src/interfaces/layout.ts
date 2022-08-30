import { RouteProps as ReactRouteProps } from 'react-router'

export interface RouteProps extends ReactRouteProps {
  restricted?: boolean //Only show specific users
  private?: boolean //Only logged in user
  component: any
  routes?: RouteProps[]
}
