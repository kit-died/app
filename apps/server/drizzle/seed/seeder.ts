import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { DbSchema } from '../db'
import { seedUsers } from './users'

export async function seeder(db: NodePgDatabase<DbSchema>) {
  console.log('Running seeders')

  let userIds = (await seedUsers(db))
  userIds = userIds.slice(0, Math.floor(userIds.length / 2))
  console.log('Seeding complete.')
}