import { DefaultContext } from 'koa'
import { AuthenticationError } from './exceptions'
import { verifyJwt } from './utils'
import { verifyOauth } from './services'

export type AuthenticatedUser = {
  id: number
  // entityId: number
  username: string
  oauth: string
}

export type ServerContext = {
  token: string | null
  user: AuthenticatedUser | null
}

export async function context({
  ctx,
}: {
  ctx: DefaultContext
}): Promise<ServerContext> {
  if (ctx.request.body.query.match('query IntrospectionQuery')) return <ServerContext>{ token: null, user: null }

  if (!ctx.request.header.authorization) throw new AuthenticationError('NO_TOKEN_PROVIDED')

  const token = ctx.request.header.authorization.split(' ')[1]

  if (ctx.request.body.query.match('authenticate')) {
    await verifyOauth(token).catch(() => {
      throw new AuthenticationError('INVALID_OAUTH_TOKEN')
    })

    return <ServerContext>{ token, user: null }
  }

  try {
    const jwt = verifyJwt(token)
    const user: AuthenticatedUser = {
      id: jwt.id,
      // // entityId: jwt.entityId,
      username: jwt.username,
      oauth: jwt.oauth,
    }

    return <ServerContext>{ token, user }
  } catch (error) {
    throw new AuthenticationError('Invalid token')
  }
}
