/* eslint-env node */
// See https://www.apollographql.com/docs/devtools/apollo-config/
module.exports = {
  client: {
    service: {
      name: 'betelgeuse',
      localSchemaFile: './apps/server/schema.graphql',
      url: 'http://betelgeuse/graphql'
    },
    // Files processed by the extension
    includes: [
      'apps/client/src/**/*.vue',
      'apps/client/src/**/*.ts',
      'apps/server/src/**/*.ts',
    ],
  },
}
