import React from 'react'
import { API } from '@const'

import Error from '@components/shared/Error'
import Spin from '@components/shared/Spin'

import AuthContext from '@context/AuthContext'

import { TableProps } from '@interfaces/table'

import useFetch from '@util/useFetch'

import Table from './Table'
import { ComponentProps } from '@interfaces/component'

const ComponentPage: React.FC = (): JSX.Element => {
  const { auth } = React.useContext(AuthContext)

  const { isLoading, data, error } = useFetch<TableProps<ComponentProps>>(
    `${API.COMPONENT}?pageSize=10&page=1`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `bearer ${auth.accessToken}`,
      },
    }
  )

  return (
    <React.Fragment>
      {isLoading ? (
        <Spin tip={'Loading Component Data...'} />
      ) : data ? (
        <Table {...data} />
      ) : (
        <div className="page-center">
          <Error error={error} />
        </div>
      )}
    </React.Fragment>
  )
}

export default ComponentPage
