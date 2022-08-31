import { ValidationChain } from "express-validator"
import { ClientRequest } from "http"

export interface Route {
    method: InstanceType<typeof ClientRequest>['method'],
    route: string
    controller: any
    action: string
    validation: ValidationChain[]
  }
  