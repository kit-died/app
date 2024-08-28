import 'dotenv/config'
import { Client } from 'pg'
import { drizzleConfig } from './config'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './schema'

export const client = new Client(drizzleConfig)
export const consoleDb = drizzle(client, {
  logger: process.env.QUERY_LOG !== 'false',
  schema
})