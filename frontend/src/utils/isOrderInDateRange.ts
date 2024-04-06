import { TOrder } from '../../../backend/src/types/order'

export function isOrderInDateRange(order: TOrder, dateRange: [Date | null, Date | null]): boolean {
  // Ensure createdAt is a valid Date object
  const createdAt = new Date(order.createdAt)

  if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
    return false // Exclude invalid dates
  }

  const [startDate, endDate] = dateRange
  // Check if dateRange is empty (both null)
  if (!startDate && !endDate) {
    return true // No date filter applied
  }

  // Ensure dates are valid
  if (!startDate || !endDate) return false

  // Compare date objects directly
  return createdAt >= startDate && createdAt <= endDate
}
