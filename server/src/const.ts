import { ComponentNameProps, ComponentProps } from "@interfaces/component"
import { LabelProps } from "@interfaces/label"
import { MSLLevelType, FloorLifeProps, MSLStatusType } from "@interfaces/msl"
import { SettingProps } from "@interfaces/setting"
import { TableProps } from "@interfaces/table"
import { RegisterUserProps, UserRoleType, } from "@interfaces/user"

export const __prod__ = process.env.NODE_ENV === "production"
export const TOKEN_COOKIE = "token"
export const REFRESH_TOKEN_COOKIE = "refreshToken"
export const DOMAIN = ".smt-calc.com"
export const MAX_REFLOW_PASSES = 3

// settings ROUTEs needs save to have validation
// 220°C - 225°C maximum reflow temperature

export enum TIME {
  EIGHT_HOURS = 28800000, // ms
  TWELVE_HOURS = 43200000, // ms
  NOW = 0,
}


export enum ENTITY {
  user = "users",
  settings = "settings",
  bake = "bake",
  bakecomponent = 'bakecomponent',
  floorlife = "floorlife",
  label = "label",
  componentname = "componentname",
  component = "component",
}

export enum ERRORS {
  max100Check = "Can't be longer than 100 characters!",
  min8Check = "Can't be shorter than 8 characters!",
  letandNumCheck = "Only letters and numbers!",
  lettersCheck = "Only letters!",
  numCheck = "Is not a number!",
  stringCheck = "Only characters!",
  strongPasswordCheck = "Password must have a lowercase, uppercase, special character!",
  passwordMatchCheck = "The two passwords that you entered do not match!",
  partNumberCheck = "Only letters, numbers and - special character!", 
  empty = "Can't be empty!",
  userExists = "User already exsit!",
  notIdExists = "Id doesn't exsit!",
  expiredToken = "Token is expired!",
  invalidToken = "Token is not valid!",
  invalidUser = "User is not valid!",
  invalidRole = "Not a valid role!",
  invalidPartNumber = "Part Number is not valid!",
  invalidUserPermision = "User is not permitted!",
  invalidRequest = "",
  notBoolean = "Not a boolean!",
  notDate = "Not a Date!",
  notColumn = "Not a Column!",
  componentNotFound = "no component found!",
  labelNotFound = "no label found!",
  mslNotFound ="no msl found!",
  internalPartNumberNotFound = "no part number found!",
  mslInuse = 'This msl is in use!',
  componentInUse = 'This component is in use!',
  labelInUse = 'This label is in use!',
  notMSLLevel = 'Not a msl level!',
  notAStatus = 'Not a msl status!'
}

export const REGEX = {
    password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/, 
    numbersLetter: /^[A-Za-z0-9]+$/,
    numbersLetterWSpace:  /^[A-Za-z 0-9]+$/,
    partNumber: /^[A-Za-z0-9-]+$/,
    letters: /^[a-zA-Z]+$/,
    lettersWSpace: /^[a-z A-Z]+$/,
    description: /^(.|\s)*[a-zA-Z]+(.|\s)*$/,
    partNames:  /^[A-Za-z 0-9()]+$/,
}

export const MSL_FLOOR_LIFE: Record<MSLLevelType, number>  = {
  '1': 365 * 100, // Unlimited at ≤30°C/85% RH 
  '2': 360, // 360 days
  '2a': 28, // 28 days
  '3': 7,  // 7 days
  '4': 3, // 3 days
  '5': 2, // 2 days
  '5a': 1, // 1 day
  '6': 0, // Now
}

export const ROLES:  Record<UserRoleType, UserRoleType> = {
  user: "user",
  admin: "admin", 
}

export const MSL_LEVEL: Record<MSLLevelType, MSLLevelType> = {
  '1': '1',
  '2': '2',
  '2a': '2a',
  '3': '3',
  '4': '4',
  '5': '5',
  '5a': '5a',
  '6': '6'
}

export const MSL_STATUS: Record<MSLStatusType, MSLStatusType> = {
    RECOVERED: 'RECOVERED',
    RECOVERING: "RECOVERING",
    PAUSED: "PAUSED",
    EXPIRING: "EXPIRING",
    EXPIRED: "EXPIRED",
}

export const FLOOR_LIFE: Record<keyof FloorLifeProps, string> = { 
  id: "id", 
  level: "level", 
  status: "status",
  availableAt: "availableAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};

export const LABEL: Record<keyof LabelProps, keyof LabelProps> = {
  id: 'id',
  partId: 'partId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
}

export const SETTINGS: Record<keyof SettingProps, keyof SettingProps> = {
  id:  "id",
  tempature:  "tempature",
  humidity:  "humidity",
  updateAt: "updateAt"
}

export const BAKE = SETTINGS

export const USER: Record<keyof RegisterUserProps, keyof RegisterUserProps> = {
  id :'id',
  username : "username",
  password :"password",
  confirmPassword : "confirmPassword",
  role : "role",
  tokenVersion : "tokenVersion",
  createdAt : "createdAt",
  updatedAt : "updatedAt", 
}

export const COMPONENTNAME: Record<keyof ComponentNameProps, keyof ComponentNameProps> =  { 
  id: 'id',
  name: 'name',
}

export const COMPONENT: Record<keyof ComponentProps, string> =  {
  id: "id",
  pinCount: "pinCount",
  bodyThickness: "bodyThickness",
  description: "description",
  createdAt:  "createdAt",
  updatedAt:  "updatedAt",
  name: "name",
  vendor: "vendor",
  partnumberInternal: 'partnumberInternal',
  partnumberManufactor: 'partnumberManufactor',
  packageType: 'packageType',
  mslLevel: "mslLevel"
} 

export const TABLE: Record<keyof TableProps, string> = {
  page: "page",
  pageSize: "pageSize",
  sortField: "sortField",
  sortOrder: "sortOrder",
  skip: "skip",
}