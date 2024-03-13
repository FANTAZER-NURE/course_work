import { useQuery } from 'react-query'
import styles from './Orders.module.scss'
import { H2 } from '@blueprintjs/core'
import { Table, isAccessorColumn } from 'shared/table/Table'
import { useCallback, useContext, useMemo } from 'react'
import { OrderRowType, useColumnDefs } from './use-column-defs'
import { TOrder } from '../../../../backend/src/types/order'
import { makeOrderRow } from './utils/makeOrderRow'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { useNavigate } from 'react-router'
import { getApi } from 'api/httpClient'
import { TUser } from '../../../../backend/src/types/user'
import { AuthContext } from 'shared/components/auth/AuthContext'

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
        name: 'A95',
        quantity: 100,
        units: 't',
        pricePerUnit: 1.99,
      },
      '2': {
        id: '1',
        name: 'A92',
        quantity: 150,
        units: 't',
        pricePerUnit: 1.5,
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

type Props = {}

export const Orders: React.FC<Props> = () => {
  const { users } = useContext(AuthContext)

  const { data: orders, isFetching: isFetchingOrders } = useQuery(
    ['orders', users],
    async () => {
      return await getApi(`/orders`)
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
    }
  )

  console.log('orders', orders)
  console.log('users', users)

  const managers = useMemo(() => {
    return users?.filter((user) => user.role === 'manager')
  }, [users])

  const { columns } = useColumnDefs(managers || [])

  const navigate = useNavigate()

  const accessorColumns = useMemo(() => {
    return columns.filter(isAccessorColumn)
  }, [columns])

  const rows = useMemo(() => {
    if (!orders) {
      return []
    }

    const rows = orders.map((order) => makeOrderRow(order))

    return rows
  }, [orders])

  const redirectToNewPage = useCallback(
    (value: string) => {
      navigate(`/orders/${value}`)
    },
    [navigate]
  )

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
          isLoading={isFetchingOrders}
          redirectToNewPage={redirectToNewPage}
        />
      </FlexContainer>
    </FlexContainer>
  )
}
