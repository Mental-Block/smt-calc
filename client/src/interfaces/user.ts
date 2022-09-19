export type roleType = 'admin' | 'user'

export interface UserProps {
  username: string
  role: roleType
}

export interface UserDataProps extends UserProps {
  id: number
}

export interface RegisterProps extends LoginProps {
  confirmPassword: string
}

export interface LoginProps {
  username: string
  password: string
}
