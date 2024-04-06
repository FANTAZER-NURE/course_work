import { useQuery, useQueryClient } from 'react-query'
import styles from './Orders.module.scss'
import {
  Button,
  Classes,
  Colors,
  Dialog,
  DialogBody,
  DialogFooter,
  Divider,
  FormGroup,
  H2,
  H5,
  InputGroup,
  Intent,
  Label,
  Spinner,
  Tooltip,
} from '@blueprintjs/core'
import { Table, isAccessorColumn } from 'shared/table/Table'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useOrdersColumnDefs } from './use-orders-column-defs'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { useNavigate } from 'react-router'
import { getApi, postApi } from 'api/httpClient'
import { TProduct } from '../../../../backend/src/types/product'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { makeOrderRow } from 'utils/makeOrderRow'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { MenuItem } from '@blueprintjs/core'
import { TCustomer } from '../../../../backend/src/types/customer'
import { ItemPredicate, ItemRenderer, MultiSelect, Select } from '@blueprintjs/select'
import { usePageError } from 'hooks/use-page-error'
import { ProductDetails, TOrder } from '../../../../backend/src/types/order'
import { TUser } from '../../../../backend/src/types/user'
import { DISPLAY_DATE_FORMAT, momentFormatter } from 'utils/formatDate'
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2'
import classNames from 'classnames'
import { IconNames } from '@blueprintjs/icons'

type Props = {}

