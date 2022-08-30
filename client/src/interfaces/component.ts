import { MSLLevelType } from './msl'

export type PackageType = 'tube' | 'tray' | 'reel'

export interface ComponentNameProps {
  id: number
  name: string
}

export interface ComponentProps {
  id: number
  bodyThickness: number
  description: string
  updatedAt: Date
  createdAt: Date
  pinCount: number
  name: string
  packageType: PackageType[]
  partnumberInternal: string
  partnumberManufactor: string
  mslLevel: MSLLevelType
  vendor: string
}
