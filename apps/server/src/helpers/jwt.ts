import jwt from 'jsonwebtoken'

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
  secret: string = process.env.JWT_SECRET || 'secret'
) {
  return jwt.sign(payload, secret)
}

export function verifyJwt(
  token: string,
  secret: string = process.env.JWT_SECRET || 'secret'
): IJwtPayload {
  const verified = jwt.verify(token, secret) as IJwtPayload

  if (new Date(verified.expiresAt).getTime() <= Date.now()) {
    throw new Error('Token expired')
  }

  return verified
}
