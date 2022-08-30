import { ERRORS, MSL_LEVEL, MSL_STATUS, REGEX } from "@const";
import { query, ValidationChain, Location, body } from "express-validator";

import { checkIfValueInObjectCheck } from "./common";


export const mslLevel = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
      .optional({checkFalsy: true, nullable: true})
      .escape()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .custom((value: string) => checkIfValueInObjectCheck(MSL_LEVEL, value, ERRORS.notMSLLevel))
      .matches(REGEX.numbersLetterWSpace).withMessage(ERRORS.letandNumCheck).bail()

    default:
      return body(name)
      .escape()
      .isLength({ max: 2 })
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .matches(REGEX.numbersLetter).withMessage(ERRORS.letandNumCheck).bail()    
  }
}

export const availableAt = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
      .optional({checkFalsy: true, nullable: true})
      .toDate()
      .escape()
      .trim()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .isISO8601().withMessage(ERRORS.notDate).bail()

    default:
      return body(name)
      .toDate()
      .escape()
      .trim()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .isDate().withMessage(ERRORS.notDate).bail()  
  }
}

export const status = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
      .optional({checkFalsy: true, nullable: true})
      .escape()
      .toUpperCase()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .custom((value: string) => checkIfValueInObjectCheck(MSL_STATUS, value, ERRORS.notAStatus))
      .matches(REGEX.lettersWSpace).withMessage(ERRORS.lettersCheck).bail()

    default:
      return body(name)
      .escape()
      .toUpperCase()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .custom((value: string) => checkIfValueInObjectCheck(MSL_STATUS, value, ERRORS.notAStatus))
      .matches(REGEX.lettersWSpace).withMessage(ERRORS.lettersCheck).bail()
  }
}