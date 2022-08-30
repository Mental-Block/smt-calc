import React from 'react'

import { API } from '@const'
import AuthContext from '@context/AuthContext'
import Spin from '@components/shared/Spin'
import Error from '@components/shared/Error'
import useFetch from '@util/useFetch'

import SettingsForm from './Form'
import { SettingsDataProps } from '@interfaces/settings'

const Settings: React.FC = (): JSX.Element => {
  const { auth } = React.useContext(AuthContext)

  const { isLoading, error, data } = useFetch<SettingsDataProps>(
    `${API.SETTINGS}`,
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
      <div className="page-center">
        {isLoading ? (
          <Spin tip="Loading Settings..." />
        ) : data ? (
          <SettingsForm {...data} />
        ) : (
          <div className="page-center">
            <Error error={error} />
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

export default Settings
