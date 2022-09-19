import { COMPONENT, ENTITY, LABEL } from "@const";
import LabelController from "@controller/LabelController";
import { Route } from "@interfaces/route";

import { id, isAuth } from "@middleware/validation";
import { partNumberInternal, partNumberManufactor } from "@middleware/validation/component";
import { page, pageSize, sortFeild, sortOrder } from "@middleware/validation/table";

const labels = `/labels`

const LabelRoutes: Route[] = [
    {
        method: "get",
        route: `${labels}`,
        controller: LabelController,
        action: "all",
        validation: [
          isAuth,
          page,
          pageSize,
          sortFeild, 
          sortOrder,
          partNumberInternal(`${ENTITY.component}_${COMPONENT.partnumberInternal}`, 'query'),
          partNumberManufactor(`${ENTITY.component}_${COMPONENT.partnumberManufactor}`, 'query'),
          id(`${LABEL.partId}`, 'query'),
        ],
      }, 
      {
        method: "delete",
        route: `${labels}/:${LABEL.id}`,
        controller: LabelController,
        action: "del",
        validation: [
          isAuth,
          id(`${LABEL.id}`, 'params'),
        ],
      }, 
      {
        method: "post",
        route: `${labels}/add`,
        controller: LabelController,
        action: "add",
        validation: [
          isAuth,
          id(`${LABEL.partId}`, 'body'),
          partNumberInternal(`${COMPONENT.partnumberInternal}`, 'body'),
          partNumberManufactor(`${COMPONENT.partnumberManufactor}`, 'body'),
        ],
      }, 
]

export default LabelRoutes