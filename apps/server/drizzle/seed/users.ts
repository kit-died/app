import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { users } from '../schema'
import { DbSchema } from '../db'
import { pluck } from '../helpers'

const userData = [
  {
    username: 'admin',
    name: 'Admin',
    email: 'admin@example.com',
    phone: '6666666',
    entityId: 1
  },
  {
    username: 'alifulhu',
    name: 'Ali Fulhu',
    email: 'ali.fulhu@example.com',
    phone: '7777777',
    entityId: 2
  },
  {
    username: 'ahmed.didi',
    name: 'Ahmed Didi',
    email: null,
    phone: null,
    entityId: 3
  },
  {
    username: 'hassan.thakuru',
    name: 'Hassan Thakuru',
    email: null,
    phone: null,
    entityId: 2
  },
  {
    username: 'mohamed.shakir',
    name: 'Mohamed Shakir',
    email: null,
    phone: null,
    entityId: 1
  },
  {
    username: 'fathimath.rizla',
    name: 'Fathimath Rizla',
    email: 'fathimath.r@example.com',
    phone: '9998887',
    entityId: 3
  },
  {
    username: 'ibrahim.nazim',
    name: 'Ibrahim Nazim',
    email: 'i.nazim@example.com',
    phone: '1112223',
    entityId: 1
  },
  {
    username: 'aisha.mohamed',
    name: 'Aisha Mohamed',
    email: null,
    phone: '3334445',
    entityId: 2
  },
  {
    username: 'hussain.ali',
    name: 'Hussain Ali',
    email: 'h.ali@example.com',
    phone: null,
    entityId: 3
  },
  {
    username: 'mariyam.waheeda',
    name: 'Mariyam Waheeda',
    email: 'm.waheeda@example.com',
    phone: '5556667',
    entityId: 1
  },
  {
    username: 'abdul.majeed',
    name: 'Abdul Majeed',
    email: null,
    phone: null,
    entityId: 2
  },
  {
    username: 'zuhura.ahmed',
    name: 'Zuhura Ahmed',
    email: 'z.ahmed@example.com',
    phone: '8889990',
    entityId: 3
  },
  {
    username: 'yoosuf.naseem',
    name: 'Yoosuf Naseem',
    email: 'y.naseem@example.com',
    phone: null,
    entityId: 1
  },
  {
    username: 'aminath.shifa',
    name: 'Aminath Shifa',
    email: null,
    phone: '2223334',
    entityId: 2
  },
  {
    username: 'ismail.rasheed',
    name: 'Ismail Rasheed',
    email: 'i.rasheed@example.com',
    phone: '4445556',
    entityId: 3
  },
  {
    username: 'hawwa.manike',
    name: 'Hawwa Manike',
    email: null,
    phone: null,
    entityId: 1
  },
  {
    username: 'moosa.manik',
    name: 'Moosa Manik',
    email: 'm.manik@example.com',
    phone: '7778889',
    entityId: 2
  },
  {
    username: 'zahiya.ibrahim',
    name: 'Zahiya Ibrahim',
    email: 'z.ibrahim@example.com',
    phone: null,
    entityId: 3
  },
  {
    username: 'adam.haleem',
    name: 'Adam Haleem',
    email: null,
    phone: '1234567',
    entityId: 1
  },
  {
    username: 'khadeeja.ahmed',
    name: 'Khadeeja Ahmed',
    email: 'k.ahmed@example.com',
    phone: '9876543',
    entityId: 2
  },
  {
    username: 'saeed.hassan',
    name: 'Saeed Hassan',
    email: 's.hassan@example.com',
    phone: '5551234',
    entityId: 1
  },
  {
    username: 'nafeesa.ali',
    name: 'Nafeesa Ali',
    email: null,
    phone: '6662345',
    entityId: 2
  },
  {
    username: 'ibrahim.waheed',
    name: 'Ibrahim Waheed',
    email: 'i.waheed@example.com',
    phone: null,
    entityId: 3
  },
  {
    username: 'fathmath.shazla',
    name: 'Fathmath Shazla',
    email: 'f.shazla@example.com',
    phone: '7773456',
    entityId: 1
  },
  {
    username: 'ahmed.shareef',
    name: 'Ahmed Shareef',
    email: null,
    phone: null,
    entityId: 2
  },
  {
    username: 'aishath.riza',
    name: 'Aishath Riza',
    email: 'a.riza@example.com',
    phone: '8884567',
    entityId: 3
  },
  {
    username: 'hussain.niyaz',
    name: 'Hussain Niyaz',
    email: 'h.niyaz@example.com',
    phone: '9995678',
    entityId: 1
  },
  {
    username: 'mariyam.shifza',
    name: 'Mariyam Shifza',
    email: null,
    phone: '1116789',
    entityId: 2
  },
  {
    username: 'mohamed.nasir',
    name: 'Mohamed Nasir',
    email: 'm.nasir@example.com',
    phone: null,
    entityId: 3
  },
  {
    username: 'fathimath.shiuna',
    name: 'Fathimath Shiuna',
    email: 'f.shiuna@example.com',
    phone: '2227890',
    entityId: 1
  },
  {
    username: 'ali.shameem',
    name: 'Ali Shameem',
    email: null,
    phone: null,
    entityId: 2
  },
  {
    username: 'aminath.leena',
    name: 'Aminath Leena',
    email: 'a.leena@example.com',
    phone: '3338901',
    entityId: 3
  },
  {
    username: 'yoosuf.jameel',
    name: 'Yoosuf Jameel',
    email: 'y.jameel@example.com',
    phone: '4449012',
    entityId: 1
  }
]

export async function seedUsers(db: NodePgDatabase<DbSchema>) {
  return pluck(await db.insert(users).values(userData).returning({ id: users.id }), 'id')
}