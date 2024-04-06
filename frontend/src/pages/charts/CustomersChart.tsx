import { useMemo, useState } from 'react'
import { TOrder } from '../../../../backend/src/types/order'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { Button, Classes, H2 } from '@blueprintjs/core'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2'
import classNames from 'classnames'
import { DISPLAY_DATE_FORMAT, momentFormatter } from 'utils/formatDate'
import { IconNames } from '@blueprintjs/icons'
import styles from './SalesRevenueChart.module.scss'
import { TCustomer } from '../../../../backend/src/types/customer'

interface CustomersChartProps {
  customers: TCustomer[]
  orders: TOrder[]
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#FF66A1',
  '#D69FD6',
  '#BDADFF',
  '#68C1EE',
  '#7AE1D8',
]

export const CustomersChart: React.FC<CustomersChartProps> = ({ customers, orders }) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null])

  const filteredOrders = useMemo(() => {
    return orders.filter((row) => {
      // Ensure createdAt is a valid Date object

      const createdAt = new Date(row.createdAt)

      if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
        return false // Exclude invalid dates
      }

      const formattedCreatedAt = createdAt.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      const [startDate, endDate] = dateRange
      // Check if dateRange is empty (both null)
      if (!startDate && !endDate) {
        return true // No date filter applied
      }

      const formattedStartDate = startDate?.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      const formattedEndDate = endDate?.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

      // Ensure formatted dates are valid strings
      if (!formattedStartDate || !formattedEndDate) return false

      return formattedCreatedAt >= formattedStartDate && formattedCreatedAt <= formattedEndDate
    })
  }, [dateRange, orders])

  const data = useMemo(() => {
    const customerOrderMap: Record<number, number> = {} // Map to store order count by customer

    // Iterate through filtered orders
    filteredOrders.forEach((order) => {
      const customerId = order.customerId
      customerOrderMap[customerId] = (customerOrderMap[customerId] || 0) + 1
    })

    // Create the final data array
    return customers.map((customer) => ({
      name: customer.name,
      orders: customerOrderMap[customer.id] || 0, // Access order count or use 0 if not found
    }))
  }, [filteredOrders, customers])

  return (
    <div>
      <FlexContainer style={{ width: '100%' }} centered>
        <H2>Замовники</H2>
      </FlexContainer>
      <VerticalSpacing />
      <FlexContainer style={{ width: '100%' }} centered gap={10}>
        <div>
          <DateRangeInput3
            className={classNames(Classes.POPOVER_DISMISS_OVERRIDE)}
            onChange={(pickerValue: DateRange) => {
              setDateRange(pickerValue)
            }}
            formatDate={momentFormatter(DISPLAY_DATE_FORMAT).formatDate}
            parseDate={(str) => new Date(str)}
            closeOnSelection={false}
            highlightCurrentDay
            shortcuts
            popoverProps={{ position: 'bottom' }}
            value={dateRange}
            footerElement={<Button onClick={() => setDateRange([null, null])}>Reset</Button>}
            allowSingleDayRange
            startInputProps={{
              leftIcon: IconNames.CALENDAR,
            }}
            endInputProps={{
              leftIcon: IconNames.CALENDAR,
            }}
          />
          <i style={{ fontSize: 12 }}>*Якщо не задана дата - відображені дані за всю історію</i>
        </div>
      </FlexContainer>

      <VerticalSpacing />

      <FlexContainer style={{ width: '100%' }} centered>
        <ResponsiveContainer
          // minHeight={1000}
          width={1000}
          height={600}
          className={classNames(Classes.ELEVATION_4, styles.chartContainer)}
        >
          <PieChart width={800} height={800}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label
              outerRadius={250}
              fill="#8884d8"
              dataKey="orders"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                return `${value} замовлень`
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </FlexContainer>
    </div>
  )
}
