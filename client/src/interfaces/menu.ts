import type { MenuProps } from 'antd/lib/menu'

export type ItemType = Required<MenuProps>['items'][number]
export type MenuItem = ItemType & { path?: string; id?: number }
