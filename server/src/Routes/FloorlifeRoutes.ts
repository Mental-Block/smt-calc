import { ENTITY, FLOOR_LIFE, LABEL } from "@const";
import FloorlifeController from "@controller/FloorlifeController";
import { Route } from "@interfaces/route";
import { createdAt, id, isAuth, updatedAt } from "@middleware/validation";
import { partId } from "@middleware/validation/label";
import { partNumberInternal } from "@middleware/validation/component";
import { availableAt, mslLevel, status } from "@middleware/validation/msl";

const floorlife = `/floorlife`

const FloorlifeRoutes: Route[] = [
    {
        method: "get",
        route: floorlife,
        controller: FloorlifeController,
        action: "all",
        validation: [
          isAuth,
          id(`${FLOOR_LIFE.id}`, 'query'),
          partId(`${ENTITY.label}_${LABEL.partId}`, 'query'),
          partNumberInternal(`${ENTITY.label}_${ENTITY.component}_${LABEL.partId}`, 'query'),
          mslLevel(`${FLOOR_LIFE.level}`, 'query'),
          availableAt(`${FLOOR_LIFE.availableAt}`, 'query'),
          status(`${FLOOR_LIFE.status}`, 'query'),
          createdAt(`${FLOOR_LIFE.createdAt}`, 'query'),
          updatedAt(`${FLOOR_LIFE.updatedAt}`, 'query')
        ],
      }, 
      {
        method: "post",
        route: `${floorlife}/:${LABEL.partId}`,
        controller: FloorlifeController,
        action: "add",
        validation: [
          isAuth,
          id(`${LABEL.partId}`, 'params')
        ],
      }, 
      {
        method: "post",
        route: `${floorlife}/unpause/:${FLOOR_LIFE.id}`,
        controller: FloorlifeController,
        action: "unpause",
        validation: [
          isAuth,
          id(`${FLOOR_LIFE.id}`, 'params'),
        ],
      }, 
      {
        method: "post",
        route: `${floorlife}/pause/:${FLOOR_LIFE.id}`,
        controller: FloorlifeController,
        action: "pause",
        validation: [
          isAuth,
          id(`${FLOOR_LIFE.id}`, 'params'),
        ],
      }, 
      {
        method: "delete",
        route: `${floorlife}/:${FLOOR_LIFE.id}`,
        controller: FloorlifeController,
        action: "del",
        validation: [
          isAuth,
          id(`${FLOOR_LIFE.id}`, 'params'),
        ],
      }, 
]

export default FloorlifeRoutes