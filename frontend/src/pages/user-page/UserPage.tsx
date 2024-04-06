import { useNavigate, useParams } from 'react-router'
import styles from './UserPage.module.scss'
import {
  Breadcrumb,
  BreadcrumbProps,
  Breadcrumbs,
  Button,
  Callout,
  Classes,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  H1,
  H3,
  InputGroup,
  Intent,
  Label,
  MenuItem,
  Spinner,
  Tab,
  TabId,
  Tabs,
  Tooltip,
} from '@blueprintjs/core'
import { useQuery, useQueryClient } from 'react-query'
import { deleteApi, getApi, putApi } from 'api/httpClient'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { useCallback, useContext, useMemo, useState } from 'react'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { MultiSelect, Select } from '@blueprintjs/select'
import { TUser } from '../../../../backend/src/types/user'
import { Table, isAccessorColumn } from 'shared/table/Table'
import { makeOrderRow } from 'utils/makeOrderRow'
import { useOrdersColumnDefs } from 'pages/orders/use-orders-column-defs'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import { TOrder } from '../../../../backend/src/types/order'
import { DateRange, DateRangeInput3 } from '@blueprintjs/datetime2'
import classNames from 'classnames'
import { DISPLAY_DATE_FORMAT, momentFormatter } from 'utils/formatDate'
import { IconNames } from '@blueprintjs/icons'
import { isOrderInDateRange } from 'utils/isOrderInDateRange'

const ROLES_MAP = {
  admin: 'Адміністратор',
  manager: 'Менеджер',
  director: 'Директор',
}

interface UserPageProps {}

