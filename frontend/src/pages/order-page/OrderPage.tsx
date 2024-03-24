import {
  Breadcrumb,
  BreadcrumbProps,
  Breadcrumbs,
  Button,
  Callout,
  Dialog,
  DialogBody,
  DialogFooter,
  Divider,
  FormGroup,
  H2,
  H3,
  H4,
  Icon,
  InputGroup,
  Intent,
  Label,
  MenuItem,
  Spinner,
  Tag,
  Tooltip,
} from '@blueprintjs/core'
import { deleteApi, getApi, putApi } from 'api/httpClient'
import { useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './OrderPage.module.scss'
import { useCallback, useContext, useMemo, useState } from 'react'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select'
import { TCustomer } from '../../../../backend/src/types/customer'
import { OrderItemRenderer } from 'pages/orders/Orders'
import { ProductDetails } from '../../../../backend/src/types/order'
import isEqual from 'lodash/isEqual'

interface OrderPageProps {}

export const OrderPage: React.FC<OrderPageProps> = () => {
  const { id } = useParams()
  const { user, users } = useContext(AuthContext)
  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const [orderItems, setOrderItems] = useState<ProductDetails[]>([])
  const navigate = useNavigate()

  const [isOrderDeleting, setIsOrderDeleting] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<TCustomer | null>(null)
  const [shippingAddress, setShippingAddress] = useState('')
  const [isOrderUpdating, setIsOrderUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')

  const queryClient = useQueryClient()

  const {
    isLoading,
    data: order,
    error,
  } = useQuery(
    ['order', id],
    async () => {
      return await getApi(`/orders/${id}` as '/orders/:id')
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
      onSuccess: (res) => {
        setShippingAddress(res.shippingAddress)
        setOrderItems(res.productDetails)
        setSelectedStatus(res.status)
        if (customer) {
          setSelectedCustomer(customer)
        }
      },
    }
  )

  const { isLoading: isLoadingUser, data: manager } = useQuery(
    ['manager', id],
    async () => {
      return await getApi(`/users/${order?.managerId}` as '/users/:id')
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
      enabled: !!order,
    }
  )

  const { isLoading: isLoadingCustomer, data: customer } = useQuery(
    ['customer', id, order?.customerId],
    async () => {
      return await getApi(`/customers/${order?.customerId}` as '/customers/:id')
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
      enabled: !!order,
      onSuccess: (res) => {
        setSelectedCustomer(res)
      },
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

  const renderCurrentBreadcrumb = ({ text, ...restProps }: BreadcrumbProps) => {
    return (
      <Breadcrumb {...restProps}>
        {text} {order?.id}
      </Breadcrumb>
    )
  }

  const BREADCRUMBS: BreadcrumbProps[] = useMemo(
    () => [
      { href: '/orders', icon: 'folder-close', text: 'Orders' },
      { href: `/orders/${id}`, icon: 'document', text: 'Order' },
    ],
    [id]
  )

  const fullPrice = useMemo(() => {
    let price = 0

    if (!order) {
      return 0
    }

    const items = order?.productDetails

    items.forEach((item) => {
      price += item.quantity * item.pricePerUnit
    })

    return price
  }, [order])

  const isOrderModified = useMemo(() => {
    if (
      selectedCustomer?.id !== order?.customerId ||
      shippingAddress !== order?.shippingAddress ||
      selectedStatus !== order?.status ||
      selectedStatus !== order?.status ||
      !isEqual(orderItems, order?.productDetails)
    ) {
      return true
    }

    return false
  }, [
    order?.customerId,
    order?.productDetails,
    order?.shippingAddress,
    order?.status,
    orderItems,
    selectedCustomer?.id,
    selectedStatus,
    shippingAddress,
  ])

  const isOrderCorrect = useMemo(() => {
    if (!orderItems.length) {
      return false
    }

    if (!shippingAddress || !selectedCustomer) {
      return false
    }

    for (const order of orderItems) {
      if (
        !('quantity' in order) ||
        !('pricePerUnit' in order) ||
        !('product' in order) ||
        !('unit' in order) ||
        !order.quantity ||
        !order.pricePerUnit ||
        !order.product ||
        !order.unit
      ) {
        return false
      }
    }

    return true
  }, [orderItems, selectedCustomer, shippingAddress])

  const handleDeleteOrder = useCallback(async () => {
    setIsOrderDeleting(true)

    try {
      await deleteApi(`/orders/${id}` as '/orders/:id')
      queryClient.invalidateQueries(['orders', users])
    } catch (error) {
      console.log(error)
    }

    setIsOrderDeleting(false)
    navigate('../orders')
  }, [id, navigate, queryClient, users])

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
          active={customer.id === selectedCustomer?.id}
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
    [selectedCustomer?.id]
  )

  const handleRemoveOrderItem = useCallback((index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleUpdateOrderRequest = useCallback(async () => {
    if (!selectedCustomer || !user) {
      return
    }

    try {
      setIsOrderUpdating(true)

      await putApi(`/orders/${id}` as '/orders/:id', {
        shippingAddress,
        productDetails: orderItems,
        customerId: selectedCustomer.id,
        status: selectedStatus,
      })
      queryClient.invalidateQueries(['order', id])
    } catch (error) {
      console.log(error)
    }

    setIsOrderUpdating(false)
    setIsDialogOpened(false)
    setShippingAddress('')
    setOrderItems([])
  }, [id, orderItems, queryClient, selectedCustomer, selectedStatus, shippingAddress, user])

  const handleResetToDefault = useCallback(() => {
    if (!order) {
      return
    }

    const customer = customers?.find((iter) => iter.id === order.customerId)

    if (!customer) {
      return
    }

    setShippingAddress(order.shippingAddress)
    setOrderItems(order.productDetails)
    setSelectedCustomer(customer)
    setSelectedStatus(order.status)
  }, [customers, order])

  if (
    isLoading ||
    isLoadingUser ||
    isLoadingCustomer ||
    isFetchingCustomers ||
    isFetchingProducts
  ) {
    return <Spinner />
  }

  if (error || !order || !manager) {
    return <div>Error fetching order</div>
  }

  const createdAt = new Date(order!.createdAt)
  const updatedAt = new Date(order!.createdAt)

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs currentBreadcrumbRenderer={renderCurrentBreadcrumb} items={BREADCRUMBS} />
      <H2>Order #{order.id}</H2>
      {user?.role !== 'director' ? (
        <FlexContainer gap={5}>
          <Button intent={Intent.WARNING} icon="edit" onClick={() => setIsDialogOpened(true)}>
            Edit
          </Button>
          <Button
            loading={isOrderDeleting}
            intent={Intent.DANGER}
            icon="cross"
            onClick={() => setIsDeleteDialogOpened(true)}
          >
            Delete
          </Button>
        </FlexContainer>
      ) : null}

      <H3>
        <b>Customer ID:</b> {customer?.name}
      </H3>
      <Link to={`../../users/${manager.id}`}>
        <H3 style={{ color: '#4d5fc0' }}>
          <b>Manager ID:</b> {manager.name}
        </H3>
      </Link>
      <H3>
        <FlexContainer centeredY gap={10}>
          <b>Status:</b>{' '}
          <Tag intent={order.status === 'done' ? Intent.SUCCESS : Intent.WARNING} minimal>
            {order.status}
          </Tag>
        </FlexContainer>
      </H3>
      <H3>
        <b>Created At: </b>
        {createdAt.toLocaleString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </H3>
      <H3>
        <b>Updated At: </b>
        {updatedAt.toLocaleString('en-US', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </H3>
      <H3>
        <b>Shipping Address:</b> {order.shippingAddress}
      </H3>
      <VerticalSpacing />
      <H2>Order Details</H2>

      <table className={styles.orderDetailsTable}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {order.productDetails &&
            order.productDetails.map((productDetail) => (
              <tr key={productDetail.product.id}>
                <td>{productDetail.product.id}</td>
                <td>{productDetail.product.name}</td>
                <td>{`${productDetail.quantity} T`}</td>
                <td>{parseInt(productDetail.pricePerUnit.toString()).toFixed(2)}</td>
                <td>{(+productDetail.quantity * +productDetail.pricePerUnit).toFixed(2)} UAH</td>
              </tr>
            ))}
        </tbody>
      </table>
      <VerticalSpacing />
      <H3>
        <b>Total Order Price:</b> {fullPrice} UAH
      </H3>

      <Dialog
        title="Update order"
        icon="edit"
        isOpen={isDialogOpened}
        canEscapeKeyClose
        canOutsideClickClose
        onClose={() => {
          setIsDialogOpened(false)
        }}
        style={{ width: '900px' }}
      >
        <DialogBody>
          <FormGroup
            helperText={
              isOrderModified
                ? `*Yellow highlight - means this field is modified`
                : 'You must fill all the fields'
            }
            labelFor="text-input"
          >
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
                  intent={selectedCustomer?.id !== order.customerId ? Intent.WARNING : Intent.NONE}
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
                intent={shippingAddress !== order.shippingAddress ? Intent.WARNING : Intent.NONE}
              />
            </Label>

            <Label>
              Status
              <Select
                items={['created', 'loading', 'shipping', 'shipped', 'done']}
                itemRenderer={(status, { handleClick, handleFocus, modifiers, query }) => {
                  if (!modifiers.matchesPredicate) {
                    return null
                  }
                  return (
                    <MenuItem
                      active={selectedStatus === status}
                      disabled={modifiers.disabled}
                      key={status}
                      onClick={handleClick}
                      onFocus={handleFocus}
                      roleStructure="listoption"
                      text={status}
                    />
                  )
                }}
                onItemSelect={(item) => {
                  setSelectedStatus(item)
                }}
                filterable={false}
              >
                <Button
                  alignText="left"
                  fill
                  icon="comment"
                  rightIcon="caret-down"
                  intent={selectedStatus !== order.status ? Intent.WARNING : Intent.NONE}
                >
                  {selectedStatus}
                </Button>
              </Select>
            </Label>

            <VerticalSpacing />
            <Divider />
            <VerticalSpacing />
            <OrderItemRenderer
              products={products || []}
              orderItems={orderItems as any}
              setOrderItems={setOrderItems}
              onRemoveOrderItem={handleRemoveOrderItem}
              order={order}
            />

            <VerticalSpacing />

            <Button
              icon="plus"
              onClick={() => {
                setOrderItems([...orderItems, {
                  quantity: 0,
                  pricePerUnit: 0,
                  unit: 'T',
                  product: products![0]
                } as any])
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
            <Button icon="reset" intent={Intent.PRIMARY} onClick={handleResetToDefault}>
              Reset
            </Button>
            {!isOrderCorrect || !isOrderModified ? (
              <Tooltip content="All fields must be filled">
                <Button
                  intent={Intent.SUCCESS}
                  disabled={!isOrderCorrect || !isOrderModified}
                  loading={isOrderUpdating}
                >
                  Edit
                </Button>
              </Tooltip>
            ) : (
              <Button
                intent={Intent.SUCCESS}
                disabled={!isOrderCorrect || !isOrderModified}
                onClick={handleUpdateOrderRequest}
                loading={isOrderUpdating}
              >
                Edit
              </Button>
            )}
          </FlexContainer>
        </DialogFooter>
      </Dialog>

      <Dialog
        title="Delete order"
        icon="trash"
        isOpen={isDeleteDialogOpened}
        canEscapeKeyClose
        canOutsideClickClose
        onClose={() => {
          setIsDeleteDialogOpened(false)
        }}
      >
        <DialogBody>
          <Callout intent={Intent.DANGER} title="You are about to delete this order" icon="trash">
            Are you sure?
          </Callout>
        </DialogBody>
        <DialogFooter>
          <FlexContainer gap={5}>
            <Button
              onClick={() => {
                setIsDeleteDialogOpened(false)
              }}
            >
              Cancel
            </Button>
            <Button intent={Intent.DANGER} onClick={handleDeleteOrder}>
              Delete
            </Button>
          </FlexContainer>
        </DialogFooter>
      </Dialog>
    </div>
  )
}

function maybeRenderSelectedCustomer(selectedCustomer: TCustomer | null) {
  return selectedCustomer ? `${selectedCustomer.name}` : undefined
}

// function maybeRenderSelectedProduct(selectedProduct: TProduct | null) {
//   return selectedProduct ? `${selectedProduct.name}` : undefined
// }
