import ComponentController from "@controller/ComponentController";

import { COMPONENT, COMPONENTNAME } from "@const";

import { Route } from "@interfaces/route";

import { isAdmin, isAuth, id } from "@middleware/validation";
import { mslLevel } from "@middleware/validation/msl";
import { bodyThickness, pinCount, description, vedor, packageType, partNumberInternal, partNumberManufactor  } from "@middleware/validation/component";
import { componentName } from "@middleware/validation/componentName";

import { page, pageSize, sortFeild, sortOrder } from "@middleware/validation/table";
import ComponentNameController from "@controller/ComponentNameController";

const component = '/components'
const componentname = "/components/name"

const ComponentRoutes: Route[] = [
    {
      method: "get",
      route: component,
      controller: ComponentController,
      action: "all",
      validation: [
        isAdmin,
        isAuth,
        page,
        pageSize,
        sortFeild, 
        sortOrder,
        partNumberInternal(`${COMPONENT.partnumberInternal}`, 'query'),
        partNumberManufactor(`${COMPONENT.partnumberManufactor}`, 'query'),
        vedor(`${COMPONENT.vendor}`, 'query'),
        mslLevel(`${COMPONENT.mslLevel}`, 'query'),
        componentName(`${COMPONENT.name}`, 'query'),  
        bodyThickness(`${COMPONENT.bodyThickness}`, 'query'),
        pinCount(`${COMPONENT.pinCount}`, 'query'),
        description(`${COMPONENT.description}`, 'query'),
        packageType(`${COMPONENT.packageType}`, 'query')
      ],
    }, 
    {
      method: "post",
      route: `${component}/add`,
      controller: ComponentController,
      action: "add",
      validation: [
        isAdmin,
        isAuth,
        partNumberInternal(`${COMPONENT.partnumberInternal}`),
        partNumberManufactor(`${COMPONENT.partnumberManufactor}`),
        vedor(`${COMPONENT.vendor}`),
        mslLevel(`${COMPONENT.mslLevel}`),
        componentName(`${COMPONENT.name}`),       
        bodyThickness(`${COMPONENT.bodyThickness}`),
        pinCount(`${COMPONENT.pinCount}`),
        description(`${COMPONENT.description}`),
        packageType(`${COMPONENT.packageType}`)
      ],
    }, 
    {
      method: "delete",
      route: `${component}/:${COMPONENT.id}`,
      controller: ComponentController,
      action: "del",
      validation: [
        isAdmin,
        isAuth,
        id(`${COMPONENT.id}`, 'params'),
      ],
    }, 
    {
      method: "patch",
      route: `${component}/:${COMPONENT.id}`,
      controller: ComponentController,
      action: "save",
      validation: [
        isAdmin,
        isAuth,
        id(`${COMPONENT.id}`, 'params'),
        partNumberInternal(`${COMPONENT.partnumberInternal}`),
        partNumberManufactor(`${COMPONENT.partnumberManufactor}`),
        vedor(`${COMPONENT.vendor}`),
        mslLevel(`${COMPONENT.mslLevel}`),
        componentName(`${COMPONENT.name}`),   
        bodyThickness(`${COMPONENT.bodyThickness}`),
        pinCount(`${COMPONENT.pinCount}`),
        description(`${COMPONENT.description}`),
        packageType(`${COMPONENT.packageType}`)
      ],
    }, 
    {
      method: "post",
      route: `${component}/:${COMPONENT.partnumberInternal}`,
      controller: ComponentController,
      action: "isMultipleInternalPartNumber",
      validation: [
        isAuth,
        partNumberInternal(`${COMPONENT.partnumberInternal}`, 'params')
      ],
    },
    {
      method: "get",
      route: `${componentname}`,
      controller: ComponentNameController,
      action: "all",
      validation: [
        isAdmin,
        isAuth,
        componentName(`${COMPONENTNAME.name}`, 'query')
      ],
    }, 
    {
      method: "delete",
      route: `${componentname}/:${COMPONENTNAME.id}`,
      controller: ComponentNameController,
      action: "del",
      validation: [
        isAdmin,
        isAuth,
        id(`${COMPONENTNAME.id}`, 'params')
      ],
    }, 
    {
      method: "post",
      route: `${componentname}/add`,
      controller: ComponentNameController,
      action: "add",
      validation: [
        isAdmin,
        isAuth,
        componentName(`${COMPONENTNAME.name}`, 'body')
      ],
    }, 
]

export default ComponentRoutes