export const UserPage: React.FC<UserPageProps> = () => {
  const { id } = useParams()
  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState(false)
  const [isUserDeleting, setIsUserDeleting] = useState(false)
  const { user: loggedUser, users } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<TUser['role'] | null>(null)
  const [isUserUpdating, setIsUserUpdating] = useState(false)
  const [selectedTabId, setSelectedTabId] = useState<TabId>('active')
  const [selectedStatuses, setSelectedStatuses] = useState<TOrder['status'][]>([])
  const [dateRange, setDateRange] = useState<DateRange>([null, null])

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { isLoading, data: user } = useQuery(
    ['user', id],
    async () => {
      return await getApi(`/users/${id}` as '/users/:id')
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
      onSuccess: (res) => {
        setName(res.name)
        setEmail(res.email)
        setRole(res.role)
      },
    }
  )

  const { data: orders, isFetching: isFetchingOrders } = useQuery(
    ['ordersOnUserPage', user],
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

  const managers = useMemo(() => {
    return users?.filter((user) => user.role === 'manager')
  }, [users])

  const { columns } = useOrdersColumnDefs(managers || [], customers || [])

  const BREADCRUMBS: BreadcrumbProps[] = useMemo(
    () => [
      { href: '/users', icon: 'people', text: 'Users' },
      { href: `/users/${id}`, icon: 'user', text: '' },
    ],
    [id]
  )

  const isUserModified = useMemo(() => {
    if (name !== user?.name || email !== user.email || role !== user.role) {
      return true
    }

    return false
  }, [email, name, role, user])

  const isUserCorrect = useMemo(() => {
    if (!name.length || !email.length) {
      return false
    }

    return true
  }, [email, name])

  const rowsActive = useMemo(() => {
    if (!orders) {
      return []
    }

    const rows = orders
      .filter((iter) => iter.status !== 'done' && iter.managerId === user?.id)
      .map((order) => makeOrderRow(order))
      .filter((row) => !selectedStatuses.length || selectedStatuses.includes(row.status))
      .filter((row) => isOrderInDateRange(row, dateRange))

    return rows
  }, [dateRange, orders, selectedStatuses, user])

  const rowsDone = useMemo(() => {
    if (!orders) {
      return []
    }

    const rows = orders
      .filter((iter) => iter.status === 'done' && iter.managerId === user?.id)
      .map((order) => makeOrderRow(order))
      .filter((row) => !selectedStatuses.length || selectedStatuses.includes(row.status))
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

    return rows
  }, [dateRange, orders, selectedStatuses, user])

  const accessorColumns = useMemo(() => {
    return columns.filter(isAccessorColumn)
  }, [columns])

  const handleDeleteUser = useCallback(async () => {
    setIsUserDeleting(true)

    try {
      await deleteApi(`/users/${id}` as '/users/:id')
      queryClient.invalidateQueries(['users'])
    } catch (error) {
      console.log(error)
    }

    setIsUserDeleting(false)
    navigate('../users')
  }, [id, navigate, queryClient])

  const handleResetToDefault = useCallback(() => {
    if (!user) {
      return
    }

    setName(user.name)
    setEmail(user.email)
    setRole(user.role)
  }, [user])

  const handleUpdateUserRequest = useCallback(async () => {
    if (!user || !role || !name || !email) {
      return
    }

    try {
      setIsUserUpdating(true)

      await putApi(`/users/${id}` as '/users/:id', {
        name,
        email,
        role,
      })
      queryClient.invalidateQueries(['user', id])
    } catch (error) {
      console.log(error)
    }

    setIsUserUpdating(false)
    setIsDialogOpened(false)
  }, [email, id, name, queryClient, role, user])

  const redirectToNewPage = useCallback(
    (value: string) => {
      navigate(`/orders/${value}`)
    },
    [navigate]
  )

  if (isLoading || isFetchingCustomers || isFetchingOrders) {
    return <Spinner />
  }

  if (!user) {
    return null
  }

  const renderCurrentBreadcrumb = ({ text, ...restProps }: BreadcrumbProps) => {
    return (
      <Breadcrumb {...restProps}>
        {text} {user.name}
      </Breadcrumb>
    )
  }

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs currentBreadcrumbRenderer={renderCurrentBreadcrumb} items={BREADCRUMBS} />

      <H1>{user.name}</H1>

      {loggedUser?.role === 'admin' ? (
        <FlexContainer gap={5} centeredY>
          <Button intent={Intent.WARNING} icon="edit" onClick={() => setIsDialogOpened(true)}>
            Edit
          </Button>
          <Button
            loading={isUserDeleting}
            intent={Intent.DANGER}
            icon="cross"
            onClick={() => setIsDeleteDialogOpened(true)}
          >
            Delete
          </Button>
        </FlexContainer>
      ) : null}

      <H3>Role: {ROLES_MAP[user.role]}</H3>
      <H3>Email: {user.email}</H3>

      {user.role === 'manager' ? (
        <FlexContainer centered column>
          <FlexContainer gap={10} wrap>
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
              noResults={<MenuItem disabled={true} text="No results." roleStructure="listoption" />}
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
          <FlexContainer centeredX className={styles.tableWrapper}>
            <Tabs
              animate
              onChange={(id) => {
                setSelectedTabId(id)
              }}
              selectedTabId={selectedTabId}
              className={styles.tabs}
              large
            >
              <Tab
                title="Active orders"
                id="active"
                tagContent={rowsActive.length}
                tagProps={{ intent: Intent.NONE, round: true }}
                className={styles.tabs}
                panel={
                  <>
                    <Table
                      data={rowsActive}
                      columns={accessorColumns}
                      theme="light"
                      isLoading={isFetchingOrders}
                      redirectToNewPage={redirectToNewPage}
                      redirectColumns={['id']}
                      totalRow
                    />
                  </>
                }
              ></Tab>
              <Tab
                title="Completed orders"
                id="completed"
                tagContent={rowsDone.length}
                tagProps={{ intent: Intent.NONE, round: true }}
                className={styles.tabs}
                panel={
                  <>
                    <Table
                      data={rowsDone}
                      columns={accessorColumns}
                      theme="light"
                      isLoading={isFetchingOrders}
                      redirectToNewPage={redirectToNewPage}
                      redirectColumns={['id']}
                      totalRow
                    />
                  </>
                }
              ></Tab>
            </Tabs>
          </FlexContainer>
          <VerticalSpacing />
        </FlexContainer>
      ) : null}

      <Dialog
        title="Update user"
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
              isUserModified
                ? `*Yellow highlight - means this field is modified`
                : 'You must fill all the fields'
            }
            labelFor="text-input"
          >
            <Label>
              Name
              <InputGroup
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.currentTarget.value)
                }}
                intent={name !== user.name ? Intent.WARNING : Intent.NONE}
              />
            </Label>
            <Label>
              Email
              <InputGroup
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.currentTarget.value)
                }}
                intent={email !== user.email ? Intent.WARNING : Intent.NONE}
              />
            </Label>
            <Label>
              Status
              <Select
                items={['director', 'manager']}
                itemRenderer={(status, { handleClick, handleFocus, modifiers, query }) => {
                  if (!modifiers.matchesPredicate) {
                    return null
                  }
                  return (
                    <MenuItem
                      active={role === status}
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
                  setRole(item as TUser['role'])
                }}
                filterable={false}
              >
                <Button
                  alignText="left"
                  fill
                  icon="layout-hierarchy"
                  rightIcon="caret-down"
                  intent={role !== user.role ? Intent.WARNING : Intent.NONE}
                >
                  {role}
                </Button>
              </Select>
            </Label>
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
            {!isUserCorrect || !isUserModified ? (
              <Tooltip content="All fields must be filled/modified">
                <Button
                  intent={Intent.SUCCESS}
                  disabled={!isUserCorrect || !isUserModified}
                  loading={isUserUpdating}
                >
                  Edit
                </Button>
              </Tooltip>
            ) : (
              <Button
                intent={Intent.SUCCESS}
                disabled={!isUserCorrect || !isUserModified}
                onClick={handleUpdateUserRequest}
                loading={isUserUpdating}
              >
                Edit
              </Button>
            )}
          </FlexContainer>
        </DialogFooter>
      </Dialog>

      <Dialog
        title="Delete user"
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
            <Button intent={Intent.DANGER} onClick={handleDeleteUser}>
              Delete
            </Button>
          </FlexContainer>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