export const Orders: React.FC<Props> = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<TCustomer | null>(null)
  const [selectedManagers, setSelectedManagers] = useState<TUser[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<TOrder['status'][]>([])
  const [shippingAddress, setShippingAddress] = useState('')
  const [orderItems, setOrderItems] = useState<ProductDetails[]>([])
  const [dateRange, setDateRange] = useState<DateRange>([null, null])
  const [selectedFuel, setSelectedFuel] = useState<{ name: string; id: number }[]>([])

  // createOrders(20)

  const queryClient = useQueryClient()

  const [error, setError] = usePageError('')

  useEffect(() => {
    if (selectedCustomer && selectedCustomer.shippindAdress) {
      setShippingAddress(selectedCustomer.shippindAdress)
    }
  }, [selectedCustomer])

  const { users, user } = useContext(AuthContext)

  const { data: orders, isFetching: isFetchingOrders } = useQuery(
    ['orders', users],
    async () => {
      return await getApi(`/orders`)
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
    }
  )

  const { data: customers, isFetching: isFetchingCustomers } = useQuery(
    ['customers', users],
    async () => {
      return await getApi(`/customers`)
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
    }
  )

  const { data: products, isFetching: isFetchingProducts } = useQuery(
    ['products', users],
    async () => {
      return await getApi(`/products`)
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
    }
  )

  const managers = useMemo(() => {
    return users?.filter((user) => user.role === 'manager')
  }, [users])

  const { columns } = useOrdersColumnDefs(managers || [], customers || [])

  const navigate = useNavigate()

  const accessorColumns = useMemo(() => {
    return columns.filter(isAccessorColumn)
  }, [columns])

  const rows = useMemo(() => {
    if (!orders) {
      return []
    }

    const filteredRows = orders
      .map((order) => makeOrderRow(order))
      .filter(
        (row) =>
          !selectedManagers.length ||
          selectedManagers.some((manager) => manager.id === row.managerId)
      )
      .filter((row) => !selectedStatuses.length || selectedStatuses.includes(row.status))
      // .filter((row) => {
      //   console.log('here')

      //   if (!selectedFuel.length) {
      //     return true
      //   }

      //   console.log('here')

      //   const productIds = row.productDetails.map((iter) => iter.id)

      //   return selectedFuel.some((fuel) => productIds.includes(fuel.id.toString()))
      // })
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

    return filteredRows
  }, [dateRange, orders, selectedManagers, selectedStatuses])

  const isCreateOrderDisabled = useMemo(() => {
    if (!orderItems.length) {
      return true
    }

    if (!shippingAddress || !selectedCustomer) {
      return true
    }

    for (const order of orderItems) {
      if (!('quantity' in order) || !('pricePerUnit' in order) || !('product' in order)) {
        return true
      }
    }

    return false
  }, [orderItems, selectedCustomer, shippingAddress])

  const redirectToNewPage = useCallback(
    (value: string) => {
      navigate(`/orders/${value}`)
    },
    [navigate]
  )

  const handleCreateOrder = useCallback(() => {
    setIsDialogOpened(true)
  }, [])

  const handleRemoveOrderItem = useCallback((index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const [isOrderPosting, setIsOrderPosting] = useState(false)

  const handleCreateOrderRequest = useCallback(async () => {
    if (!selectedCustomer || !user) {
      return
    }

    try {
      setIsOrderPosting(true)
      await postApi('/orders', {
        customerId: selectedCustomer?.id,
        shippingAddress: shippingAddress,
        items: orderItems,
        managerId: user.id,
      })
      queryClient.invalidateQueries(['orders', users])
    } catch (error) {
      console.log(error)
      setError(`cannot create order. \n ${error}`)
    }

    setIsOrderPosting(false)
    setIsDialogOpened(false)
    setShippingAddress('')
    setOrderItems([])
    setSelectedCustomer(null)
  }, [orderItems, queryClient, selectedCustomer, setError, shippingAddress, user, users])

  const filterCustomer: ItemPredicate<TCustomer> = (query, customer, _index, exactMatch) => {
    const normalizedTitle = customer.name.toLowerCase()
    const normalizedQuery = query.toLowerCase()

    if (exactMatch) {
      return normalizedTitle === normalizedQuery
    } else {
      return `${normalizedTitle} ${customer.shippindAdress}`.indexOf(normalizedQuery) >= 0
    }
  }

  const filterManager: ItemPredicate<TUser> = (query, customer, _index, exactMatch) => {
    const normalizedTitle = customer.name.toLowerCase()
    const normalizedQuery = query.toLowerCase()

    if (exactMatch) {
      return normalizedTitle === normalizedQuery
    } else {
      return `${normalizedTitle} ${customer.email}`.indexOf(normalizedQuery) >= 0
    }
  }

  const renderCustomer: ItemRenderer<TCustomer> = useCallback(
    (customer, { handleClick, handleFocus, modifiers, query }) => {
      if (!modifiers.matchesPredicate) {
        return null
      }
      return (
        <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          key={customer.id}
          label={customer.shippindAdress}
          onClick={handleClick}
          onFocus={handleFocus}
          roleStructure="listoption"
          text={`${customer.name}`}
        />
      )
    },
    []
  )

  const renderManager: ItemRenderer<TUser> = useCallback(
    (customer, { handleClick, handleFocus, modifiers, query }) => {
      if (!modifiers.matchesPredicate) {
        return null
      }
      return (
        <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          key={customer.id}
          label={customer.email}
          onClick={handleClick}
          onFocus={handleFocus}
          roleStructure="listoption"
          text={`${customer.name}`}
        />
      )
    },
    []
  )

  const renderManagerTag = (manager: TUser) => manager.name

  if (isFetchingCustomers || isFetchingOrders || isFetchingProducts) {
    return <Spinner />
  }

  return (
    <FlexContainer column centered className={styles.wrapper}>
      <FlexContainer centered>
        <H2>Orders</H2>
      </FlexContainer>
      {user?.role === 'director' ? null : (
        <Button intent={Intent.PRIMARY} icon="plus" onClick={handleCreateOrder}>
          Створити замовлення
        </Button>
      )}
      <VerticalSpacing />
      <FlexContainer gap={10} wrap>
        <MultiSelect<TUser>
          items={managers || []}
          itemRenderer={renderManager}
          noResults={
            <MenuItem disabled={true} text="Немає результатів." roleStructure="listoption" />
          }
          onItemSelect={(manager) => {
            if (selectedManagers.map((iter) => iter.id).includes(manager.id)) {
              setSelectedManagers((prev) => {
                return prev.filter((iter) => iter.id !== manager.id)
              })
              return
            }
            setSelectedManagers((prev) => {
              return [...prev, manager]
            })
          }}
          itemPredicate={filterManager}
          tagRenderer={renderManagerTag}
          onRemove={(manager) => {
            setSelectedManagers((prev) => {
              return prev.filter((iter) => iter.id !== manager.id)
            })
          }}
          selectedItems={selectedManagers}
          itemsEqual={(itemA, itemB) => {
            return itemA.id === itemB.id ? true : false
          }}
          onClear={() => setSelectedManagers([])}
          placeholder="Менеджер..."
          className={styles.multiSelect}
        />

        <MultiSelect<TOrder['status']>
          items={['created', 'loading', 'shipping', 'shipped', 'done']}
          itemRenderer={(status, { handleClick, handleFocus, modifiers, query }) => {
            if (!modifiers.matchesPredicate) {
              return null
            }
            return (
              <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={status}
                onClick={handleClick}
                onFocus={handleFocus}
                roleStructure="listoption"
                text={status}
              />
            )
          }}
          noResults={
            <MenuItem disabled={true} text="Немає результатів." roleStructure="listoption" />
          }
          onItemSelect={(status) => {
            if (selectedStatuses.includes(status)) {
              setSelectedStatuses((prev) => {
                return prev.filter((iter) => iter !== status)
              })
              return
            }

            setSelectedStatuses((prev) => {
              return [...prev, status]
            })
          }}
          tagRenderer={(value) => value}
          onRemove={(status) => {
            setSelectedStatuses((prev) => {
              return prev.filter((iter) => iter !== status)
            })
          }}
          selectedItems={selectedStatuses}
          onClear={() => setSelectedStatuses([])}
          placeholder="Статус..."
          className={styles.multiSelect}
        />
        <MultiSelect<{ name: string; id: number }>
          items={[
            { name: 'A95', id: 1 },
            { name: 'A92', id: 2 },
            { name: 'Дизель', id: 3 },
          ]}
          itemRenderer={(fuel, { handleClick, handleFocus, modifiers, query }) => {
            if (!modifiers.matchesPredicate) {
              return null
            }
            return (
              <MenuItem
                active={modifiers.active}
                disabled={modifiers.disabled}
                key={fuel.id}
                onClick={handleClick}
                onFocus={handleFocus}
                roleStructure="listoption"
                text={fuel.name}
              />
            )
          }}
          noResults={
            <MenuItem disabled={true} text="Немає результатів." roleStructure="listoption" />
          }
          onItemSelect={(fuel) => {
            if (selectedFuel.includes(fuel)) {
              setSelectedFuel((prev) => {
                return prev.filter((iter) => iter.id !== fuel.id)
              })
              return
            }

            setSelectedFuel((prev) => {
              return [...prev, fuel]
            })
          }}
          tagRenderer={(value) => value.name}
          onRemove={(fuel) => {
            setSelectedFuel((prev) => {
              return prev.filter((iter) => iter.id !== fuel.id)
            })
          }}
          selectedItems={selectedFuel}
          onClear={() => setSelectedStatuses([])}
          placeholder="Паливо..."
          className={styles.multiSelect}
        />

        <FlexContainer gap={5}>
          <DateRangeInput3
            className={classNames(Classes.POPOVER_DISMISS_OVERRIDE, styles.dateInput)}
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
        </FlexContainer>
      </FlexContainer>
      <VerticalSpacing />
      <FlexContainer centeredX className={styles.tableWrapper}>
        <Table
          data={rows}
          columns={accessorColumns}
          theme="light"
          isLoading={isFetchingOrders}
          redirectToNewPage={redirectToNewPage}
          redirectColumns={['id']}
          totalRow
        />
      </FlexContainer>

      <Dialog
        title="Створити замовлення"
        icon="plus"
        isOpen={isDialogOpened}
        canEscapeKeyClose
        canOutsideClickClose
        onClose={() => {
          setIsDialogOpened(false)
        }}
        style={{ width: '900px' }}
      >
        <DialogBody>
          <FormGroup helperText="Ви маєте ззаповнити всі поля" labelFor="text-input">
            <Label>
              Замовник
              <Select<TCustomer>
                items={customers || []}
                itemRenderer={renderCustomer}
                noResults={
                  <MenuItem disabled={true} text="Немає результатів." roleStructure="listoption" />
                }
                onItemSelect={setSelectedCustomer}
                itemPredicate={filterCustomer}
              >
                <Button
                  alignText="left"
                  fill
                  icon="user"
                  rightIcon="caret-down"
                  text={maybeRenderSelectedCustomer(selectedCustomer) ?? 'Не вибрано'}
                />
              </Select>
            </Label>
            <VerticalSpacing />
            <Label>
              Адреса доставки
              <InputGroup
                id="address"
                placeholder="Адреса доставки"
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.currentTarget.value)
                }}
              />
            </Label>

            <VerticalSpacing />
            <Divider />
            <VerticalSpacing />
            <OrderItemRenderer
              products={products || []}
              orderItems={orderItems as any}
              setOrderItems={setOrderItems}
              onRemoveOrderItem={handleRemoveOrderItem}
            />

            <VerticalSpacing />

            <Button
              icon="plus"
              onClick={() => {
                setOrderItems([...orderItems, {} as any])
              }}
            >
              Додати товар
            </Button>
          </FormGroup>
        </DialogBody>
        <DialogFooter>
          <FlexContainer gap={5}>
            <Button
              onClick={() => {
                setIsDialogOpened(false)
              }}
            >
              Відмінити
            </Button>
            {isCreateOrderDisabled ? (
              <Tooltip content="All fields must be filled">
                <Button
                  intent={Intent.SUCCESS}
                  disabled={isCreateOrderDisabled}
                  loading={isOrderPosting}
                >
                  Створити
                </Button>
              </Tooltip>
            ) : (
              <Button
                intent={Intent.SUCCESS}
                disabled={isCreateOrderDisabled}
                onClick={handleCreateOrderRequest}
                loading={isOrderPosting}
              >
                Створити
              </Button>
            )}
          </FlexContainer>
          {error && error}
        </DialogFooter>
      </Dialog>
      {error && error}
    </FlexContainer>
  )
}

