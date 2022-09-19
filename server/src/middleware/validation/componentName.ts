import { ValidationChain, param, query, Location, body} from "express-validator"
import { ERRORS, REGEX } from "@const"

  export const componentName = (name: string, location: Location = 'body'): ValidationChain => {
    switch (location) {
      case 'query':
        return query(name)
          .optional({checkFalsy: true, nullable: true})  
          .escape()
          .trim()
          .isLength({ max: 100 })
          .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
          .matches(REGEX.partNames).withMessage(ERRORS.letandNumCheck).bail()
      case 'params': 
        return param(name)
        .escape()
        .trim()
        .isLength({ max: 100 })
        .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
        .matches(REGEX.partNames).withMessage(ERRORS.letandNumCheck).bail()
      default:
        return body(name)
          .escape()
          .trim()
          .isLength({ max: 100 })
          .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
          .matches(REGEX.partNames).withMessage(ERRORS.letandNumCheck).bail()
    }
  }