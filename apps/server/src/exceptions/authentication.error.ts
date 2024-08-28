import { GraphQLError, GraphQLErrorOptions } from 'graphql'

export class AuthenticationError extends GraphQLError {
  constructor(message: string, options?: GraphQLErrorOptions) {
    super(message, {
      ...options,
      extensions: {
        code: 'UNAUTHENTICATED',
        ...options?.extensions,
      },
    })
  }
}
