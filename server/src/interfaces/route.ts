import { ValidationChain } from "express-validator"

export interface Route {
    method: InstanceType<typeof Request>['method'],
    route: string
    controller: any
    action: string
    validation: ValidationChain[]
  }
  