import { OrderRowType } from 'pages/orders/use-orders-column-defs'
import { TOrder } from '../../../backend/src/types/order'

export function makeOrderRow(order: TOrder): OrderRowType {
  let orderPrice = 0

  Object.keys(order.productDetails).forEach((key) => {
    orderPrice += order.productDetails[key].quantity * order.productDetails[key].pricePerUnit
  })

  const row = { ...order, orderPrice }

  return row
}
