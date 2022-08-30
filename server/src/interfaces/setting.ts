import { TDateISO } from "./date"

export interface SettingProps {
    id: number
    tempature: number
    humidity: number
    updateAt: TDateISO
  }
  
  export type BakeProps = Omit<SettingProps, 'update_at'>
