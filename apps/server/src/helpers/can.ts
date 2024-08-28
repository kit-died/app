import { AuthChecker } from 'type-graphql'
import { Context } from 'koa'
import { sql } from 'drizzle-orm'
import { db } from '../../drizzle/db'
import { userRoles, roles, rolePermissions } from '../../drizzle/schema'

export const can: AuthChecker<Context> = async (
  { context: { user } },
  permission,
) => {
  if (!user) throw new Error('Unauthenticated')

  const result = await db.execute(sql`
    select ${rolePermissions.permissionId} 
    from ${userRoles} 
    join ${roles} on ${userRoles.roleId} = ${roles.id} 
    join ${rolePermissions} on ${roles.id} = ${rolePermissions.roleId} 
    where ${userRoles.userId} = ${user.id} and ${rolePermissions.permissionId} in ${permission}`
  )

  return result.rows.length ? true : false;
};