import React from 'react'

import type { AccessToken, AuthContextProps, AuthProps } from '@interfaces/auth'
import { TIME } from '@const'
import getToken from '@util/getToken'

import { usePublicApi } from '@API'

const AuthContext = React.createContext<AuthContextProps | undefined>(undefined)

const AuthContextProvider: React.FC = (props): JSX.Element => {
  const API = usePublicApi()
  const [auth, setAuthentication] = React.useState<AuthProps>({
    ok: null,
  })

  const setAuth = (data: AuthProps) => {
    setAuthentication(data)
  }

  React.useEffect(() => {
    const requestAuthToken = async () => {
      return await API<AuthProps>('userRefreshToken')
        .then((data) => {
          setAuth({ ...data, role: getToken(data.accessToken)?.role })
          return data.accessToken
        })
        .catch(() => {
          setAuth({ ok: false, accessToken: undefined, role: undefined })
        })
    }

    const requestTimer = (token: AccessToken) => {
      const TOKEN = getToken(token)

      const TOKEN_REQUEST_TIMER = TOKEN?.exp
        ? TOKEN?.exp * TIME.ONE_SECOND - Date.now()
        : TIME.ONE_MINUTE * 10

      const requestTimer = setInterval(requestAuthToken, TOKEN_REQUEST_TIMER)

      return () => clearInterval(requestTimer)
    }

    const sendRequest = async () => {
      const initalToken = await requestAuthToken()
      if (initalToken) requestTimer(initalToken)
    }

    sendRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <React.Fragment>
      <AuthContext.Provider value={{ auth, setAuth }}>
        {props.children}
      </AuthContext.Provider>
    </React.Fragment>
  )
}

const useAuthContext = () => {
  const context = React.useContext(AuthContext)
  if (!context) throw 'Not inside the provider'
  return context
}

export default useAuthContext
export { AuthContextProvider }
