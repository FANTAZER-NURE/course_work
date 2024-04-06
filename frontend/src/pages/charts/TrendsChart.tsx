import { PureComponent, useCallback, useMemo, useState } from 'react'
import { TOrder } from '../../../../backend/src/types/order'
import {
  Area,
  AreaChart,
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
import { Button, Classes, H2, SegmentedControl } from '@blueprintjs/core'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2'
import classNames from 'classnames'
import { DISPLAY_DATE_FORMAT, momentFormatter } from 'utils/formatDate'
import { IconNames } from '@blueprintjs/icons'
import styles from './TrendsChart.module.scss'
import { formatTick } from 'utils/formatTick'

interface TrendsChartProps {
  orders: TOrder[]
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ orders }) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null])

  const filteredOrders = useMemo(() => {
    return orders.filter((row) => {
      // Ensure createdAt is a valid Date object
      const createdAt = new Date(row.createdAt)

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
    })
  }, [dateRange, orders])

  const data = useMemo(() => {
    const monthlyData: {
      [key: string]: { name: string; Виручка: number; Обʼєм: number; date?: Date }
    } = {}

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt)
      const month = date.toLocaleString('ua', { month: 'short', year: 'numeric' })
      const totalPrice = order.productDetails.reduce(
        (acc, productDetail) => acc + productDetail.quantity * productDetail.pricePerUnit,
        0
      )
      const totalVolume = order.productDetails.reduce(
        (acc, productDetail) => acc + productDetail.quantity,
        0
      )

      if (monthlyData[month]) {
        monthlyData[month].Виручка += totalPrice
        monthlyData[month].Обʼєм += totalVolume
      } else {
        monthlyData[month] = {
          name: month,
          Виручка: totalPrice,
          Обʼєм: totalVolume,
          date: new Date(order.createdAt),
        }
      }
    })

    const sortedData = Object.values(monthlyData)
    sortedData.sort((a, b) => a.date!.getTime() - b.date!.getTime())

    // Remove the date property from the final objects
    sortedData.forEach((item) => delete item.date)

    return sortedData
  }, [filteredOrders])

  console.log(data)
  console.log(filteredOrders)

  return (
    <div>
      <FlexContainer style={{ width: '100%' }} centered>
        <H2>Тренд</H2>
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
              yAxisId="left"
              label={{
                value: 'Обʼєм (тон)',
                angle: -90,
                position: 'insideLeft',
                style: { fontWeight: 'bold' },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: 'Виручка (грн)',
                angle: 90,
                position: 'insideRight',
                dx: 10,
                style: { fontWeight: 'bold' },
              }}
              tickFormatter={formatTick}
            />
            <Legend />
            <Tooltip
              formatter={(value, name, props) => {
                if (props.dataKey === 'Обʼєм') {
                  return `${value} тон`
                }

                return `${value} грн`
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="Обʼєм"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="Виручка"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </FlexContainer>
    </div>
  )
}
