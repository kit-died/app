/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
    VITE_PORT: string
    VITE_APP_URL: string
    API_PORT: string
    GRAPHQL_URI: string
    OAUTH_CLIENT_ID: string
    OAUTH_CLIENT_SECRET: string
    OAUTH_INTROSPECTION_URL: string
    OAUTH_PROFILE_URL: string
    OAUTH_SERVER: string
    OAUTH_LOGOUT_URL: string
    OAUTH_ACCESS_TOKEN_URL: string
    OAUTH_AUTHORIZE_URL: string
    OAUTH_REDIRECT_URI: string
  }
}
