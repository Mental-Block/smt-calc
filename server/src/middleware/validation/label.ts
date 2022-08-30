import { ValidationChain, query, Location, body } from 'express-validator';
import { ERRORS } from '@const';


export const partId = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
      .optional({checkFalsy: true, nullable: true})
      .escape()
      .trim()
      .toInt()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .isInt().withMessage(ERRORS.numCheck).bail()
  
    default:
       return body(name)
      .escape()
      .trim()
      .toInt()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .isInt().withMessage(ERRORS.numCheck).bail()
  }
}