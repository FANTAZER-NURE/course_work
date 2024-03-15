import {Customer} from '@prisma/client'

export type TCustomer = Customer & {
  id: string
}
