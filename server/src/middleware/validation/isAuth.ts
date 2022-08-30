import { verify } from 'jsonwebtoken';

import { DataStoredInTokenProps } from '@interfaces/jsonToken'

import { ERRORS } from '@const';
import { header } from 'express-validator';

const isAuth = 
header("authorization")
.custom(async (_, {req}) => {
  try {
    let token = req.headers?.authorization.split(' ')[1]
    
    const verification = verify(token, process.env.JWT_SECRET!) as DataStoredInTokenProps;
    const id = verification.id;

    if(id){
     return true
    }    
    
    return false
  } catch {
    throw new Error(ERRORS.invalidToken)
  }
})
.withMessage(ERRORS.invalidUserPermision)
.bail()

export default isAuth