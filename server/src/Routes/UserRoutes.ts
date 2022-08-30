import { Route } from "@interfaces/route";
import UserController from "@controller/UserController";

import { isAdmin, isAuth, id, refreshCookie } from "@middleware/validation";
import { page, pageSize, sortFeild, sortOrder } from "@middleware/validation/table"
import { username, password, role, confirmPassword } from "@middleware/validation/user"
import { USER } from "@const";

const user = '/users'

export const UserRoutes: Route[] = [
    {
    method: "get",
    route: `${user}`,
    controller: UserController,
    action: "all",
    validation: [
      isAuth, 
      isAdmin,
      page,
      pageSize,
      sortFeild, 
      sortOrder,
      id(`${USER.id}`, 'query'),
      username(`${USER.username}`, 'query'),
      role(`${USER.role}`, 'query'),
    ],
  },  
  {
    method: "post",
    route: `${user}/refreshtoken`,
    controller: UserController,
    action: "refreshToken",
    validation: [
      refreshCookie,
    ],
  },
  {
    method: "post",
    route: `${user}/login`,
    controller: UserController,
    action: "login",
    validation: [
      username(`${USER.username}`),
      password
    ]
  },
  {
    method: "get",
    route: `${user}/logout`,
    controller: UserController,
    action: "logout",
    validation: [],
  },
  {
    method: "post",
    route: `${user}/register`,
    controller: UserController,
    action: "register",
    validation: [
      isAuth, 
      isAdmin,
      role(`${USER.role}`),
      username(`${USER.username}`),
      confirmPassword
    ]
  },
  {
    method: "post",
    route: `${user}/:${USER.username}`,
    controller: UserController,
    action: "isExistingUser",
    validation: [
      username(`${USER.username}`, 'params'),
    ]
  },
  {
    method: "delete",
    route: `${user}/:${USER.id}`,
    controller: UserController,
    action: "delete",
    validation: [
      isAuth, 
      isAdmin,
      id(`${USER.id}`, 'params'),
    ]
  },
  {
    method: "patch",
    route: `${user}/:${USER.id}`,
    controller: UserController,
    action: "save",
    validation: [
      isAuth, 
      isAdmin,
      id(`${USER.id}`, 'params'),
      username(`${USER.username}`),
      role(`${USER.role}`),
    ]
  },
];

export default UserRoutes

