/* eslint-disable  @typescript-eslint/no-explicit-any */

import { createHttpLink, from } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { InMemoryCache } from '@apollo/client/cache'
import { LocalStorage } from 'quasar'
import { IToken, logout } from 'src/services/auth.service'

export /* async */ function getClientOptions(
  /* {app, router, ...} */
) {
  const httpLink = createHttpLink({
    uri: process.env.GRAPHQL_URI || '/graphql',
  })
  const errorLink = onError(({ graphQLErrors }) => {
    graphQLErrors?.forEach(({ extensions }) => {
      if (extensions?.code === 'UNAUTHENTICATED') logout()
    })
  })
  const authLink = setContext((_, { headers }) => {
    const jwtToken = LocalStorage.getItem<IToken>('jwt-token')
    if (!jwtToken) throw new Error('jwtToken not found!')

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${jwtToken.token}`
      },
    }
  })

  return Object.assign(
    // General options.
    {
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache(),
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},

    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true,
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100,
        }
      : {}
  )
}
