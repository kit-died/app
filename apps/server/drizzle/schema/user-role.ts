import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { users } from './user'
import { roles } from './role-permission'

export const userRoles = pgTable('user-roles', {
  userId: integer('user_id').notNull().references(() => users.id),
  roleId: integer('role_id').notNull().references(() => roles.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] }),
}))

export const userRoleRelation = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}))