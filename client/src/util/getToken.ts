import { AccessToken, AuthTokenProps } from '@interfaces/auth'
import jwtDecode from 'jwt-decode'

const getToken = (accessToken: AccessToken): AuthTokenProps | undefined => {
  return jwtDecode(accessToken as string) as AuthTokenProps
}

export default getToken
