import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import React from 'react'

import DefaultLoadingPage from '@components/shared/DefualtLoadingPage'

import { PrivateFooter, PublicFooter } from './Footer'
import { PublicHeader, PrivateHeader } from './Header'
import { PrivateAside } from './Aside'
import Routes from './Routes'

import useAuthContext from '@context/AuthContext'

const Layouts: React.FC = (): JSX.Element => {
  const { auth } = useAuthContext()

  return (
    <React.Fragment>
      <Layout>
        {auth.ok === true ? (
          <Private />
        ) : auth.ok === false ? (
          <Public />
        ) : (
          <div className="app-loading">
            <DefaultLoadingPage
              isLoading={auth.ok === null}
              loadingMessage="Loading App..."
              error={auth.ok === null ? undefined : '500, Server Error'}
            />
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
