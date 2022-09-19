import { ComponentProps } from "./component"
import { TDateISO } from "./date"
import { FloorLifeProps } from "./msl"
import { TableProps } from "./table"
import { DeepFlatten } from "./util"

export interface LabelProps {
  id: number
  partId: number
  createdAt: TDateISO
  updatedAt: TDateISO
}


export type LabelWRelations = LabelProps & { component: ComponentProps, msl: FloorLifeProps }


export type Label = DeepFlatten<LabelWRelations, '_'>
export type AllLabel = Partial<TableProps & Pick<Label, 'partId' | 'component_partnumberInternal' | 'component_partnumberManufactor'>>  
export type DelLabel = Pick<Label, 'id'>
export type AddLabel = Pick<Label, 'partId'> & Pick<ComponentProps, 'partnumberInternal' | 'partnumberManufactor'>