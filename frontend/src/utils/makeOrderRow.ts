import { OrderRowType } from 'pages/orders/use-orders-column-defs'
import { TOrder } from '../../../backend/src/types/order'

export function makeOrderRow(order: TOrder): OrderRowType {
  let orderPrice = 0

  order.productDetails.forEach((item) => {
    orderPrice += item.quantity * item.pricePerUnit
  })

  const row = { ...order, orderPrice }

  return row
}
