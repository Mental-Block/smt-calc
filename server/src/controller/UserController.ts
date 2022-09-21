import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { DOMAIN, ENTITY, REFRESH_TOKEN_COOKIE, USER, __prod__ } from "@const";
import User from "@entities/user";
import Table from "@util/Table";
import Token from "@util/Token";
import Auth from "@util/Auth";

import type { UsersTableQuery, UserProps  } from "@interfaces/user";
import type { DataStoredInTokenProps } from "@interfaces/jsonToken";

type LoginRequest = Request<{}, {}, Pick<UserProps, 'username' | 'password'>>
type AllRequest = Request<{}, {}, {}, Omit<UsersTableQuery, 'created_at' | 'password' | 'token_version' | 'updated_at' >>
type RegisterRequest = Request<{}, {}, Pick<UserProps, 'role' | 'username' | 'password'>>
type IsExistingUserRequest = Request<Pick<UserProps, 'username'>>
type RemoveRequest = Request<Pick<UserProps, 'id'>>
type SaveRequest = Request< Pick<UserProps, 'id'>, {}, Pick<UserProps, 'username' | 'role'>>

export default class UserController {
  private userRepository = getRepository(User);

  async refreshToken(req: Request, res: Response){
    try {
      const token = Token.decodeToken(req.cookies.refreshToken)

      if(!token) throw "Token is not valid!"

      const isExpired = Token.isTokenExpired(token)

      if(isExpired) throw "Token is expired!"
      
      const payload = Token.verifyToken(req.cookies.refreshToken)

      if(!payload.id) throw "Token is not valid!"

      const user = await this.userRepository.findOneOrFail({id: payload.id})
        
      if(user.tokenVersion !== payload.tokenVersion) throw "Wrong token permissions!"
      
      res.cookie(REFRESH_TOKEN_COOKIE, Token.createRefreshToken(user), {
        path: "/refreshtoken",
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__ ? true : false,
        domain: __prod__ ? DOMAIN : undefined
      })
      
      return { ok: true, accessToken: Token.createToken(user) }
    } catch (error: any) {
      throw new Error(error || "Couldn't get refresh token.")
    }
  }

  async login (req: LoginRequest, res: Response){
    const { username, password } = req.body;
    
    try {
      const user = await User.findOne({username}, {select: ['password', 'id', 'role', 'tokenVersion']})
      
      if(!user) throw "User is not valid!"

      const passwordCorrect = await Auth.comparePassword(password, user.password)

      if (!passwordCorrect) throw "User is not valid!"

      res.cookie(REFRESH_TOKEN_COOKIE, Token.createRefreshToken(user), {
        httpOnly: true,
        sameSite: __prod__ ? "strict" : "lax",
        secure: __prod__ ? true : false,
        domain: __prod__ ? DOMAIN : undefined
      })
      
      return {ok: true, accessToken: Token.createToken(user)}
    } catch (error: any) {
      throw new Error(error || "Failed to login")
    }
  }
  
  async logout (_req: Request, res: Response){
    try {
      res.cookie(REFRESH_TOKEN_COOKIE, "", {
          httpOnly: true,
          expires: new Date(0),
          sameSite: __prod__ ? "strict" : "lax",
          secure: __prod__ ? true : false,
          domain: __prod__ ? DOMAIN : undefined
      })

      return true
    } catch (error: any) {
      throw new Error(error || "Failed to logout")
    }
  }
  
  async all (req: AllRequest){
    const token = Token.decodeToken(req.headers["authorization"]?.split(" ")[1]!) as DataStoredInTokenProps
    const { page, pageSize, sortField, sortOrder } = req.query
    const { id, username, role } = req.query
      
    const createdPage = Table.createPage(page, pageSize)
    const createdSort = Table.createSort(sortField, sortOrder)

    try {
      const data = await this.userRepository.createQueryBuilder(`${ENTITY.user}`)  
      .select([
        `${ENTITY.user}.${USER.id}`, 
        `${ENTITY.user}.${USER.username}`, 
        `${ENTITY.user}.${USER.role}`
      ]) 
      .where(`${ENTITY.user}.${USER.id} != :${USER.id}`, { id: token.id })
      .andWhere(`${ENTITY.user}.${USER.id} != :${USER.id}`, { id: process.env.SUPER_ADMIN_ID })
      .andWhere(id ? `${ENTITY.user}.${USER.id} ::TEXT LIKE :userId` : `TRUE`, { userId: `%${id}%`})
      .andWhere(username ? `${ENTITY.user}.${USER.username} ILIKE :username` : `TRUE`, {username: `%${username}%`})
      .andWhere(role ? `${ENTITY.user}.${USER.role} = ANY(STRING_TO_ARRAY(:${USER.role},' ')::TEXT[])` : `TRUE`, {role})
      .skip(createdPage.skip)
      .take(createdPage.pageSize)
      .orderBy(createdSort.sortField, createdSort.sortOrder)
      .getManyAndCount()

      return { records: data[0] , pageLength: data[1] }
    } catch (error: any) {
      throw new Error(error || 'Failed to get user records!')
    }
  }

  async register (req: RegisterRequest){
    const { username, password, role } = req.body;

    try{
      const user = await this.userRepository.findOne({ username })

        if (user) throw "User already exsit!"
        
      const salt = await Auth.genSalt()
      const hashPassword = await Auth.hash(password, salt);

      const newlyCreatedUser = this.userRepository.create({username, password: hashPassword, role})
      const newUser = await this.userRepository.save(newlyCreatedUser);

      return { 
        id: newUser.id,  
        role: newUser.role,
        username: username,
      }
    } catch (error: any) {
      throw new Error(error || 'Failed to register user!')
    }
  }

  async delete (req: RemoveRequest){
    const { id } = req.params

    try {
      await this.userRepository.delete(id);

      return true
    } catch (error: any) {
      throw new Error(error || 'Failed to delete user!')
    }
  }

  async save (req: SaveRequest, _res: Response){
    const { id } = req.params
    const { username, role } = req.body
    
    try {
      const user = await this.userRepository.findOneOrFail({id});

      if(!user) throw "User doesn't exsits."
    
      this.userRepository.merge(user, { role, username });
      
      await this.userRepository.save(user);

      return true;
    } catch (error: any) {
      throw new Error(error || 'Failed to save user!')
    }
  }
  
  async isExistingUser (req: IsExistingUserRequest){
    let { username } = req.params; 

    const user = await this.userRepository.findOne({ username })

    if (user?.username) return true
    
    return false
  }
}