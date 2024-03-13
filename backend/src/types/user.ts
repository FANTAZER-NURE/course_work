import {User} from '@prisma/client'

export type TUser = User & {
  role: 'director' | 'manager' | 'admin'
}
