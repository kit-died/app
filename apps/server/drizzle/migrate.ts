import { sql } from 'drizzle-orm'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { client, consoleDb } from './client'
import { DbSchema } from './db'
import { synchronizer } from './permission-sync/synchronizer'
import { seeder } from './seed/seeder'

type Args = {
  [K in typeof options[number]['name']]: boolean
}

const options = [
  { name: 'help', description: 'Show this help message' },
  { name: 'reset', description: 'Reset the database' },
  { name: 'refresh', description: 'Refresh the database' },
  { name: 'permission-sync', description: 'Run the permission synchronizer' },
  { name: 'seed', description: 'Run the database seeder' },
] as const

async function main() {
  const { help, reset, refresh, 'permission-sync': permissionSync, seed, isProd } = getArgs()

  if (help) return showHelp()

  try {
    console.log('Connecting to database...')
    await client.connect()

    if (!isProd && (reset || refresh)) {
      await resetSchema(consoleDb)
      if (reset) return
    }

    console.log('Running migrations...')

    await migrate(consoleDb, { migrationsFolder: './drizzle/migrations' })
    console.log('Migrations complete.')

    if (permissionSync) {
      console.log('Synchronizing permissions...')
      await synchronizer(consoleDb)
      console.log('Permissions synchronized.')
    }

    if (!isProd && seed) await seeder(consoleDb)
  } catch (error) {
    console.error('Error running migrations:', error)
  } finally {
    await client.end()
  }
}

async function resetSchema(db: NodePgDatabase<DbSchema>) {
  console.log('Cleaning database...')
  await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE; CREATE SCHEMA drizzle;`)
  await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;`)
  console.log('Database cleaned.')
}

function showHelp() {
  const padLength = options.reduce((max, { name }) => Math.max(max, name.length), 0) + 2

  console.log('----- Drizzle migration tool -----\n')
  console.log('Usage: migrate [options]')
  console.log('Options:')
  options.forEach(
    ({ name, description }) =>
      console.log(`  --${name.padEnd(padLength)}${description}`)
  )
  process.exit(0)
}

function getArgs(): Args & { isProd: boolean } {
  const [, , ...args] = process.argv
  return args.reduce((acc, arg) => {
    const [name, value] = arg.split('=')
    const option = options.find(o => o.name === name.replace('--', '')) // && (acc[name] = value ?? true)
    if (!option) {
      console.error(`Unknown option: ${name}`)
      process.exit(1)
    }
    // acc[option.name] = value ?? true
    acc[option.name] = true
    return acc
  }, {
    isProd: process.env.NODE_ENV === 'production',
    help: false,
    reset: false,
    refresh: false,
    'permission-sync': false,
    seed: false,
  } as Args & { isProd: boolean })
}

main()