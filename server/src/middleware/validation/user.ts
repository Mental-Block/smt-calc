import { check, ValidationChain, query, Location, body, param } from 'express-validator';
import { ERRORS, USER, REGEX, ROLES } from '@const';
import { checkIfValueInObjectCheck } from './common';


export const username = (name: string, location: Location = 'body'): ValidationChain => {
    switch (location) {
        case 'query':
            return query(name)
            .optional({checkFalsy: true, nullable: true})
            .toLowerCase()
            .trim()
            .escape()
            .isString().withMessage(ERRORS.stringCheck).bail()
            .isLength({max: 100}).withMessage(ERRORS.max100Check).bail()
            .matches(REGEX.numbersLetter).withMessage(ERRORS.letandNumCheck).bail()        
    
        case 'params':
            return param(name)
            .toLowerCase()
            .trim()
            .escape()
            .isString().withMessage(ERRORS.stringCheck).bail()
            .isLength({max: 100}).withMessage(ERRORS.max100Check).bail()
            .matches(REGEX.numbersLetter).withMessage(ERRORS.letandNumCheck).bail()        
    

        default:
            return body(name)
            .toLowerCase()
            .trim()
            .escape()
            .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
            .isString().withMessage(ERRORS.stringCheck).bail()
            .isLength({max: 100}).withMessage(ERRORS.max100Check).bail()
            .matches(REGEX.numbersLetter).withMessage(ERRORS.letandNumCheck).bail()
    }
}

export const role = (name: string, location: Location = 'body'): ValidationChain => {
    switch (location) {
        case 'query':
            return query(name)
            .optional({checkFalsy: true, nullable: true})
            .escape()
            .trim()
            .toLowerCase()
            .isString().withMessage(ERRORS.lettersCheck).bail()
            .custom((value: string) => checkIfValueInObjectCheck(ROLES, value, ERRORS.invalidRole))
            .bail()        
    
        default:
            return body(name)
            .escape()
            .trim()
            .toLowerCase()
            .isString().withMessage(ERRORS.lettersCheck).bail()
            .isIn((Object.values(ROLES) as Array<keyof typeof ROLES>).map((val) => val))
            .withMessage(ERRORS.invalidRole)
            .bail()
    }
}

export const password: ValidationChain = 
    check(USER.password)
    .escape()
    .exists({checkFalsy: true}).withMessage(ERRORS.empty).bail()
    .isString().withMessage(ERRORS.stringCheck).bail()
    .isLength({max: 100}).withMessage(ERRORS.max100Check).bail()
    .isLength({min: 8}).withMessage(ERRORS.min8Check).bail()
    .matches(REGEX.password).withMessage(ERRORS.strongPasswordCheck).bail()
  
export const confirmPassword: ValidationChain = 
    check(USER.confirmPassword)
    .escape()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(ERRORS.passwordMatchCheck);
        }
        return true;
     })
     .bail()
    