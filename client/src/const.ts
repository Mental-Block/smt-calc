import { PackageType } from '@interfaces/component'
import { MSLLevelType, MSLStatusType } from '@interfaces/msl'
import { roleType } from '@interfaces/user'

export const REGEX = {
  password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,100}$/,
  numbersLetter: /^[a-z0-9A-Z]+$/,
  partNumber: /^[A-Za-z0-9-]+$/,
  letters: /^[a-zA-Z]+$/,
  numbers: /^[0-9.]+$/,
}

export const MSL_LEVEL_OPTIONS: MSLLevelType[] = [
  '1',
  '2',
  '2a',
  '3',
  '4',
  '5',
  '5a',
  '6',
]

export const MSL_STATUS_OPTIONS: MSLStatusType[] = [
  'EXPIRED',
  'EXPIRING',
  'PAUSED',
  'RECOVERED',
  'RECOVERING',
]

export const PACKAGE_TYPE_OPTIONS: PackageType[] = ['reel', 'tray', 'tube']

export const ROLE_OPTIONS: roleType[] = ['admin', 'user']

export const PATH = {
  ROOT: '/',
  DASHBOARD: '/dashboard',
  MSL: `/dashboard/msl`,
  BAKE: `/dashboard/msl/bake`,
  FOUROHFOUR: '/fourohfour',
}

/* Defined in webpack folders*/
const ENV_API = process.env.NODE_ENV === 'development' ? 'api' : process.env.API

export const API = {
  ROOT: ENV_API,
  COMPONENT: `${ENV_API}/components`,
  COMPONENT_NAME: `${ENV_API}/components/name`,
  SETTINGS: `${ENV_API}/settings`,
  USER: `${ENV_API}/users`,
  FLOORLIFE: `${ENV_API}/floorlife`,
  BAKE_COMPONENT: `${ENV_API}/bake/components`,
  BAKE_TIMESHEET: `${ENV_API}/bake/timesheet`,
  LABEL: `${ENV_API}/labels`,
}

export enum BREAK_POINTS {
  xs = 480,
  sm = 576,
  md = 768,
  lg = 992,
  xl = 1200,
  xxl = 1600,
}

export enum TIME {
  NOW = 0,
  ONE_SECOND = 1000,
  ONE_MINUTE = 60000,
  ONE_DAY = 86400000,
  EIGHT_HOURS = 28800000,
}

export enum ROLE {
  user = 'user',
  admin = 'admin',
}
