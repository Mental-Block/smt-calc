import React from 'react'

import { API } from '@const'
import Spin from '@components/shared/Spin'
import Error from '@components/shared/Error'
import useFetch from '@util/useFetch'

import SettingsForm from './Form'
import { SettingsDataProps } from '@interfaces/settings'
import useAuthContext from '@context/AuthContext'
import DefaultLoadingPage from '@components/shared/DefualtLoadingPage'

const Settings: React.FC = (): JSX.Element => {
  const { auth } = useAuthContext()

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
    <DefaultLoadingPage
      error={error}
      isLoading={isLoading}
      loadingMessage="Loading Settings..."
    >
      {data && (
        <div className="page-center">
          <SettingsForm {...data} />
        </div>
      )}
    </DefaultLoadingPage>
  )
}

export default Settings
