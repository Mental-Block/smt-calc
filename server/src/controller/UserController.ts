import { Request, Response } from "express";
import { getRepository } from "typeorm";

import { DOMAIN, ENTITY, ERRORS, REFRESH_TOKEN_COOKIE, USER, __prod__ } from "@const";

import User from "@entities/user";

import { UsersTableQuery, UserProps  } from "@interfaces/user";
import { DataStoredInTokenProps } from "@interfaces/jsonToken";

import Table from "@util/Table";
import Token from "@util/Token";
import Auth from "@util/Auth";

type LoginRequest = Request<{}, {}, Pick<UserProps, 'username' | 'password'>>
type AllRequest = Request<{}, {}, {}, Omit<UsersTableQuery, 'created_at' | 'password' | 'token_version' | 'updated_at' >>

type RegisterRequest = Request<{}, {}, Pick<UserProps, 'role' | 'username' | 'password'>>

type IsExistingUserRequest = Request<Pick<UserProps, 'username'>>
type RemoveRequest = Request<Pick<UserProps, 'id'>>

type SaveRequest = Request< Pick<UserProps, 'id'>, {}, Pick<UserProps, 'username' | 'role'>>

export default class UserController {
  private userRepository = getRepository(User);

  async refreshToken(req: Request, res: Response){
    const token = Token.decodeToken(req.cookies.refreshToken)

    if(!token) throw new Error(ERRORS.invalidToken)

    const isExpired = Token.isTokenExpired(token)

    if(isExpired) throw new Error(ERRORS.expiredToken)
    
    const payload = Token.verifyToken(req.cookies.refreshToken)

    if(!payload.id) throw new Error(ERRORS.invalidToken)

    const user = await this.userRepository.findOneOrFail({id: payload.id})
      
    if(user.tokenVersion !== payload.tokenVersion) throw new Error(ERRORS.invalidUserPermision)
    
    res.cookie(REFRESH_TOKEN_COOKIE, Token.createRefreshToken(user), {
      path: "/refreshtoken",
      httpOnly: true,
      sameSite: "lax",
      secure: __prod__ ? true : false,
      domain: __prod__ ? DOMAIN : undefined
    })
    
    return { ok: true, accessToken: Token.createToken(user) }
  }

  async login (req: LoginRequest, res: Response){
    const { username, password } = req.body;
    
    const user = await User.findOne({username}, {select: ['password', 'id', 'role', 'tokenVersion']})
    
    if(!user) throw new Error(ERRORS.invalidUser)

    const passwordCorrect = await Auth.comparePassword(password, user.password)

    if (!passwordCorrect) throw new Error(ERRORS.invalidUserPermision) 

    res.cookie(REFRESH_TOKEN_COOKIE, Token.createRefreshToken(user), {
      httpOnly: true,
      sameSite: __prod__ ? "strict" : "lax",
      secure: __prod__ ? true : false,
      domain: __prod__ ? DOMAIN : undefined
    })
    
    return {ok: true, accessToken: Token.createToken(user)}
  }
  
  async logout (_req: Request, res: Response){
    res.cookie(REFRESH_TOKEN_COOKIE, "", {
         httpOnly: true,
         expires: new Date(0),
         sameSite: __prod__ ? "strict" : "lax",
         secure: __prod__ ? true : false,
         domain: __prod__ ? DOMAIN : undefined
    })
    
    return { ok: false, accessToken: null }
  }
  
  async all (req: AllRequest){
    const token = Token.decodeToken(req.headers["authorization"]?.split(" ")[1]!) as DataStoredInTokenProps

    const { page, pageSize, sortField, sortOrder } = req.query
    const { id, username, role } = req.query
      
    const createdPage = Table.createPage(page, pageSize)
    const createdSort = Table.createSort(sortField, sortOrder)

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
  }

  async register (req: RegisterRequest){
    const { username, password, role } = req.body;

    const user = await this.userRepository.findOne({ username })

      if (user) throw new Error(ERRORS.userExists)
       
    const salt = await Auth.genSalt()
    const hashPassword = await Auth.hash(password, salt);

    const newlyCreatedUser = this.userRepository.create({username, password: hashPassword, role})
    const newUser = await this.userRepository.save(newlyCreatedUser);

    const userData: Partial<UserProps> = { 
      id: newUser.id,  
      role: newUser.role,
      username: username,
    }

    return userData
  }

  async delete (req: RemoveRequest){
    const { id } = req.params

    await this.userRepository.delete(id);

    return true
  }

  async save (req: SaveRequest, _res: Response){
    const { id } = req.params
    const { username, role } = req.body
    
    const user = await this.userRepository.findOneOrFail({id});

    if(!user) throw new Error(ERRORS.invalidUser)
  
    this.userRepository.merge(user, { role, username });
    
    await this.userRepository.save(user);

    return true;
  }
  
  async isExistingUser (req: IsExistingUserRequest){
    let { username } = req.params; 

    const user = await this.userRepository.findOne({ username })

    if (user?.username) return true
    
    return false
  }
}