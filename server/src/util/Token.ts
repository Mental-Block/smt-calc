import jwt, { decode, JwtPayload, verify } from "jsonwebtoken";

import { AuthToken, DataStoredInTokenProps, RefreshDataInTokenProps } from "@interfaces/jsonToken";

export default class Token {
  static createRefreshToken (userData: RefreshDataInTokenProps) : string {

    const { id, role, tokenVersion } = userData

    const expiresIn : number = 60 * 60 * 24; // 7 days
    const secret = process.env.JWT_REFRESH_SECRET!;
    const dataStoredInToken: RefreshDataInTokenProps = {
        id, 
        role, 
        tokenVersion
    };
    
    return jwt.sign(dataStoredInToken, secret, { expiresIn })
  }

  static createToken (userData: DataStoredInTokenProps) : string {
    const { id, role } = userData

    const expiresIn : number = 60 * 10; // 10 min
    const secret = process.env.JWT_SECRET!;
    const dataStoredInToken: DataStoredInTokenProps = {
      id,
      role
    };
    
    return jwt.sign(dataStoredInToken, secret, { expiresIn })
  }

  static isTokenExpired (token: JwtPayload): boolean {
    if(token.exp) {
      if(token.exp * 1000 <= Date.now()) {
        return true
      } 
    }
    return false
  }

  static decodeToken (token: AuthToken) {
   return decode(token as string) as JwtPayload
  }

  static verifyToken (token: AuthToken) {
    return verify(token as string, process.env.JWT_REFRESH_SECRET!) as RefreshDataInTokenProps;
  }
}