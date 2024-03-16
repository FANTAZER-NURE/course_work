// import { Order } from '@backend/types/order.ts'
import { ProductDetails, TOrder } from '../../../backend/src/types/order'
import { TUser } from '../../../backend/src/types/user'
import { TCustomer } from '../../../backend/src/types/customer'
import { TProduct } from '../../../backend/src/types/product'

export interface GET {
  '/orders': {
    params: never
    result: TOrder[]
  }
  '/orders/:id': {
    params: never
    result: TOrder
  }
  '/activate/:activationToken': {
    params: never
    result: { accessToken: string; user: any }
  }
  '/refresh': {
    params: never
    result: { token: string; user: any }
  }
  '/users': {
    params: never
    result: TUser[]
  }
  '/users/:id': {
    params: never
    result: TUser
  }
  '/customers': {
    params: never
    result: TCustomer[]
  }
  '/customers/:id': {
    params: never
    result: TCustomer
  }
  '/products': {
    params: never
    result: TProduct[]
  }
}

export interface POST {
  '/register': {
    params: { email: string; password: string; name: string; role: string }
    result: any
  }
  '/login': {
    params: { email: string; password: string }
    result: { accessToken: string; user: any }
  }
  '/logout': {
    params: never
    result: any
  }
  '/orders': {
    params: {
      customerId: string
      shippingAddress: string
      items: ProductDetails[]
      managerId: number
    }
    result: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PUT {
  '/orders/:id': {
    // params: Models.ContactGroup
    // result: Models.ContactGroup
    params: Partial<Omit<TOrder, 'id'>>
    result: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DELETE {
  '/orders/:id': {
    params: never
    result: TOrder
  }
}
