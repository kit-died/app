import type { CodegenConfig } from '@graphql-codegen/cli'
import { config as envConfig } from 'dotenv'
const { NODE_ENV } = envConfig({ path: './.env.local' }).parsed || {}

const config: CodegenConfig = {
  schema: '../server/schema.graphql',
  documents: ['src/**/*.graphql'],
  ignoreNoDocuments: true,
  watch: NODE_ENV !== 'production',
  noSilentErrors: true,
  generates: {
    './src/gql/': {
      preset: 'client',
      config: {
        useTypeImports: true,
      }
    }
  }
}

export default config
