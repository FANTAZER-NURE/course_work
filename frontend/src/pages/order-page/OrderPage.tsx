import {
  Breadcrumb,
  BreadcrumbProps,
  Breadcrumbs,
  Button,
  H2,
  H3,
  H4,
  Icon,
  Intent,
  Spinner,
} from '@blueprintjs/core'
import { deleteApi, getApi } from 'api/httpClient'
import { useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './OrderPage.module.scss'
import { useCallback, useContext, useMemo, useState } from 'react'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { AuthContext } from 'shared/components/auth/AuthContext'

interface OrderPageProps {}

export const OrderPage: React.FC<OrderPageProps> = () => {
  const { id } = useParams()
  const { user, users } = useContext(AuthContext)

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
    ['customer', id],
    async () => {
      return await getApi(`/customers/${order?.customerId}` as '/customers/:id')
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
      enabled: !!order,
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
      { href: '/orders', icon: 'folder-close', text: 'orders' },
      { href: `/orders/${id}`, icon: 'document', text: 'order' },
    ],
    [id]
  )

  const fullPrice = useMemo(() => {
    let price = 0

    if (!order) {
      return 0
    }

    const items = order?.productDetails

    Object.keys(items).forEach((key) => {
      price += items[key].quantity * items[key].pricePerUnit
    })

    return price
  }, [order])

  const navigate = useNavigate()

  const [isOrderDeleting, setIsOrderDeleting] = useState(false)

  const handleDeleteOrder = useCallback(async () => {
    setIsOrderDeleting(true)

    try {
      const res = await deleteApi(`/orders/${id}` as '/orders/:id')
      queryClient.invalidateQueries(['orders', users])

      console.log('res', res)
    } catch (error) {
      console.log(error)
    }

    setIsOrderDeleting(false)
    navigate('../orders')
  }, [id, navigate, queryClient, users])

  if (isLoading || isLoadingUser || isLoadingCustomer) {
    return <Spinner />
  }

  if (error || !order || !manager) {
    return <div>Error fetching order</div>
  }

  console.log(
    Object.entries(order.productDetails).map(([productId, productDetail]) => {
      console.log(productDetail)
    })
  )
  const createdAt = new Date(order!.createdAt)
  const updatedAt = new Date(order!.createdAt)

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs currentBreadcrumbRenderer={renderCurrentBreadcrumb} items={BREADCRUMBS} />
      <H2>Order #{order.id}</H2>
      {user?.role !== 'director' ? (
        <FlexContainer gap={5}>
          <Button intent={Intent.WARNING} icon="edit">
            Edit
          </Button>
          <Button
            loading={isOrderDeleting}
            intent={Intent.DANGER}
            icon="cross"
            onClick={handleDeleteOrder}
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
        <b>Status:</b> {order.status}
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
            Object.entries(order.productDetails).map(([productId, productDetail]) => (
              <tr key={productId}>
                <td>{productDetail.product.id}</td>
                <td>{productDetail.product.name}</td>
                <td>{`${productDetail.quantity} ${productDetail.unit}`}</td>
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
    </div>
  )
}
