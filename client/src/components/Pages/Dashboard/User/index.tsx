import React from 'react'

import { API } from '@const'

import AuthContext from '@context/AuthContext'

import UsersTable from './Table'

import { UserDataProps } from '@interfaces/user'

import useFetch from '@util/useFetch'

import { TableProps } from '@interfaces/table'

import Spin from '@components/shared/Spin'
import Error from '@components/shared/Error'

const UsersPage: React.FC = (): JSX.Element => {
  const { auth } = React.useContext(AuthContext)

  const { error, data, isLoading } = useFetch<TableProps<UserDataProps>>(
    `${API.USER}/?pageSize=10&page=1`,
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
        <Spin tip={'Loading User Data...'} />
      ) : data ? (
        <UsersTable {...data} />
      ) : (
        <div className="page-center">
          <Error error={error} />
        </div>
      )}
    </React.Fragment>
  )
}

export default UsersPage
