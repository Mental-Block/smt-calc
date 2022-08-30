export type MSLLevelType = '1' | '2' | '2a' | '3' | '4' | '5' | '5a' | '6'
export type MSLStatusType =
  | 'EXPIRED'
  | 'EXPIRING'
  | 'PAUSED'
  | 'RECOVERED'
  | 'RECOVERING'

export interface FloorLifeProps {
  id: number
  level: MSLLevelType
  updatedAt: number
  availableAt: number
  createdAt: number
  status: MSLStatusType
}
