import { relations } from 'drizzle-orm'
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { UserStatus } from '../types'
import { userStatusEnum } from './enums'
import { userRoles } from './user-role'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username').unique().notNull(),
  name: varchar('name').notNull(),
  email: varchar('email').unique(),
  phone: varchar('phone'),
  avatar: varchar('avatar'),
  status: userStatusEnum('status').notNull().default(UserStatus.active),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userRelations = relations(users, ({ one, many }) => ({

  userRoles: many(userRoles),
}))