import { ERRORS, REGEX } from "@const";
import { ValidationChain, Location, query, body, param } from "express-validator";

export const bodyThickness = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
        .optional({checkFalsy: true, nullable: true})
        .trim()
        .escape()
        .toFloat()
        .isFloat().withMessage(ERRORS.numCheck).bail()
        .isLength({ max: 10 })
        .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()


    default:
      return body(name)  
      .trim()
      .escape()
      .toFloat()
      .isFloat().withMessage(ERRORS.numCheck).bail()
      .isLength({ max: 10 })
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
  }
}

export const pinCount = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
        .optional({checkFalsy: true, nullable: true})
        .trim()
        .escape()
        .toInt()
        .isNumeric()
        .isInt().withMessage(ERRORS.numCheck).bail()

    default:
      return body(name)  
      .trim()
      .escape()
      .toInt()
      .isInt().withMessage(ERRORS.numCheck).bail()
      .exists({checkNull: true}).withMessage(ERRORS.empty).bail()    
  }
}

export const description = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
        .optional({checkFalsy: true, nullable: true})
        .escape()
        .isString()
        .isLength({ max: 250 })
        .matches(REGEX.description)
        
    default:
      return body(name)  
      .optional({checkFalsy: true, nullable: true})
      .escape()
      .isString()
      .isLength({ max: 250 })
      .matches(REGEX.description)   
  }
}

export const vedor  = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
        .optional({checkFalsy: true, nullable: true})
        .escape()
        .isString()
        .isLength({ max: 50 })
        .matches(REGEX.numbersLetterWSpace)
        
    default:
      return body(name)  
      .escape()
      .isString()
      .isLength({ max: 50 })
      .matches(REGEX.numbersLetterWSpace)
  }
}

export const packageType = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
        .optional({checkFalsy: true, nullable: true})
        .escape()
        .matches(REGEX.numbersLetterWSpace)
        
    default:
      return body(name).toArray().isArray({ min: 0, max: 3 })
  }
}

export const partNumberInternal = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
        .optional({checkFalsy: true, nullable: true})
        .escape()
        .toUpperCase()
        .trim()
        .isLength({ max: 100 })
        .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
        .matches(REGEX.partNumber).withMessage(ERRORS.partNumberCheck).bail()
    case 'params': 
      return param(name)
        .escape()
        .toUpperCase()
        .trim()
        .isLength({ max: 100 })
        .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
        .matches(REGEX.partNumber).withMessage(ERRORS.partNumberCheck).bail()
    default:
      return body(name)
        .escape()
        .toUpperCase()
        .trim()
        .isLength({ max: 100 })
        .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
        .matches(REGEX.partNumber).withMessage(ERRORS.partNumberCheck).bail()
  }
}

export const partNumberManufactor = (name: string, location: Location = 'body'): ValidationChain => {
  switch (location) {
    case 'query':
      return query(name)
        .optional({checkFalsy: true, nullable: true})
        .escape()
        .toUpperCase()
        .trim()
        .isLength({ max: 100 })
        .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
        .matches(REGEX.partNumber).withMessage(ERRORS.partNumberCheck).bail()

    default:
      return body(name)  
      .escape()
      .toUpperCase()
      .trim()
      .isLength({ max: 100 })
      .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
      .matches(REGEX.numbersLetter).withMessage(ERRORS.letandNumCheck).bail()    
  }
}
