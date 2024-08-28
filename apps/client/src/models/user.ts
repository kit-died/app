import { Model } from './model'

export enum UserStatus {
  active = 'active',
  inactive = 'inactive',
  blocked = 'blocked'
}

export type User = Model<{
  __typename?: 'UserDto' | undefined
  name: string
  username: string
  email?: string | null | undefined
  phone?: string | null | undefined
  avatar?: string | null | undefined
  status: UserStatus
}>

export interface ISiriusUser {
  id: number
  name: string
  code: string
  username?: string
  email: string
  authenticationMethod?: string
  createdAt?: string
  deletedAt?: string
  extension?: string
  lastLogin?: string
  mobile?: string
  phone?: string
  status: string
  updatedAt?: string
  branchId?: number | null
}