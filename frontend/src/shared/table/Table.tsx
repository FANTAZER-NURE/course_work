import React, { useCallback, useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  ColumnDef,
  Column,
  AccessorKeyColumnDef,
  ExpandedState,
  getExpandedRowModel,
  OnChangeFn,
} from '@tanstack/react-table'
import styles from './Table.module.scss'
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import classNames from 'classnames'
import { Spinner, Tooltip } from '@blueprintjs/core'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { Loader } from '../../app/App'
import { TOrder } from '../../../../backend/src/types/order'

export interface BaseTableRow {
  _id: string
}

interface ColumnMeta {
  width?: number
  tooltip?: string
  section?: string
  configModalName?: string
}

function getMetaFromColumn<TData, TValue>(col: Column<TData, TValue>): ColumnMeta {
  return {
    width: ((col.columnDef.meta as any)?.width ?? undefined) as number | undefined,
    tooltip: ((col.columnDef.meta as any)?.tooltip ?? undefined) as string | undefined,
  }
}

export function getMetaFromColumnDef<T>(col: ColumnDef<T, any>): ColumnMeta {
  return {
    width: ((col.meta as any)?.width ?? undefined) as number | undefined,
    tooltip: ((col.meta as any)?.tooltip ?? undefined) as string | undefined,
    section: ((col.meta as any)?.section ?? undefined) as string | undefined,
    configModalName: ((col.meta as any)?.configModalName ?? undefined) as string | undefined,
  }
}

export function isAccessorColumn<T>(
  columnDef: ColumnDef<T>
): columnDef is AccessorKeyColumnDef<T, any> {
  return !!(columnDef as AccessorKeyColumnDef<T, any>).accessorKey
}

interface SCTableProps<T> {
  data: T[]
  columns: AccessorKeyColumnDef<T, any>[]
  isLoading: boolean
  theme: 'dark' | 'light'
  redirectToNewPage: (value: string) => void
  redirectColumns: string[]
  totalRow?: boolean
}

export function Table<T extends { id: string }>({
  data,
  columns,
  isLoading,
  theme,
  redirectToNewPage,
  redirectColumns,
  totalRow,
}: SCTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>(true)

  const table = useReactTable<T>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      expanded,
    },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getSubRows: (row) => (row as any).subRows,
    getExpandedRowModel: getExpandedRowModel(),
  })

  const totalPrice = useMemo(() => {
    if (totalRow) {
      return data.reduce((total, order) => total + (order as any).orderPrice, 0)
    }

    return 0
  }, [data, totalRow])

  const total95 = useMemo(() => {
    if (totalRow) {
      return data.reduce((total, order) => {
        const matchingProduct = (order as any as TOrder).productDetails.find(
          (product) => product.product.id === 1
        )

        console.log('matchingProduct', matchingProduct)

        if (matchingProduct) {
          return total + matchingProduct.quantity
        }

        return total
      }, 0)
    }

    return 0
  }, [data, totalRow])

  console.log(data)

  const total92 = useMemo(() => {
    if (totalRow) {
      return data.reduce((total, order) => {
        const matchingProduct = (order as any as TOrder).productDetails.find(
          (product) => product.product.id === 2
        )

        if (matchingProduct) {
          return total + matchingProduct.quantity
        }

        return total
      }, 0)
    }

    return 0
  }, [data, totalRow])
  const totalDiesel = useMemo(() => {
    if (totalRow) {
      return data.reduce((total, order) => {
        const matchingProduct = (order as any as TOrder).productDetails.find(
          (product) => product.product.id === 3
        )

        if (matchingProduct) {
          return total + matchingProduct.quantity
        }

        return total
      }, 0)
    }

    return 0
  }, [data, totalRow])

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        {data.length ? (
          <>
            <thead className={styles.thead}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, i) => (
                    <th key={header.id} className={classNames(styles.tableHeaderCell)}>
                      {header.isPlaceholder ? null : (
                        <div
                          style={{
                            width: getMetaFromColumn(header.column).width,
                            height: '2em',
                            color: header.column.getIsSorted()
                              ? theme === 'dark'
                                ? '#F0B726'
                                : '#C87619'
                              : undefined,
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <Tooltip
                            content={getMetaFromColumn(header.column).tooltip}
                            placement="bottom"
                            targetTagName="div"
                          >
                            <FlexContainer centeredY gap={5}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {header.column.getCanSort()
                                ? {
                                    asc: (
                                      <FaSortUp
                                        className={classNames({
                                          [styles.sortIcon]: !header.column.getIsSorted(),
                                          [styles.sortIconSorted]: header.column.getIsSorted(),
                                        })}
                                      />
                                    ),
                                    desc: (
                                      <FaSortDown
                                        className={classNames({
                                          [styles.sortIcon]: !header.column.getIsSorted(),
                                          [styles.sortIconSorted]: header.column.getIsSorted(),
                                        })}
                                      />
                                    ),
                                  }[header.column.getIsSorted() as string] ?? (
                                    <FaSort
                                      className={classNames({
                                        [styles.sortIcon]: !header.column.getIsSorted(),
                                        [styles.sortIconSorted]: header.column.getIsSorted(),
                                      })}
                                    />
                                  )
                                : null}
                            </FlexContainer>
                          </Tooltip>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className={styles.tbody}>
              {totalRow ? (
                <tr className={styles.tr} style={{ backgroundColor: '#EDEFF2' }}>
                  <td className={styles.tableCell}></td>
                  <td className={styles.tableCell}></td>
                  <td className={styles.tableCell}></td>
                  <td className={styles.tableCell}></td>
                  <td className={styles.tableCell}></td>
                  <td className={styles.tableCell}>
                    <Tooltip content="Загальний обʼєм">
                      <b>
                        A95: {total95}T
                        <br />
                        A92: {total92}T
                        <br />
                        Дизель: {totalDiesel}T
                      </b>
                    </Tooltip>
                  </td>
                  <td className={styles.tableCell}>
                    <Tooltip content="Загальна сума">
                      <b>{totalPrice.toLocaleString('en-US')}</b>
                    </Tooltip>
                  </td>
                  <td className={styles.tableCell}></td>
                </tr>
              ) : null}

              {table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id} className={styles.tr}>
                    {row.getVisibleCells().map((cell, i) => {
                      return (
                        <td
                          className={classNames(styles.tableCell, {
                            [styles.redirectCell]: redirectColumns.includes(cell.column.id),
                          })}
                          key={cell.id}
                          style={{
                            width: getMetaFromColumn(cell.column).width,
                          }}
                          onClick={() => {
                            if (redirectColumns.includes(cell.column.id)) {
                              redirectToNewPage(row.original.id)
                            }
                          }}
                        >
                          <div style={{ width: getMetaFromColumn(cell.column).width }}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </>
        ) : (
          'No data'
        )}
      </table>
      {isLoading ? (
        <div
          className={classNames({
            [styles.loaderDark]: theme === 'dark',
            [styles.loaderLight]: theme === 'light',
          })}
        >
          <Loader />
        </div>
      ) : null}
    </div>
  )
}
