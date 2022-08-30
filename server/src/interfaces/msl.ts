import { ComponentProps } from "./component"
import { TDateISO } from "./date"
import { LabelProps } from "./label"
import { TableProps } from "./table"
import { DeepFlatten } from "./util"

export type MSLLevelType = '1' |  '2' | '2a' | '3' | '4' | '5' | '5a' | '6'
export type MSLStatusType = "EXPIRED" | "EXPIRING" | "RECOVERED" | "RECOVERING" | "PAUSED"

export interface FloorLifeProps {
  id: number
  level: MSLLevelType 
  status: MSLStatusType
  availableAt: TDateISO
  createdAt: TDateISO
  updatedAt: TDateISO
}

// label_component is nessary as we are mapping from label side of the relation
type FloorLifeWRelations = FloorLifeProps & { label: LabelProps, label_component: ComponentProps  }

export type DelMSL = Pick<FloorLifeProps, 'id'>
export type AddMSL = Pick<LabelProps, 'partId'>
export type AllMSL = Pick<DeepFlatten<FloorLifeWRelations, '_'>, 'availableAt' | 'createdAt' | 'id' | 'label_component_partnumberInternal' | 'updatedAt' | 'status' | 'level' | 'label_partId'> & TableProps
export type PauseMSL = Pick<FloorLifeProps, 'id'>
export type getStatMSL = Pick<FloorLifeProps, 'id'>