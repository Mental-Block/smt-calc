import React from 'react'

import { AccessToken, AuthContextProps, AuthProps } from '@interfaces/auth'
import getToken from '@util/getToken'
import { API, TIME } from '@const'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AuthContext = React.createContext<AuthContextProps>(undefined!)

const AuthContextProvider: React.FC = (props): JSX.Element => {
  const [auth, setAuth] = React.useState<AuthProps>({
    ok: null,
  })

  const requestAuthToken = React.useCallback(async () => {
    const res = await fetch(`${API.USER}/refreshtoken`, {
      method: 'POST',
      credentials: 'include',
    })

    if (res.ok) {
      const data: AuthProps = await res.json()
      setAuth({ ...data, role: getToken(data.accessToken)?.role })
      return data.accessToken
    } else {
      setAuth({ ok: false })
    }
  }, [])

  const requestTimer = React.useCallback(
    (token: AccessToken) => {
      const TOKEN = getToken(token)

      const TOKEN_REQUEST_TIMER = TOKEN?.exp
        ? TOKEN?.exp * 1000 - Date.now()
        : TIME.ONE_MINUTE * 10

      const requestTimer = setInterval(requestAuthToken, TOKEN_REQUEST_TIMER)

      return () => clearInterval(requestTimer)
    },
    [requestAuthToken]
  )

  React.useEffect(() => {
    const sendRequest = async () => {
      const initalToken = await requestAuthToken()
      requestTimer(initalToken)
    }

    sendRequest()
  }, [requestTimer, requestAuthToken])

  return (
    <React.Fragment>
      <AuthContext.Provider value={{ auth, setAuth }}>
        {props.children}
      </AuthContext.Provider>
    </React.Fragment>
  )
}

export default AuthContext
export { AuthContextProvider }
