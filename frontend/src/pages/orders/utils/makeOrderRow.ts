import { TOrder } from '../../../../../backend/src/types/order'
import { OrderRowType } from '../use-column-defs'

export function makeOrderRow(order: TOrder): OrderRowType {
  let orderPrice = 0

  console.log(order)

  Object.keys(order.productDetails).forEach((key) => {
    orderPrice += order.productDetails[key].quantity * order.productDetails[key].pricePerUnit
  })

  const row = { ...order, orderPrice }

  return row
}
