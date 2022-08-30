import { PackageType, ComponentProps } from './component'
import { FloorLifeProps } from './msl'
import { DeepFlatten } from './util'

export interface LabelProps {
  id: number
  partId: number
  packageType: PackageType
  createdAt: Date
  updatedAt: Date
}

type LabelWRelations = LabelProps & {
  msl: FloorLifeProps
  component: ComponentProps
}

export type Label = Pick<
  DeepFlatten<LabelWRelations, '_'>,
  | 'id'
  | 'packageType'
  | 'partId'
  | 'component_partnumberInternal'
  | 'component_partnumberManufactor'
>
