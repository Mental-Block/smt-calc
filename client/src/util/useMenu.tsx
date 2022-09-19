import { ROLE } from '@const'
import useAuthContext from '@context/AuthContext'

import type { RouteProps } from '@interfaces/layout'
import type { ItemType, MenuItem } from '@interfaces/menu'

import useGenerateId from './useGenerateId'

const useMenu = () => {
  const { auth } = useAuthContext()
  const generateId = useGenerateId()

  const routeIntoMenuItem = (routes: RouteProps[]): MenuItem[] => {
    return routes.map((route: RouteProps, key) => {
      const menuItem: MenuItem = {
        id: key,
        key: generateId((key + 5000).toString()), // 5000 is just an arb number for antd types
        path: route.path as string,
        disabled: auth.role === ROLE.admin ? false : true,
      }

      if (route.routes) {
        return {
          ...menuItem,
          children: routeIntoMenuItem(route.routes),
        }
      }

      return menuItem
    })
  }

  const pathIntoMenuKey = (menuItems: MenuItem[]): ItemType[] => {
    return menuItems.map(({ path, ...props }: any) => {
      const item = {
        ...props,
        key: path,
      }

      if (props.children) {
        return {
          ...item,
          children: pathIntoMenuKey(props.children),
        }
      }

      return item
    })
  }

  return { routeIntoMenuItem, pathIntoMenuKey }
}

export default useMenu
