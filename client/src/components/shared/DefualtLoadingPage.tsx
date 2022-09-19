import React from 'react'
import Spin from '@components/shared/Spin'
import Error from '@components/shared/Error'

import { FetchState } from '@interfaces/fetch'

interface DefaultLoadingPage extends Omit<FetchState<any>, 'data'> {
  loadingMessage: string
}

const DefaultLoadingPage: React.FC<DefaultLoadingPage> = ({
  children,
  error,
  loadingMessage,
  isLoading,
}): JSX.Element => {
  return (
    <React.Fragment>
      {isLoading ? (
        <div className="page-center">
          <Spin tip={loadingMessage} />
        </div>
      ) : error ? (
        <div className="page-center">
          <Error error={error} />
        </div>
      ) : (
        children
      )}
    </React.Fragment>
  )
}

export default DefaultLoadingPage
