import React from 'react'
import { NavLink } from 'react-router-dom'

import { Button, Row } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import { MenuOutlined } from '@ant-design/icons'

import useHeader from '@util/useHeader'
import { PATH } from '@const'

import useAuth from '@util/useAuth'

export const PrivateHeader: React.FC = (): JSX.Element => {
  const { showMenu, toggleMenu } = useHeader()
  const { logout } = useAuth()

  return (
    <Header className="header">
      <Row align="middle" justify="space-between">
        <NavLink to={PATH.DASHBOARD} className="logo">
          SMT CALC
        </NavLink>

        <MenuOutlined
          onClick={toggleMenu}
          className={showMenu ? 'active-link header-burger' : 'header-burger'}
        />

        {showMenu && (
          <div className="header-menu flex-center-end">
            <Button style={{ width: '100%' }} type="primary" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </Row>
    </Header>
  )
}

export const PublicHeader: React.FC = (): JSX.Element => {
  const { showMenu, toggleMenu } = useHeader()

  return (
    <Header className="header">
      <Row align="middle" justify="space-between">
        <NavLink to={PATH.ROOT} className="logo">
          SMT CALC
        </NavLink>
        <MenuOutlined
          onClick={toggleMenu}
          className={showMenu ? 'active-link header-burger' : 'header-burger'}
        />
        {showMenu && (
          <div className="header-menu flex-center-space">
            <NavLink
              to={PATH.ROOT}
              activeClassName="active-link"
              className="link"
              exact
            >
              Home
            </NavLink>
            <a className="link" href="http://mfg" rel="noreferrer">
              MFG
            </a>
          </div>
        )}
      </Row>
    </Header>
  )
}
