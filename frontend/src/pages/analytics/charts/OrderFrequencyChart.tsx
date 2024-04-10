import { useContext, useEffect, useMemo, useState } from 'react'
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
import styles from './OrderFrequencyChart.module.scss'
import { isOrderInDateRange } from 'utils/isOrderInDateRange'
import { TUser } from '../../../../../backend/src/types/user'
import { getColorForManager } from './SalesRevenueChart'
import { ManagerFilter } from 'shared/ui/ManagerFilter'
import { AuthContext } from 'shared/components/auth/AuthContext'

interface OrderFrequencyChartProps {
  orders: TOrder[]
  managers: TUser[]
}

type MonthlyData = { date: Date } & { name: string; [managerId: string]: number | string }

export const OrderFrequencyChart: React.FC<OrderFrequencyChartProps> = ({ orders, managers }) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null])
  const [selectedManagers, setSelectedManagers] = useState<TUser[]>([])

  const { user } = useContext(AuthContext)

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

    filteredOrders.forEach((order, i) => {
      const createdAt = new Date(order.createdAt)
      const month = createdAt.toLocaleString('default', { month: 'short', year: 'numeric' })
      const managerId = order.managerId.toString()

      if (monthlyData[month]) {
        monthlyData[month][managerId] = ((monthlyData[month][managerId] as number) || 0) + 1
      } else {
        monthlyData[month] = { date: createdAt, name: month, [managerId]: 1 } as MonthlyData
      }
    })

    const sortedData = Object.values(monthlyData)
    sortedData.sort((a, b) => a.date.getTime() - b.date.getTime())

    // Remove the date property from the data objects and cast to MonthlyData[]
    return sortedData.map(({ date, ...rest }) => rest) as MonthlyData[]
  }, [filteredOrders])

  useEffect(() => {
    if (user && user.role === 'manager') {
      setSelectedManagers([user])
    }
  }, [user])

  return (
    <div>
      <FlexContainer style={{ width: '100%' }} centered>
        <H2>Частота замовлень</H2>
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
        {user?.role !== 'manager' ? (
          <ManagerFilter
            managers={managers}
            selectedManagers={selectedManagers}
            setSelectedManagers={setSelectedManagers}
            className={styles.multiSelect}
          />
        ) : null}
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
                value: 'К-сть замовлень',
                angle: -90,
                position: 'insideLeft',
                dy: 50,
                style: { fontWeight: 'bold' },
              }}
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
                return [`${value} замовлень`, manager?.name]
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
