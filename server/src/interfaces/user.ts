import { TDateISO } from "./date"
import { TableProps } from "./table"

export type UserRoleType = "admin" | "user"

export interface UserProps {
    id: number
    username: string
    password: string
    role: UserRoleType
    tokenVersion: number
    createdAt: TDateISO
    updatedAt: TDateISO
  }
  
export interface RegisterUserProps extends UserProps{ 
    confirmPassword : string
}
  
export type UsersTableQuery = Partial<TableProps & UserProps>  

