import { sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DbSchema } from '../db'
import { permissions, rolePermissions, roles, userRoles } from '../schema'
import { allPermissionsData } from './all-permissions'
import { rolePermissionsData } from './role-permissions'

type DbRoles = typeof roles.$inferSelect[]

type ConstructedData = {
  roles: typeof roles.$inferInsert[],
  permissions: typeof permissions.$inferInsert[],
  rolePermissions: typeof rolePermissions.$inferInsert[],
}

function dataConstructor(dbRoles: DbRoles) {
  const superuserName = 'Administrator'

  const constructedData: ConstructedData = {
    roles: [],
    permissions: [],
    rolePermissions: [],
  }

  if(!dbRoles.length) {
    constructedData.roles.push({ id: 1, name: superuserName, isSystemRole: true })

    let count = 2
    rolePermissionsData.forEach(rp => {
      constructedData.roles.push({ id: count, name: rp.role, isSystemRole: rp.isSystemRole })
      count++
    })
  } else {
    let count = 2

    rolePermissionsData.forEach(rp => {
      const roleExists = dbRoles.find((role) => role.name === rp.role)

      if(!roleExists) {
        let idExists = true

        while(idExists) {
          idExists = dbRoles.some((role) => role.id === count)
          if(idExists) { count++ }
        }

        constructedData.roles.push({ id: count, name: rp.role, isSystemRole: rp.isSystemRole })
        count++
      }
    })
  }

  constructedData.permissions = allPermissionsData.map((value) => ({ id: value }))

  constructedData.rolePermissions = allPermissionsData.map((value) => ({ roleId: 1, permissionId: value }))

  rolePermissionsData.forEach(rp => {
    const { role: roleName, permissions: permsData } = rp
    let roleId = (constructedData.roles.find(({ name }) => name === roleName))?.id

    if(!roleId) { roleId = (dbRoles.find(({ name }) => name === roleName))?.id }

    if(roleId) {
      constructedData.rolePermissions = constructedData.rolePermissions.concat(permsData.map((value) => ({ roleId, permissionId: value })))
    }
  })

  return constructedData
}

export async function synchronizer(db: NodePgDatabase<DbSchema>) {
  await db.delete(rolePermissions)
  await db.delete(permissions)
  await db.execute(sql`delete from ${roles} where ${roles.id} not in ( select distinct ${userRoles.roleId} from ${userRoles}) and ${roles.id} != 1`)

  const dbRoles = await db.select().from(roles)
  const result = dataConstructor(dbRoles)

  await db.insert(roles).values(result.roles)
  await db.insert(permissions).values(result.permissions)
  await db.insert(rolePermissions).values(result.rolePermissions)
}