import { usePublicApi } from '@API'
import useAuthContext from '@context/AuthContext'

import type { AuthProps } from '@interfaces/auth'
import type { LoginProps } from '@interfaces/user'

import getToken from './getToken'

const useAuth = () => {
  const API = usePublicApi()
  const { setAuth } = useAuthContext()

  const login = async (values: LoginProps) => {
    return await API<AuthProps>('userLogin', values)
      .then((data) => {
        const token = getToken(data.accessToken)
        setAuth({ ...data, role: token?.role })
        return true
      })
      .catch(() => {
        setAuth({ ok: false, accessToken: undefined, role: undefined })
        throw `Incorrect username or password!`
      })
  }

  const logout = async () => {
    await API('userLogout')
      .then(() => {
        setAuth({ ok: false, accessToken: undefined, role: undefined })
      })
      .catch(() => {
        throw 'Failed to log out successfully'
      })
  }

  return { login, logout }
}

export default useAuth
