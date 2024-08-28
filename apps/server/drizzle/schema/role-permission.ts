import { pgTable, integer, serial, varchar, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  isSystemRole: boolean('is_system_role').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const permissions = pgTable('permissions', {
  id: varchar('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const rolePermissions = pgTable('role_permissions', {
  roleId: integer('role_id').notNull().references(() => roles.id),
  permissionId: varchar('permission_id').notNull().references(() => permissions.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
}))

export const roleRelation = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions)
}))

export const permissionRelation = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions)
}))

export const rolePermissionRelation = relations(rolePermissions, ({ one, many }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}))