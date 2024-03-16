import { useQuery, useQueryClient } from 'react-query'
import styles from './Orders.module.scss'
import {
  Button,
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
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select'
import { usePageError } from 'hooks/use-page-error'

type Props = {}

export const Orders: React.FC<Props> = () => {
  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<TCustomer | null>(null)
  const [shippingAddress, setShippingAddress] = useState('')
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])

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

    const rows = orders.map((order) => makeOrderRow(order))

    return rows
  }, [orders])

  const isCreateOrderDisabled = useMemo(() => {
    if (!orderItems.length) {
      return true
    }

    if (!shippingAddress || !selectedCustomer) {
      return true
    }

    for (const order of orderItems) {
      if (
        !('quantity' in order) ||
        !('pricePerUnit' in order) ||
        !('product' in order) ||
        !('unit' in order)
      ) {
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
          Create order
        </Button>
      )}
      <VerticalSpacing />
      <FlexContainer centeredX className={styles.tableWrapper}>
        <Table
          data={rows}
          columns={accessorColumns}
          theme="light"
          isLoading={isFetchingOrders}
          redirectToNewPage={redirectToNewPage}
          redirectColumns={['id']}
        />
      </FlexContainer>

      <Dialog
        title="Create order"
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
          <FormGroup helperText="You must fill all the fields" labelFor="text-input">
            <Label>
              Customer
              <Select<TCustomer>
                items={customers || []}
                itemRenderer={renderCustomer}
                noResults={
                  <MenuItem disabled={true} text="No results." roleStructure="listoption" />
                }
                onItemSelect={setSelectedCustomer}
                itemPredicate={filterCustomer}
              >
                <Button
                  alignText="left"
                  fill
                  icon="user"
                  rightIcon="caret-down"
                  text={maybeRenderSelectedCustomer(selectedCustomer) ?? '(No selection)'}
                />
              </Select>
            </Label>
            <VerticalSpacing />
            <Label>
              Shipping address
              <InputGroup
                id="address"
                placeholder="Shipping address"
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
              Add item
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
              Cancel
            </Button>
            {isCreateOrderDisabled ? (
              <Tooltip content="All fields must be filled">
                <Button
                  intent={Intent.SUCCESS}
                  disabled={isCreateOrderDisabled}
                  loading={isOrderPosting}
                >
                  Create
                </Button>
              </Tooltip>
            ) : (
              <Button
                intent={Intent.SUCCESS}
                disabled={isCreateOrderDisabled}
                onClick={handleCreateOrderRequest}
                loading={isOrderPosting}
              >
                Create
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

export type OrderItem = {
  quantity: string
  pricePerUnit: string
  product: TProduct | null
  unit: 'L' | 'T'
}

type OrderItemProps = {
  products: TProduct[]
  orderItems: OrderItem[]
  setOrderItems: React.Dispatch<React.SetStateAction<OrderItem[]>>
  onRemoveOrderItem: (value: number) => void
}

const OrderItemRenderer = ({
  products,
  orderItems,
  setOrderItems,
  onRemoveOrderItem,
}: OrderItemProps) => {
  const updateOrderItem = useCallback(
    (index: number, update: Partial<OrderItem>) => {
      setOrderItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...update } : item)))
    },
    [setOrderItems]
  )

  return (
    <div>
      {orderItems.map((item, idx) => (
        <>
          <FlexContainer between centeredY gap={5}>
            <InputGroup
              id="quantity"
              placeholder="Quantity"
              leftIcon="truck"
              value={item.quantity}
              type="number"
              onChange={(e) => {
                updateOrderItem(idx, { quantity: e.currentTarget.value })
              }}
              style={{ width: '150px' }}
              intent={item.quantity ? Intent.SUCCESS : Intent.DANGER}
            />
            <InputGroup
              id="price"
              leftIcon="dollar"
              placeholder="Price per unit"
              value={item.pricePerUnit}
              type="number"
              onChange={(e) => {
                updateOrderItem(idx, { pricePerUnit: e.currentTarget.value })
              }}
              style={{ width: '150px' }}
              intent={item.pricePerUnit ? Intent.SUCCESS : Intent.DANGER}
            />
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
                text={maybeRenderSelectedProduct(item.product) ?? 'Product'}
                style={{ width: '120px' }}
                intent={item.product ? Intent.SUCCESS : Intent.DANGER}
                minimal
              />
            </Select>
            <Select
              items={['L', 'T']}
              itemRenderer={(unit, { handleClick, handleFocus, modifiers, query }) => {
                if (!modifiers.matchesPredicate) {
                  return null
                }
                return (
                  <MenuItem
                    active={item.unit === unit}
                    disabled={modifiers.disabled}
                    key={unit}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    roleStructure="listoption"
                    text={unit}
                  />
                )
              }}
              onItemSelect={(item) => {
                updateOrderItem(idx, { unit: item as 'T' | 'L' })
              }}
              filterable={false}
            >
              <Button
                alignText="left"
                fill
                icon="box"
                rightIcon="caret-down"
                text={item.unit ?? 'Units'}
                style={{ width: '90px' }}
                intent={item.unit ? Intent.SUCCESS : Intent.DANGER}
                minimal
              />
            </Select>
            <H5 style={{ color: Colors.GRAY3, marginBottom: 0, width: '200px' }}>
              {item.quantity && item.pricePerUnit
                ? `${(+item.quantity * +item.pricePerUnit).toFixed(3)} UAH`
                : '0 UAH'}
              {/* {(+item.quantity * +item.pricePerUnit).toFixed(3)}UAH */}
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
