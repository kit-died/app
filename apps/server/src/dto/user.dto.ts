import { Field, InputType, Int, ObjectType, registerEnumType } from 'type-graphql'
import { UserStatus } from '../../drizzle/types'
import { IntFilter, StringFilter } from './filter.dto'

registerEnumType(UserStatus, { name: 'UserStatus' })

@ObjectType()
export class UserDto {
  @Field(() => Int)
  id!: number

  @Field(() => String)
  username!: string

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  phone?: string

  @Field(() => String, { nullable: true })
  avatar?: string

  @Field(() => UserStatus)
  status!: UserStatus

}

@InputType()
export class UserWhere {
  @Field(() => IntFilter, { nullable: true })
  id!: number

  @Field(() => StringFilter, { nullable: true })
  username!: string

  @Field(() => StringFilter, { nullable: true })
  name!: string

  @Field(() => StringFilter, { nullable: true })
  email!: string

  @Field(() => StringFilter, { nullable: true })
  phone!: string

  @Field(() => StringFilter, { nullable: true })
  status!: UserStatus

  @Field(() => [UserWhere], { nullable: true })
  and!: UserWhere[]

  @Field(() => [UserWhere], { nullable: true })
  or!: UserWhere[]
}

@InputType()
export class CreateUserDto {
  @Field(() => String)
  username!: string

  @Field(() => String)
  name!: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  phone?: string

  @Field(() => String, { nullable: true })
  avatar?: string

  @Field(() => UserStatus)
  status!: UserStatus
}

@InputType()
export class UpdateUserDto {
  @Field(() => String, { nullable: true })
  username?: string

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  email?: string

  @Field(() => String, { nullable: true })
  phone?: string

  @Field(() => String, { nullable: true })
  avatar?: string

  @Field(() => UserStatus, { nullable: true })
  status?: UserStatus
}