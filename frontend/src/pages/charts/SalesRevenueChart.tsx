import { useCallback, useMemo, useState } from 'react'
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
import { Button, Classes, H2, SegmentedControl } from '@blueprintjs/core'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2'
import classNames from 'classnames'
import { DISPLAY_DATE_FORMAT, momentFormatter } from 'utils/formatDate'
import { IconNames } from '@blueprintjs/icons'
import styles from './SalesRevenueChart.module.scss'
import { ManagerFilter } from 'shared/ui/ManagerFilter'
import { formatTick } from 'utils/formatTick'
import { isOrderInDateRange } from 'utils/isOrderInDateRange'

interface SalesRevenueChartProps {
  managers: TUser[]
  orders: TOrder[]
}

export const SalesRevenueChart: React.FC<SalesRevenueChartProps> = ({ managers, orders }) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null])
  const [chartMode, setChartMode] = useState<'sales' | 'revenue'>('sales')
  const [selectedManagers, setSelectedManagers] = useState<TUser[]>([])

  const filteredOrders = useMemo(() => {
    return orders.filter((row) => isOrderInDateRange(row, dateRange))
  }, [dateRange, orders])

  const salesData = useMemo(() => {
    return managers
      .filter(
        (row) =>
          !selectedManagers.length || selectedManagers.some((manager) => manager.id === row.id)
      )
      .map((manager, i) => {
        const managerVolume = filteredOrders.reduce((acc, order) => {
          if (order.managerId === manager.id) {
            // Calculate total quantity by summing product quantities
            const orderQuantity = order.productDetails.reduce((orderAcc, product) => {
              return orderAcc + product.quantity
            }, 0)
            return acc + orderQuantity
          }
          return acc
        }, 0) // Initial accumulator for sum

        return {
          name: manager.name,
          Тони: managerVolume, // Use volume instead of tons for clarity
          fill: getColorForManager(i),
        }
      })
  }, [filteredOrders, managers, selectedManagers])

  const revenueData = useMemo(() => {
    return managers
      .filter(
        (row) =>
          !selectedManagers.length || selectedManagers.some((manager) => manager.id === row.id)
      )
      .map((manager, i) => {
        const managerRevenue = filteredOrders.reduce((acc, order) => {
          if (order.managerId === manager.id) {
            // Calculate total revenue by summing product pricePerUnit * quantity
            const orderRevenue = order.productDetails.reduce((orderAcc, product) => {
              return orderAcc + product.pricePerUnit * product.quantity
            }, 0)
            return acc + orderRevenue
          }
          return acc
        }, 0) // Initial accumulator for sum

        return {
          name: manager.name,
          Виручка: managerRevenue, // Total manager revenue
          fill: getColorForManager(i),
        }
      })
  }, [filteredOrders, managers, selectedManagers])

  const handleChartModeChange = useCallback((option: string) => {
    setChartMode((prev) => (prev === 'sales' ? 'revenue' : 'sales'))
  }, [])

  return (
    <div>
      <FlexContainer style={{ width: '100%' }} centered>
        <H2>Продажі та виручка</H2>
      </FlexContainer>

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
      {/* <VerticalSpacing /> */}

      <FlexContainer style={{ width: '100%' }} centered>
        <div style={{ width: 'fit-content' }}>
          <SegmentedControl
            options={[
              {
                label: 'Продажі',
                value: 'sales',
              },
              {
                label: 'Виручка',
                value: 'revenue',
              },
            ]}
            value={chartMode}
            onValueChange={handleChartModeChange}
          />
        </div>
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
            data={chartMode === 'sales' ? salesData : revenueData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              className={styles.yAxis}
              tickFormatter={formatTick}
              label={{
                value: chartMode === 'sales' ? 'Обʼєм (тон)' : 'Виручка (грн)',
                angle: -90,
                dy: 50,
                dx: -10,
                position: 'insideLeft',
                style: { fontWeight: 'bold' },
              }}
            />

            <Tooltip
              formatter={(value, name, props) => {
                if (chartMode === 'sales') {
                  return `${value} тон`
                }

                return `${value} грн`
              }}
            />
            <Bar
              dataKey={chartMode === 'sales' ? 'Тони' : 'Виручка'}
              label={{ fill: '#738091', fontSize: 20 }}
              activeBar={<Rectangle fill="pink" stroke="blue" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </FlexContainer>
    </div>
  )
}

export function getColorForManager(managerId: number) {
  const colors = ['#8ABBFF', '#72CA9B', '#FBB360', '#D69FD6']
  return colors[managerId % colors.length]
}
