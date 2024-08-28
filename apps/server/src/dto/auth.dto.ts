import { Field, ObjectType } from 'type-graphql'
import { UserDto } from './user.dto'

@ObjectType()
export class AuthenticatedResponse {
  @Field(() => String)
  expiresAt!: string

  @Field(() => String)
  token!: string

  @Field(() => UserDto)
  user!: UserDto
}
