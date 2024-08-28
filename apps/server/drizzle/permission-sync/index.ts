import { client, consoleDb } from '../client'
import { synchronizer } from './synchronizer'

async function main() {

  try {
    console.log('Connecting to database...')
    await client.connect()
    await synchronizer(consoleDb)

  } catch (error) {
    console.error('Error synchronizing permissions:', error)
  } finally {
    await client.end()
  }
}

main()