import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret' as const

export interface IJwtPayload {
  id: number
  // entityId: number
  username: string
  oauth: string
  expiresAt: string
  iat?: number
}

export function signJwt(
  payload: IJwtPayload,
  secret = SECRET
) {
  return jwt.sign(payload, secret)
}

export function verifyJwt(
  token: string,
  secret = SECRET
): IJwtPayload {
  const verified = jwt.verify(token, secret) as IJwtPayload

  if (new Date(verified.expiresAt).getTime() <= Date.now()) {
    throw new Error('Token expired')
  }

  return verified
}
