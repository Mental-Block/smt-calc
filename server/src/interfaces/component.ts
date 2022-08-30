import { TDateISO } from "./date"
import {  MSLLevelType } from "./msl"
import { TableProps } from "./table"

export type PackageType = "tube" | "tray" | "reel"

export interface ComponentNameProps {
  id: number,
  name: string
}

export interface ComponentProps {
  id: number
  pinCount: number
  bodyThickness: number
  description: string
  updatedAt:  TDateISO
  createdAt: TDateISO
  partnumberManufactor: string
  partnumberInternal: string
  packageType: PackageType[]
  name: string
  mslLevel: MSLLevelType
  vendor: string
} 

export type AllComponent = Partial<TableProps & ComponentProps>
export type DelComponent = Pick<ComponentProps, 'id'>
export type AddComponent =  Omit<ComponentProps, 'id'>
export type SaveComponent = ComponentProps
export type IsMultiplePartNumber = Pick<ComponentProps, 'partnumberInternal'>



