import { Menu, MenuProps } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import {
  BoxPlotFilled,
  ClockCircleOutlined,
  HomeOutlined,
  QrcodeOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { ROLE } from '@const'
import AuthContext from '@context/AuthContext'
import { DASHBOARD_ROUTES } from '@components/Layout/Routes/Paths'

import mergeArrayObjects from '@util/mergeArrayObjects'
import { RouteProps } from '@interfaces/layout'

type ItemType = Required<MenuProps>['items'][number]

const useRouteKey = () => {
  const [key, setKey] = React.useState('')
  const { pathname } = useLocation()

  React.useEffect(() => {
    if (pathname.endsWith('/')) {
      const newKey = pathname.slice(0, pathname.length - 1)
      setKey(newKey)
    } else {
      setKey(pathname)
    }
  }, [pathname])

  return key
}

export const PrivateAside: React.FC = (): JSX.Element => {
  const { auth } = React.useContext(AuthContext)
  const [collapsed, setCollapsed] = React.useState(false)
  const history = useHistory()
  const activeKey = useRouteKey()

  const disabled = auth.role === ROLE.admin ? false : true

  // NEED TO KEEP ID IN ORDER, or CAN'T MERGE W ROUTES
  const MENU_ITEMS: ItemType[] = [
    {
      key: '0',
      label: 'Home',
      icon: <HomeOutlined />,
    },
    {
      key: '1',
      label: 'Users',
      icon: <UserOutlined />,
      disabled,
    },
    {
      key: '2',
      label: 'Components',
      icon: <BoxPlotFilled />,
      disabled,
    },
    {
      key: '3',
      label: 'Labels',
      icon: <QrcodeOutlined />,
    },
    {
      key: '4',
      label: "MSL's",
      icon: <ClockCircleOutlined />,
      children: [
        {
          key: '0',
          label: 'Floor Life - Dry Cab',
        },
        {
          disabled: true,
          key: '1',
          label: 'Bake Components',
        },
        // {
        //   key: '1',
        //   label: 'Bake Timesheet',
        // },
      ],
    },
    {
      key: '5',
      label: 'Settings',
      icon: <SettingOutlined />,
      disabled,
    },
  ]

  const routeIntoItemWPath = (routes: RouteProps[]): any[] => {
    return routes.map(
      ({ path, routes, restricted }: RouteProps, key: number) => {
        const routeObj = {
          key: key.toString() as string,
          path: path as string,
          disabled: restricted,
        }

        if (routes) {
          return {
            ...routeObj,
            children: routeIntoItemWPath(routes),
          }
        }

        return routeObj
      }
    )
  }

  const convertRoutePathIntoKey = (menuItems: any[]): any[] => {
    return menuItems.map(({ path, ...props }: any) => {
      const routeObj = {
        ...props,
        key: path,
      }

      if (props.children) {
        return {
          ...routeObj,
          children: convertRoutePathIntoKey(props.children as any[]),
        }
      }

      return routeObj
    })
  }

  /* convert route into menu items with path */
  const routeItems = routeIntoItemWPath(DASHBOARD_ROUTES)

  /* merge items array with routes array off the key we just added */
  const menuItemWPath = mergeArrayObjects(
    routeItems,
    MENU_ITEMS as any[],
    'key'
  )

  /* since we just mutated our array... We now want to convert the path into key 
  so we have a ItemType[] again. This also ensures we have a unique key/path 
  for react router */
  const menuItems = convertRoutePathIntoKey(menuItemWPath)

  return (
    <Sider
      className="aside"
      collapsible
      collapsed={collapsed}
      collapsedWidth="0"
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <Menu
        onSelect={({ key }) => {
          history.push(key)
        }}
        items={menuItems}
        mode="inline"
        activeKey={activeKey}
        selectedKeys={[activeKey]}
      />
    </Sider>
  )
}
