import { useQuery } from 'react-query'
import styles from './Orders.module.scss'
import { H2 } from '@blueprintjs/core'
import { Table, isAccessorColumn } from 'shared/table/Table'
import { useCallback, useMemo } from 'react'
import { OrderRowType, useColumnDefs } from './use-column-defs'
import { TOrder } from '../../../../backend/src/types/order'
import { makeOrderRow } from './utils/makeOrderRow'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { useNavigate } from 'react-router'
import { getApi } from 'api/httpClient'

const MOCK_ORDERS = [
  {
    id: '1',
    customerId: '123',
    managerId: '456',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '123 Main St, Springfield, IL 62704',
    productDetails: {
      '1': {
        id: '1',
        name: 'Apple',
        quantity: 2,
        units: 't',
        pricePerUnit: 1.99,
      },
      '2': {
        id: '2',
        name: 'Banana',
        quantity: 3,
        units: 'l',
        pricePerUnit: 0.99,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  // Add more orders here...
] as unknown as TOrder[]

export const Orders = () => {
  const { data: orders, isFetching } = useQuery(['orders'], async () => {
    return await getApi(`/orders` as '/orders')
  })

  console.log('orders')

  const { columns } = useColumnDefs()
  const navigate = useNavigate()

  const accessorColumns = useMemo(() => {
    return columns.filter(isAccessorColumn)
  }, [columns])

  const rows = useMemo(() => {
    if (!orders) {
      return []
    }

    const data: OrderRowType[] = []
    const rows = MOCK_ORDERS?.map((order) => makeOrderRow(order))

    data.push(...rows)

    return data
  }, [orders])

  const redirectToNewPage = useCallback(
    (value: string) => {
      navigate(`/orders/${value}`)
    },
    [navigate]
  )

  console.log(orders)

  if (orders) {
    console.log(orders[0].productDetails)
  }

  // if (!orders) {
  //   return null
  // }

  return (
    <FlexContainer column centered className={styles.wrapper}>
      <FlexContainer centered>
        <H2>Orders</H2>
      </FlexContainer>
      <FlexContainer centeredX className={styles.tableWrapper}>
        <Table
          data={rows}
          columns={accessorColumns}
          theme="light"
          isLoading={isFetching}
          redirectToNewPage={redirectToNewPage}
        />
      </FlexContainer>
    </FlexContainer>
  )
}
