import { SETTINGS } from "@const";
import SettingsController from "@controller/SettingsController";
import { Route } from "@interfaces/route";

import { id, isAdmin, isAuth } from "@middleware/validation";
import { humidity, tempature } from "@middleware/validation/settings";

const SettingsRoutes: Route[] = [
    {
        method: "get",
        route: "/settings",
        controller: SettingsController,
        action: "all",
        validation: [
          isAdmin,
          isAuth,
        ],
      }, 
      {
        method: "patch",
        route: "/settings/save",
        controller: SettingsController,
        action: "save",
        validation: [
          isAdmin,
          isAuth,
          id(`${SETTINGS.id}`),
          humidity(`${SETTINGS.humidity}`),
          tempature(`${SETTINGS.tempature}`)
        ],
      }, 
]

export default SettingsRoutes