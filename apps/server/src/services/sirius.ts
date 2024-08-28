import axios from 'axios'
import { redis } from '../../index'


const OAUTH_INTROSPECTION_URL = process.env.OAUTH_INTROSPECTION_URL || ''
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || ''
const OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET || ''
const OAUTH_ACCESS_TOKEN_URI = process.env.OAUTH_ACCESS_TOKEN_URI || ''

const TOKEN_KEY = 'access_token'

export async function verifyOauth(oauthToken: string) {
  await axios.post(OAUTH_INTROSPECTION_URL, {
    id: OAUTH_CLIENT_ID,
    secret: OAUTH_CLIENT_SECRET,
    token: oauthToken,
    token_type_hint: 'access_token',
  })
}

export async function getAccessToken(): Promise<string> {
  const accessToken = await redis.get('TOKEN_KEY')

  if (accessToken) return accessToken

  return await axios
    .post(OAUTH_ACCESS_TOKEN_URI, {
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    })
    .then(async (response) => {
      await redis.setEx(TOKEN_KEY, 3000, response.data.access_token)
      return response.data.access_token
    })
}
