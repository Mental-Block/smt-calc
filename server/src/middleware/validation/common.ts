import { cookie, param, query, ValidationChain, Location, body } from "express-validator"
import { ERRORS, REFRESH_TOKEN_COOKIE } from "@const"

export const checkIfValueInObjectCheck = (obj: object, value: string, errorMsg?: string) => {
  const values = Object.values(obj).map((val) => val)
  if(values.map(val => val !== value)){

  const levelsArr = value.split(' ')
  let regex = values.join(' ')

    if(levelsArr.map(value => value.match(regex))){
        return true
    }

    throw new Error(errorMsg);
  }

  return true
}

export const id = (name: string, location: Location = 'body'): ValidationChain => {
    switch (location) {
      case 'query':
        return query(name)
        .optional({checkFalsy: true, nullable: true})
        .escape()
        .trim()
        .toInt()
        .isInt()
        .withMessage(ERRORS.numCheck)
        .bail()

      case 'params':
        return param(name)
        .escape()
        .trim()
        .toInt()
        .exists({checkFalsy: true})
        .withMessage(ERRORS.empty)
        .bail()
        .isInt()
        .withMessage(ERRORS.numCheck)
        .bail()
  
      default:
        return body(name)
        .escape()
        .trim()
        .toInt()
        .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
        .isInt().withMessage(ERRORS.numCheck).bail()
    }
}

export const refreshCookie: ValidationChain = 
    cookie(REFRESH_TOKEN_COOKIE)
    .isJWT()
    .withMessage(ERRORS.invalidToken)
    .bail()

export const createdAt = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
      .optional({checkFalsy: true, nullable: true})
      .toDate()
      .escape()
      .trim()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .isDate().withMessage(ERRORS.notDate).bail()  

    default:
      return body(name)
      .toDate()
      .escape()
      .trim()
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .isDate().withMessage(ERRORS.notDate).bail()  
  }
}

export const updatedAt = (name: string, location: Location = 'body'): ValidationChain => createdAt(name, location)