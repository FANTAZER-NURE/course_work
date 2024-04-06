import { useMemo, useState } from 'react'
import { TOrder } from '../../../../backend/src/types/order'
import { TUser } from '../../../../backend/src/types/user'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { Button, Classes, H2 } from '@blueprintjs/core'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2'
import classNames from 'classnames'
import { DISPLAY_DATE_FORMAT, momentFormatter } from 'utils/formatDate'
import { IconNames } from '@blueprintjs/icons'
import styles from './SalesRevenueChart.module.scss'
import { ManagerFilter } from 'shared/ui/ManagerFilter'
import { getColorForManager } from './SalesRevenueChart'
import { StatusFilter } from 'shared/ui/StatusFilter'

interface OrdersChartProps {
  managers: TUser[]
  orders: TOrder[]
}

export const OrdersChart: React.FC<OrdersChartProps> = ({ managers, orders }) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null])
  const [selectedManagers, setSelectedManagers] = useState<TUser[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<TOrder['status'][]>([])

  const filteredOrders = useMemo(() => {
    return orders
      .filter((row) => !selectedStatuses.length || selectedStatuses.includes(row.status))
      .filter((row) => {
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
  }, [dateRange, orders, selectedStatuses])

  const data = useMemo(() => {
    const orderMap: Record<number, number> = {} // Map to store order count by manager

    // Filter managers based on selectedManagers
    const filteredManagers = managers.filter(
      (row) => !selectedManagers.length || selectedManagers.some((manager) => manager.id === row.id)
    )

    // Calculate order count for each manager
    filteredOrders.forEach((order) => {
      const managerId = order.managerId
      orderMap[managerId] = (orderMap[managerId] || 0) + 1
    })

    // Create the final data array
    return filteredManagers.map((manager, i) => ({
      name: manager.name,
      замовлення: orderMap[manager.id] || 0, // Access order count or use 0 if not found
      fill: getColorForManager(i),
    }))
  }, [filteredOrders, managers, selectedManagers])

  return (
    <div>
      <FlexContainer style={{ width: '100%' }} centered>
        <H2>Замовлення</H2>
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
        <ManagerFilter
          managers={managers}
          selectedManagers={selectedManagers}
          setSelectedManagers={setSelectedManagers}
          className={styles.multiSelect}
        />

        <StatusFilter
          selectedStatuses={selectedStatuses}
          setSelectedStatuses={setSelectedStatuses}
          className={styles.multiSelect}
        />
      </FlexContainer>

      <VerticalSpacing />

      <FlexContainer style={{ width: '100%' }} centered>
        <ResponsiveContainer
          minHeight={600}
          width={1000}
          className={classNames(Classes.ELEVATION_4, styles.chartContainer)}
        >
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis className={styles.yAxis} />
            <Tooltip
              formatter={(value, name, props) => {
                return `${value} замовлень`
              }}
            />
            <Bar
              dataKey="замовлення"
              label={{ fill: '#738091', fontSize: 20 }}
              activeBar={<Rectangle fill="pink" stroke="blue" />}
              fill="#8ABBFF"
            />
          </BarChart>
        </ResponsiveContainer>
      </FlexContainer>
    </div>
  )
}