type OrderItemProps = {
  products: TProduct[]
  orderItems: ProductDetails[]
  setOrderItems: React.Dispatch<React.SetStateAction<ProductDetails[]>>
  onRemoveOrderItem: (value: number) => void
  order?: TOrder
}

export const OrderItemRenderer = ({
  products,
  orderItems,
  setOrderItems,
  onRemoveOrderItem,
  order,
}: OrderItemProps) => {
  const updateOrderItem = useCallback(
    (index: number, update: Partial<ProductDetails>) => {
      setOrderItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...update } : item)))
    },
    [setOrderItems]
  )

  return (
    <div>
      {orderItems.map((item, idx) => (
        <>
          <FlexContainer between centeredY gap={5}>
            <Label>
              Обʼєм
              <InputGroup
                id="quantity"
                placeholder="Обʼєм"
                leftIcon="truck"
                value={item.quantity ? item.quantity.toString() : '0'}
                type="number"
                onChange={(e) => {
                  updateOrderItem(idx, { quantity: Number(e.currentTarget.value) })
                }}
                style={{ width: '150px' }}
                intent={
                  order
                    ? item.quantity &&
                      order.productDetails[idx] &&
                      order.productDetails[idx].quantity !== orderItems[idx].quantity
                      ? Intent.WARNING
                      : Intent.NONE
                    : item.quantity
                    ? Intent.SUCCESS
                    : Intent.DANGER
                }
              />
            </Label>
            <Label>
              Ціна за тону
              <InputGroup
                id="price"
                leftIcon="dollar"
                placeholder="Ціна за тону"
                value={item.pricePerUnit ? item.pricePerUnit.toString() : '0'}
                type="number"
                onChange={(e) => {
                  updateOrderItem(idx, { pricePerUnit: Number(e.currentTarget.value) })
                }}
                style={{ width: '150px' }}
                intent={
                  order
                    ? item.pricePerUnit &&
                      order.productDetails[idx] &&
                      order.productDetails[idx].pricePerUnit !== orderItems[idx].pricePerUnit
                      ? Intent.WARNING
                      : Intent.NONE
                    : item.quantity
                    ? Intent.SUCCESS
                    : Intent.DANGER
                }
              />
            </Label>
            <Label>
              Товар
              <Select<TProduct>
                items={products || []}
                itemRenderer={(product, { handleClick, handleFocus, modifiers, query }) => {
                  if (!modifiers.matchesPredicate) {
                    return null
                  }
                  return (
                    <MenuItem
                      active={modifiers.active}
                      disabled={modifiers.disabled}
                      key={product.id}
                      onClick={handleClick}
                      onFocus={handleFocus}
                      roleStructure="listoption"
                      text={`${product.name}`}
                    />
                  )
                }}
                onItemSelect={(item) => {
                  updateOrderItem(idx, { product: item })
                }}
                filterable={false}
              >
                <Button
                  alignText="left"
                  fill
                  icon="fuel"
                  rightIcon="caret-down"
                  text={maybeRenderSelectedProduct(item.product ?? undefined) ?? 'Product'}
                  style={{ width: '120px' }}
                  intent={
                    order
                      ? item.product &&
                        order.productDetails[idx] &&
                        order.productDetails[idx].product.id !== orderItems[idx].product.id
                        ? Intent.WARNING
                        : Intent.NONE
                      : item.quantity
                      ? Intent.SUCCESS
                      : Intent.DANGER
                  }
                  minimal
                />
              </Select>
            </Label>
            <H5 style={{ color: Colors.GRAY3, marginBottom: 0, width: '200px' }}>
              {item.quantity && item.pricePerUnit
                ? `${(+item.quantity * +item.pricePerUnit).toFixed(3)} грн`
                : '0 UAH'}
            </H5>
            <Button
              minimal
              icon="cross"
              intent={Intent.DANGER}
              onClick={() => onRemoveOrderItem(idx)}
              style={{ width: '20px' }}
            />
          </FlexContainer>
          <VerticalSpacing size="xsmall" />
        </>
      ))}
    </div>
  )
}

function maybeRenderSelectedCustomer(selectedCustomer: TCustomer | null) {
  return selectedCustomer ? `${selectedCustomer.name}` : undefined
}

function maybeRenderSelectedProduct(selectedProduct: TProduct | null) {
  return selectedProduct ? `${selectedProduct.name}` : undefined
}
