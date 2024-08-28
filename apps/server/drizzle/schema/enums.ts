import { pgEnum } from 'drizzle-orm/pg-core'
import { UserStatus } from '../types'

export function enumToPgEnum<T extends Record<string, string>>(myEnum: T): [T[keyof T], ...(T[keyof T])[]] {
  return Object.values(myEnum) as [T[keyof T], ...(T[keyof T])[]]
}

export const userStatusEnum = pgEnum('user_status', enumToPgEnum(UserStatus))
