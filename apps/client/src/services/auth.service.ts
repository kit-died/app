import { print } from 'graphql'
import { LocalStorage } from 'quasar'
import { AuthenticateBearerTokenDocument } from 'src/gql/graphql'
import { User } from 'src/models/user'
import { ref } from 'vue'

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET
const OAUTH_AUTHORIZE_URL = process.env.OAUTH_AUTHORIZE_URL
const OAUTH_ACCESS_TOKEN_URL = process.env.OAUTH_ACCESS_TOKEN_URL
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI
const GRAPHQL_URI = process.env.GRAPHQL_URI
const OAUTH_LOGOUT_URL = process.env.OAUTH_LOGOUT_URL
const VITE_APP_URL = process.env.VITE_APP_URL || 'http://localhost:8080'

export function useAuth() {
  const user = ref(LocalStorage.getItem<User>('user'))

  return {
    user,
  }
}

export type IOauthToken = {
  access_token: string
  expires_in: number
  refresh_token: string
  token_type: string
  user_id: number
}

export type IToken = {
  token: string
  expiresAt: string
}

export function oauthRedirect() {
  const queryParams = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: OAUTH_REDIRECT_URI,
    response_type: 'code',
    state: generateState()
  })

  window.location.href = `${OAUTH_AUTHORIZE_URL}?${queryParams}`
}

export async function fetchOauthAccessToken(code: string, state: string): Promise<IOauthToken> {
  const response = await fetch(OAUTH_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${code}`
    },
    body: JSON.stringify({
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: OAUTH_REDIRECT_URI,
      state,
      grant_type: 'authorization_code',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed: getOauthAccessToken')
  }

  return await response.json()
}

export async function exchangeAccessTokenForJWT(accessToken: string) {
  const response = await fetch(GRAPHQL_URI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(AuthenticateBearerTokenDocument),
    }),
  })

  if (!response.ok) {
    throw new Error('Failed: GetJwtToken')
  }

  const data = await response.json()
  return data.data.authenticate
}

export function logout() {
  localStorage.clear()

  const queryParams = new URLSearchParams({ redirect_uri: VITE_APP_URL })
  window.location.href = `${OAUTH_LOGOUT_URL}?${queryParams}`
}

export const generateState = (): string => {
  const array: string[] = []
  crypto
    .getRandomValues(new Uint32Array(4))
    .forEach((v) => array.push(v.toString(16)))
  return array.join('-')
}
