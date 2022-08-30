import { decode } from 'jsonwebtoken';

import { DataStoredInTokenProps } from '@interfaces/jsonToken';

import { ERRORS, ROLES } from '@const';
import { header } from 'express-validator';

const isAdmin = 
header("authorization")
.custom(async (_, {req}) => {
  try {
    let token = req.headers?.authorization.split(' ')[1]
    
    const verification = decode(token) as DataStoredInTokenProps;

    if(verification.role === ROLES.admin){
     return true
    }  
    return false
  } catch {
    throw new Error(ERRORS.invalidToken)
  }
})
.withMessage(ERRORS.invalidRole)
.bail()

export default isAdmin