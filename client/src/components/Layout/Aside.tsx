import React from 'react'
import { Menu } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import {
  BoxPlotFilled,
  ClockCircleOutlined,
  HomeOutlined,
  QrcodeOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { DASHBOARD_ROUTES } from '@components/Layout/Routes/Paths'

import mergeArrayObjects from '@util/mergeArrayObjects'
// import addKeyArrayObjects from

import useGenerateId from '@util/useGenerateId'

import type { ItemType, MenuItem } from '@interfaces/menu'
import addKeyArrayObjects from '@util/addKeyArrayObjects'

import useMenu from '@util/useMenu'
import useRouteKey from '@util/useRoutes'

export const PrivateAside: React.FC = (): JSX.Element => {
  const [collapsed, setCollapsed] = React.useState(false)
  const [key, setKey] = useRouteKey()
  const generateId = useGenerateId()
  const { routeIntoMenuItem, pathIntoMenuKey } = useMenu()

  const MENU_ITEMS: MenuItem[] = [
    {
      key: generateId('0'),
      label: 'Home',
      icon: <HomeOutlined />,
    },
    {
      key: generateId('1'),
      label: 'Users',
      icon: <UserOutlined />,
    },
    {
      key: generateId('2'),
      label: 'Components',
      icon: <BoxPlotFilled />,
    },
    {
      key: generateId('3'),
      label: 'Labels',
      icon: <QrcodeOutlined />,
    },
    {
      key: generateId('4'),
      label: "MSL's",
      icon: <ClockCircleOutlined />,
      children: [
        {
          key: generateId('5'),
          label: 'Floor Life - Dry Cab',
        },
        {
          key: generateId('6'),
          disabled: true,
          label: 'Bake Components',
        },
        // {
        //   key: '1',
        //   label: 'Bake Timesheet',
        // },
      ],
    },
    {
      key: generateId('7'),
      label: 'Settings',
      icon: <SettingOutlined />,
    },
  ]

  const routeMenuItems = routeIntoMenuItem(DASHBOARD_ROUTES)
  const mergedMenuItems = mergeArrayObjects(
    routeMenuItems,
    addKeyArrayObjects(MENU_ITEMS)
  )

  const DASHBOARD_MENU_ITEMS: ItemType[] = pathIntoMenuKey(mergedMenuItems)

  return (
    <Sider
      className="aside"
      collapsible
      collapsed={collapsed}
      collapsedWidth="0"
      onCollapse={() => setCollapsed(!collapsed)}
    >
      <Menu
        onClick={({ key }) => {
          setKey(key)
        }}
        items={DASHBOARD_MENU_ITEMS}
        mode="inline"
        activeKey={key}
        selectedKeys={[key]}
      />
    </Sider>
  )
}
