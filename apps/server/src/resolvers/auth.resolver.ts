import axios from 'axios'
import { Ctx, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { AuthenticatedResponse } from '../dto/auth.dto'
import { UserRepository } from '../repositories/user.repository'
import { signJwt } from '../helpers/jwt'

const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION_TIME || '7200') * 1000 * 60
const OAUTH_PROFILE_URL = process.env.OAUTH_PROFILE_URL || ''

@Service()
@Resolver()
export class AuthResolver {
  constructor(private repo: UserRepository) { }

  @Query(() => AuthenticatedResponse, { name: 'authenticate' })
  async authenticate(@Ctx('token') oauthToken: string) {
    const result = await axios
      .get(OAUTH_PROFILE_URL, {
        headers: { Authorization: `Bearer ${oauthToken}` },
      })
      .catch((error) => {
        console.error(error.response?.data)
        throw new Error('ERROR_FETCHING_SIRIUS_USER')
      })

    if (!result.data || !result.data.id) { throw new Error('user-not-found-on-sirius') }
    const user = await this.repo.findOne({ where: { username: { eq: result.data.username } } })
    if (!user) { throw new Error('USER_NOT_FOUND') }

    const expiresIn = JWT_EXPIRATION
    const expiresAt = new Date(Date.now() + expiresIn).toISOString()

    const token = signJwt({
      id: user.id,
      entityId: user.entityId,
      username: user.username,
      oauth: oauthToken,
      expiresAt,
    })

    return { token, expiresAt, user }
  }
}