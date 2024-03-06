// import { Order } from '@backend/types/order.ts'
import { Order } from '../../../backend/src/types/order'

export interface GET {
  '/orders': {
    params: never
    result: Order[]
  }
  '/orders/:id': {
    params: never
    result: Order
  }
  '/activate/:activationToken': {
    params: never
    result: { accessToken: string; user: any }
  }
  '/refresh': {
    params: never
    result: { accessToken: string; user: any }
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
