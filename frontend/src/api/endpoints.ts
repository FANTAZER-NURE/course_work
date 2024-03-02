// import { Order } from '@backend/types/order.ts'
import { Order } from '../../../backend/src/types/order'

export interface GET {
  '/orders': {
    params: never
    result: Order[]
  }
}

export interface POST {
  '/api/users/login': {
    params: {
      login: string
      password: string
    }
    result: { token: string }
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
