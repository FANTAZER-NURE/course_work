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
import { ProductDetails, TOrder } from '../../../../backend/src/types/order'
import isEqual from 'lodash/isEqual'
import { numberWithSpaces } from 'utils/numberWithSpaces'
import { STATUS_MAP } from 'utils/constants/status-map'

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
  const [selectedStatus, setSelectedStatus] = useState<TOrder['status'] | ''>('')

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
      { href: '/orders', icon: 'folder-close', text: 'Замовлення' },
      { href: `/orders/${id}`, icon: 'document', text: 'Замовлення' },
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
        !order.quantity ||
        !order.pricePerUnit ||
        !order.product
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
        status: selectedStatus as TOrder['status'],
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

  console.log(isOrderCorrect)
  console.log(isOrderModified)

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
      <VerticalSpacing />
      {user?.role !== 'director' ? (
        <FlexContainer gap={5}>
          <Tooltip
            content={
              order.status === 'done'
                ? 'Ви не можете редагувати замовлення післ того як відмитили його виконаним'
                : undefined
            }
          >
            <Button
              intent={Intent.WARNING}
              icon="edit"
              onClick={() => setIsDialogOpened(true)}
              disabled={order.status === 'done'}
            >
              Редагувати
            </Button>
          </Tooltip>
          <Tooltip
            content={
              order.status === 'done'
                ? 'Ви не можете редагувати замовлення післ того як відмитили його виконаним'
                : undefined
            }
          >
            <Button
              loading={isOrderDeleting}
              intent={Intent.DANGER}
              icon="cross"
              onClick={() => setIsDeleteDialogOpened(true)}
              disabled={order.status === 'done'}
            >
              Видалити
            </Button>
          </Tooltip>
        </FlexContainer>
      ) : null}
      <VerticalSpacing />

      <H2>Замовлення №{order.id}</H2>
      <H3>
        <b>Замовник:</b> {customer?.name}
      </H3>
      <Link to={`../../users/${manager.id}`}>
        <H3 style={{ color: '#4d5fc0' }}>
          <b>Менеджер:</b> {manager.name}
        </H3>
      </Link>
      <H3>
        <FlexContainer centeredY gap={10}>
          <b>Статус:</b>{' '}
          <Tag intent={order.status === 'done' ? Intent.SUCCESS : Intent.WARNING} minimal>
            {STATUS_MAP[order.status]}
          </Tag>
        </FlexContainer>
      </H3>
      <H3>
        <b>Створено об: </b>
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
        <b>Востаннє змінено об: </b>
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
        <b>Адреса доставки:</b> {order.shippingAddress}
      </H3>
      <VerticalSpacing />
      <H2>Деталі замовлення</H2>

      <table className={styles.orderDetailsTable}>
        <thead>
          <tr>
            <th>ID продукту</th>
            <th>Продукт</th>
            <th>Обʼєм (тон)</th>
            <th>Ціна за тону</th>
            <th>Вартість за позицію</th>
          </tr>
        </thead>
        <tbody>
          {order.productDetails &&
            order.productDetails.map((productDetail) => (
              <tr key={productDetail.product.id}>
                <td>{productDetail.product.id}</td>
                <td>{productDetail.product.name}</td>
                <td>{`${productDetail.quantity} т`}</td>
                <td>{numberWithSpaces(parseInt(productDetail.pricePerUnit.toFixed(2)))}</td>
                <td>
                  {numberWithSpaces(
                    parseInt((+productDetail.quantity * +productDetail.pricePerUnit).toFixed(2))
                  )}{' '}
                  грн
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <VerticalSpacing />
      <H3>
        <b>Вартість всього замовлення:</b> {numberWithSpaces(fullPrice)} грн
      </H3>

      <Dialog
        title="Редагувати замовлення"
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
                ? `*Якщо поле підсвічене жовтим, значить ви змінили дані в цьому полі`
                : 'Ви маєте заповнити всі поля, щоб зберегти зміни'
            }
            labelFor="text-input"
          >
            <Label>
              Замовник
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
              Адреса доставки
              <InputGroup
                id="address"
                placeholder=" Адреса доставки"
                value={shippingAddress}
                onChange={(e) => {
                  setShippingAddress(e.currentTarget.value)
                }}
                intent={shippingAddress !== order.shippingAddress ? Intent.WARNING : Intent.NONE}
              />
            </Label>

            <Label>
              Статус
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
                      text={STATUS_MAP[status as TOrder['status']]}
                    />
                  )
                }}
                onItemSelect={(item) => {
                  setSelectedStatus(item as TOrder['status'])
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
                  {STATUS_MAP[selectedStatus as TOrder['status']]}
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
                setOrderItems([
                  ...orderItems,
                  {
                    quantity: 0,
                    pricePerUnit: 0,
                    unit: 'T',
                    product: products![0],
                  } as any,
                ])
              }}
            >
              Додати позицію
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
            <Button icon="reset" intent={Intent.PRIMARY} onClick={handleResetToDefault}>
              Скинути до початкового стану
            </Button>
            {!isOrderCorrect || !isOrderModified ? (
              <Tooltip content="All fields must be filled">
                <Button
                  intent={Intent.SUCCESS}
                  disabled={!isOrderCorrect || !isOrderModified}
                  loading={isOrderUpdating}
                >
                  Редагувати
                </Button>
              </Tooltip>
            ) : (
              <Button
                intent={Intent.SUCCESS}
                disabled={!isOrderCorrect || !isOrderModified}
                onClick={handleUpdateOrderRequest}
                loading={isOrderUpdating}
              >
                Редагувати
              </Button>
            )}
          </FlexContainer>
        </DialogFooter>
      </Dialog>

      <Dialog
        title="Видалити замовлення"
        icon="trash"
        isOpen={isDeleteDialogOpened}
        canEscapeKeyClose
        canOutsideClickClose
        onClose={() => {
          setIsDeleteDialogOpened(false)
        }}
      >
        <DialogBody>
          <Callout
            intent={Intent.DANGER}
            title="Вим намагаєтеся видалити це замовлення"
            icon="trash"
          >
            Ви впевнені?
          </Callout>
        </DialogBody>
        <DialogFooter>
          <FlexContainer gap={5}>
            <Button
              onClick={() => {
                setIsDeleteDialogOpened(false)
              }}
            >
              Відмінити
            </Button>
            <Button intent={Intent.DANGER} onClick={handleDeleteOrder}>
              Видалити
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
