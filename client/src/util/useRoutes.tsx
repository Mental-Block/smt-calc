import { RouteProps } from '@interfaces/layout'
import { MenuProps } from 'antd'
import React from 'react'

type ItemType = Required<MenuProps>['items'][number]

const useConvertRoutesIntoMenuItems = (
  intitalRoutes: RouteProps[],
  initalMenuItems: ItemType[]
) => {
  const [routes, setRoutes] = React.useState(intitalRoutes)
  const [menuItems, setMenuItems] = React.useState(initalMenuItems)

  return {
    convertRouteIntoMenuItemsWPath,
    convertRoutePathIntoKey,
    removeRoutes,
    routes,
  }
}

export default useRoutes

/* convert route into menu items with path */
const routeItems = bob.convertRouteIntoMenuItemsWPath(DASHBOARD_ROUTES)

/* merge items array with routes array off the key we just added */
const menuItemWPath = mergeArrayObjects(routeItems, MENU_ITEMS as any[], 'key')

/* since we just mutated our array... We now want to convert the path into key 
 so we have a ItemType[] again. This also ensures we have a unique key/path 
 for react router */
const menuItems = bob.convertRoutePathIntoKey(menuItemWPath)
