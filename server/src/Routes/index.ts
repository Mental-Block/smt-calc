import { Route } from '@interfaces/route'

import UserRoutes from "./UserRoutes"
import SettingsRoutes from './SettingsRoutes'
import ComponentRoutes from './ComponentRoutes'
import LabelRoutes from './LabelRoutes'
import FloorlifeRoutes from './FloorlifeRoutes'
import BakeRoutes from './BakeRoutes'

const Routes: Route[] = [
    ...UserRoutes,
    ...SettingsRoutes,
    ...ComponentRoutes,
    ...LabelRoutes,
    ...FloorlifeRoutes,
    ...BakeRoutes
  ]
  
export default Routes