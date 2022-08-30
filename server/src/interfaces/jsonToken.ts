import { UserProps } from "./user"

export type DataStoredInTokenProps = Pick<UserProps, 'id' |'role'>

export interface RefreshDataInTokenProps extends DataStoredInTokenProps{
  tokenVersion: number
}

export type AuthToken = string | undefined