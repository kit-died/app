import { client, consoleDb } from '../client'
import { seeder } from './seeder'

async function main() {

  try {
    console.log('Connecting to database...')
    await client.connect()
    await seeder(consoleDb)

  } catch (error) {
    console.error('Error seeding:', error)
  } finally {
    await client.end()
  }
}

main()