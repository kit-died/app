import { User, UserStatus } from 'src/models/user'

export const usersList: User[] = [
  {
    id: 1,
    name: 'Ahmed Salim',
    username: 'salim',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    status: UserStatus.active,
    // entityId: 1
  },
  {
    id: 2,
    name: 'John Doe',
    username: 'john',
    avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
    status: UserStatus.active,
    // entityId: 1
  },
  {
    id: 3,
    name: 'Jane Doe',
    username: 'jane',
    avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
    status: UserStatus.active,
    // entityId: 1
  },
  {
    id: 4,
    name: 'Mohamed Saameen',
    username: 'saameen',
    avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
    status: UserStatus.active,
    // entityId: 1
  },
  {
    id: 5,
    name: 'Mohamed Salim',
    username: 'mohamed.salim',
    avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
    status: UserStatus.active,
    // entityId: 1
  },
  {
    id: 6,
    name: 'Ali Fulhu',
    username: 'ali',
    status: UserStatus.active,
    // entityId: 1
  },
]
