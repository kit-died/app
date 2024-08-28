import { Service } from 'typedi'
import { Repository } from './repository'
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto'

const primaryKeys: 'id' = 'id' as const

@Service()
export class UserRepository extends Repository<'users', typeof primaryKeys> {
  constructor() {
    super('users', primaryKeys)
  }
}
