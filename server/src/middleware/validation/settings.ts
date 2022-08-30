import { ERRORS } from "@const"
import { ValidationChain, Location, query, body } from "express-validator"

export const humidity = (name: string, location: Location = 'body'): ValidationChain => {
    switch (location) {
      case 'query':
        return query(name)
          .optional({checkFalsy: true, nullable: true})
          .escape()
          .toInt()
          .isInt().withMessage(ERRORS.numCheck).bail()
          
      default:
        return body(name)  
        .escape()
        .toInt()
        .isInt().withMessage(ERRORS.numCheck).bail()
    }
}

export const tempature = (name: string, location: Location = 'body'): ValidationChain => {
    switch (location) {
      case 'query':
        return query(name)
        .optional({checkFalsy: true, nullable: true})
        .escape()
        .toInt()
        .isInt().withMessage(ERRORS.numCheck).bail()
          
      default:
        return body(name)  
          .escape()
          .toInt()
          .isInt().withMessage(ERRORS.numCheck).bail()
    }
}
