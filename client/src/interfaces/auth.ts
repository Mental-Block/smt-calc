import { JwtPayload } from 'jwt-decode'
import { roleType } from './user'

export type AccessToken = string | undefined

export interface AuthTokenProps extends JwtPayload {
  id: number
  role: roleType
}

export interface AuthProps {
  ok: boolean | null
  accessToken?: AccessToken
  role?: roleType
}

export interface AuthContextProps {
  auth: AuthProps
  setAuth: (data: AuthProps) => void
}
