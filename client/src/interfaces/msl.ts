import type { ComponentProps } from './component'
import type { LabelProps } from './label'
import { DeepFlatten } from './util'

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

type FloorLifeTableProps = FloorLifeProps & {
  label: Pick<LabelProps, 'partId'>
  label_component: Pick<ComponentProps, 'partnumberInternal'>
}

export type Floorlife = DeepFlatten<FloorLifeTableProps, '_'>
