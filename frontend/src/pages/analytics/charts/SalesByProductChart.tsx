import { useContext, useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
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
import { isOrderInDateRange } from 'utils/isOrderInDateRange'
import { TUser } from '../../../../../backend/src/types/user'
import { TOrder } from '../../../../../backend/src/types/order'
import { AuthContext } from 'shared/components/auth/AuthContext'

interface SalesByProductProps {
  managers: TUser[]
  orders: TOrder[]
}

export const SalesByProductChart: React.FC<SalesByProductProps> = ({ managers, orders }) => {
  const [dateRange, setDateRange] = useState<DateRange>([null, null])
  const [selectedManagers, setSelectedManagers] = useState<TUser[]>([])
  const { user } = useContext(AuthContext)


  const filteredOrders = useMemo(() => {
    return orders.filter((row) => isOrderInDateRange(row, dateRange))
  }, [dateRange, orders])

  const data = useMemo(() => {
    const productMap: Record<number, Record<string, number>> = {} // Map for product volume by manager

    // Pre-define product names and IDs for clarity (modify based on your data)
    const productNames: Record<string, string> = {
      '1': 'A95',
      '2': 'A92',
      '3': 'Дизель',
    }

    // Iterate through managers
    managers
      .filter(
        (row) =>
          !selectedManagers.length || selectedManagers.some((manager) => manager.id === row.id)
      )
      .forEach((manager) => {
        productMap[manager.id] = {} // Initialize empty object for manager

        // Loop through filtered orders for this manager
        filteredOrders.forEach((order) => {
          if (order.managerId === manager.id) {
            // Iterate through product details in the order
            order.productDetails.forEach((productDetail) => {
              const productId = productDetail.product.id // Extract product ID
              const productName = productNames[productId] // Get product name

              // Access or create product volume for this manager
              productMap[manager.id][productName] =
                (productMap[manager.id][productName] || 0) + productDetail.quantity
            })
          }
        })
      })

    // Convert productMap to desired data structure
    return managers
      .filter(
        (row) =>
          !selectedManagers.length || selectedManagers.some((manager) => manager.id === row.id)
      )
      .map((manager) => {
        const productData = productMap[manager.id] || {} // Get product data for manager

        return {
          name: manager.name,
          ...productData, // Spread product volume properties
        }
      })
  }, [filteredOrders, managers, selectedManagers])

  useEffect(() => {
    if (user && user.role === 'manager') {
      setSelectedManagers([user])
    }
  }, [user])

  return (
    <div>
      <FlexContainer style={{ width: '100%' }} centered>
        <H2>Продажі за типом палива</H2>
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
            <YAxis
              className={styles.yAxis}
              label={{
                value: 'Обʼєм (тон)',
                angle: -90,
                dy: 50,
                position: 'insideLeft',
                style: { fontWeight: 'bold' },
              }}
            />
            <Legend />
            <Tooltip
              formatter={(value, name, props) => {
                return `${value} тон`
              }}
            />
            <Bar
              dataKey="A95"
              label={{ fill: '#738091', fontSize: 20 }}
              activeBar={<Rectangle fill="#4C90F0" stroke="blue" />}
              fill="#8ABBFF"
            >
              <LabelList
                dataKey="name"
                content={(props) => {
                  const { x, y, width } = props as {
                    x: number
                    y: number
                    width: number
                    height: number
                    value: string
                  }
                  const radius = 10

                  return (
                    <text
                      x={x + width / 2}
                      y={y - radius}
                      fill="#000"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      A95
                    </text>
                  )
                }}
              />
            </Bar>
            <Bar
              dataKey="A92"
              label={{ fill: '#738091', fontSize: 20 }}
              activeBar={<Rectangle fill="#32A467" stroke="blue" />}
              fill="#72CA9B"
            >
              <LabelList
                dataKey="name"
                content={(props) => {
                  const { x, y, width } = props as {
                    x: number
                    y: number
                    width: number
                    height: number
                    value: string
                  }
                  const radius = 10

                  return (
                    <text
                      x={x + width / 2}
                      y={y - radius}
                      fill="#000"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      A92
                    </text>
                  )
                }}
              />
            </Bar>
            <Bar
              dataKey="Дизель"
              label={{ fill: '#738091', fontSize: 20 }}
              activeBar={<Rectangle fill="#EC9A3C" stroke="blue" />}
              fill="#FBB360"
            >
              <LabelList
                dataKey="name"
                content={(props) => {
                  const { x, y, width } = props as {
                    x: number
                    y: number
                    width: number
                    height: number
                    value: string
                  }
                  const radius = 10

                  return (
                    <text
                      x={x + width / 2}
                      y={y - radius}
                      fill="#000"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Дизель
                    </text>
                  )
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </FlexContainer>
    </div>
  )
}
