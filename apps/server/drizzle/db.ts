import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { drizzleConfig } from './config'
import * as schema from './schema'
import { PgColumn, PgTable } from 'drizzle-orm/pg-core'
import { InferSelectModel } from 'drizzle-orm'

export type DbSchema = typeof schema
export type SchemaTables = {
  [K in keyof DbSchema as DbSchema[K] extends PgTable ? K : never]: DbSchema[K]
}
export type Entity = keyof SchemaTables
export type ColumnKeys<N extends Entity> = keyof SchemaTables[N]
export type OnlyColumns<T> = T extends PgColumn<infer U> ? U : never
export type ColumnName<N extends Entity> = keyof InferSelectModel<SchemaTables[N]>

const pool = new Pool(drizzleConfig)
export const db = drizzle(pool, {
  logger: process.env.QUERY_LOG !== 'false',
  schema
})