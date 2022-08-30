import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'

import Spin from '@components/shared/Spin'
import AuthContext from '@context/AuthContext'

import { PrivateFooter, PublicFooter } from './Footer'
import { PublicHeader, PrivateHeader } from './Header'
import { PrivateAside } from './Aside'
import Routes from './Routes'

const Layouts: React.FC = (): JSX.Element => {
  const { auth } = React.useContext(AuthContext)

  return (
    <React.Fragment>
      <Layout>
        {auth.ok === true ? (
          <Private />
        ) : auth.ok === false ? (
          <Public />
        ) : (
          <div className="app-loading">
            <Spin spinning={auth.ok === null} tip="Loading App..." />
          </div>
        )}
      </Layout>
    </React.Fragment>
  )
}

const Private: React.FC = (): JSX.Element => {
  return (
    <React.Fragment>
      <PrivateHeader />
      <Layout hasSider>
        <Content>
          <PrivateAside />
          <Routes />
        </Content>
      </Layout>
      <PrivateFooter />
    </React.Fragment>
  )
}

const Public: React.FC = (): JSX.Element => {
  return (
    <React.Fragment>
      <PublicHeader />
      <Content>
        <Routes />
      </Content>
      <PublicFooter />
    </React.Fragment>
  )
}

export default Layouts
