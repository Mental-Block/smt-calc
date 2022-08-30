import { Route } from "@interfaces/route";

import { isAuth } from "@middleware/validation";

import BakingController from "@controller/ComponentController";



const bakeComponents = '/bake/components'

const BakeRoutes: Route[] = [
    {
        method: "get",
        route: `${bakeComponents}`,
        controller: BakingController,
        action: "all",
        validation: [
          isAuth,
        ],
      }, 
]

export default BakeRoutes