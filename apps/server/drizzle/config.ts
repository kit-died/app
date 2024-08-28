import { defineConfig } from 'drizzle-kit'
import { ClientConfig } from 'pg'

export const drizzleConfig: ClientConfig = {
  connectionString: process.env.DATABASE_URL,
}

export default defineConfig({
  schema: './drizzle/schema',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: drizzleConfig.connectionString!,
  },
})