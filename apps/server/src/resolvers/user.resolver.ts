import { GraphQLError } from 'graphql'
import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'
import { CreateUserDto, UpdateUserDto, UserDto, UserWhere } from '../dto/user.dto'
import { RELATED_RECORDS_EXIST } from '../exceptions/messages'
import { UserRepository } from '../repositories/user.repository'
import { OrderBy } from '../repositories/utils'

@Service()
@Resolver(() => UserDto)
export class UserResolver {
  constructor(private repo: UserRepository) { }

  @Query(() => [UserDto])
  async users(
    @Arg('where', () => UserWhere, { nullable: true }) where?: UserWhere,
    @Arg('take', () => Int, { nullable: true }) take?: number,
    @Arg('skip', () => Int, { nullable: true }) skip?: number,
    @Arg('sort', () => [[String]], { nullable: true }) sort?: OrderBy<'users'>,
  ) {
    return await this.repo.findMany({ where, take, skip, sort })
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => Int) id: number) {
    try {
      const res = await this.repo.delete(id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.code === '23503') throw new GraphQLError(RELATED_RECORDS_EXIST)
    }
    return true
  }

  @Mutation(() => UserDto)
  async createUser(@Arg('data', () => CreateUserDto) data: CreateUserDto) {
    return await this.repo.create(data)
  }

  @Mutation(() => UserDto)
  async updateUser(@Arg('id', () => Int) id: number, @Arg('data', () => UpdateUserDto) data: UpdateUserDto) {
    return await this.repo.update(id, data)
  }

}