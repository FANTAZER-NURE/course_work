import { useMemo, useState } from 'react'
import { TOrder } from '../../../../../backend/src/types/order'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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
import styles from './AverageOrderPriceChart.module.scss'
import { isOrderInDateRange } from 'utils/isOrderInDateRange'
import { TUser } from '../../../../../backend/src/types/user'
import { getColorForManager } from './SalesRevenueChart'
import { ManagerFilter } from 'shared/ui/ManagerFilter'
import { formatTick } from 'utils/formatTick'

interface AverageOrderVolumeChartProps {
  orders: TOrder[]
  managers: TUser[]
}

type MonthlyData = { date: Date; total: number; count: number } & {
  name: string
  [managerId: string]: number | string
}

export const AverageOrderVolumeChart: React.FC<AverageOrderVolumeChartProps> = ({
  orders,
  managers,
}) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null])
  const [selectedManagers, setSelectedManagers] = useState<TUser[]>([])

  const filteredOrders = useMemo(() => {
    return orders.filter((row) => isOrderInDateRange(row, dateRange))
  }, [dateRange, orders])

  const filteredManagers = useMemo(() => {
    return managers.filter(
      (row) => !selectedManagers.length || selectedManagers.some((manager) => manager.id === row.id)
    )
  }, [managers, selectedManagers])

  const data = useMemo(() => {
    const monthlyData: Record<string, MonthlyData> = {}

    filteredOrders.forEach((order) => {
      const createdAt = new Date(order.createdAt)
      const month = createdAt.toLocaleString('default', { month: 'short', year: 'numeric' })
      const managerId = order.managerId.toString()

      // Calculate the total volume of the order
      let orderVolume = 0
      order.productDetails.forEach((item) => {
        orderVolume += item.quantity
      })

      if (monthlyData[month]) {
        monthlyData[month][managerId] =
          ((monthlyData[month][managerId] as number) || 0) + orderVolume
        monthlyData[month].total = (monthlyData[month].total || 0) + orderVolume
        monthlyData[month].count = (monthlyData[month].count || 0) + 1
      } else {
        monthlyData[month] = {
          date: createdAt,
          name: month,
          total: orderVolume,
          count: 1,
          [managerId]: orderVolume,
        } as MonthlyData
      }
    })

    const sortedData = Object.values(monthlyData)
    sortedData.sort((a, b) => a.date.getTime() - b.date.getTime())

    // Calculate the average volume and remove the date, total, and count properties
    return sortedData.map(({ date, total, count, ...rest }) => {
      Object.keys(rest).forEach((key) => {
        if (key !== 'name') {
          rest[key] = (rest[key] as number) / count
        }
      })
      return rest
    }) as MonthlyData[]
  }, [filteredOrders])

  return (
    <div>
      <FlexContainer style={{ width: '100%' }} centered>
        <H2>Середній обʼєм замовлення</H2>
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
      </FlexContainer>
      <VerticalSpacing />

      <FlexContainer style={{ width: '100%' }} centered column>
        <ResponsiveContainer
          width={1000}
          height={800}
          className={classNames(Classes.ELEVATION_4, styles.chartContainer)}
        >
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              label={{
                value: 'Середній обʼєм замовлення (тон)',
                angle: -90,
                position: 'insideLeft',
                dy: 70,
                style: { fontWeight: 'bold' },
              }}
              tickFormatter={formatTick}
            />

            <Legend
              formatter={(value, name, props) => {
                console.log(value, name, props)
                const manager = managers.find((manager) => manager.id === value)
                return manager?.name
              }}
            />
            <Tooltip
              formatter={(value, name, props) => {
                const manager = managers.find((manager) => manager.id === name)
                return [`${Number(value).toFixed(3)} тон`, manager?.name]
              }}
            />
            {filteredManagers.map((manager, i) => (
              <Line
                type="monotone"
                dataKey={manager.id}
                stroke={getColorForManager(i)}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </FlexContainer>
    </div>
  )
}
