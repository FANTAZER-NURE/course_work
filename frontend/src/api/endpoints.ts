// import { Order } from '@backend/types/order.ts'
import { TOrder } from '../../../backend/src/types/order'
import { TUser } from '../../../backend/src/types/user'

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
    result: { accessToken: string; user: any }
  }
  '/users': {
    params: never
    result: TUser[]
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
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PUT {
  '/api/contactgroups/:id': {
    // params: Models.ContactGroup
    // result: Models.ContactGroup
    params: any
    result: any
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DELETE {
  '/api/contactgroups/:id': {
    params: never
    result: never
  }
}
