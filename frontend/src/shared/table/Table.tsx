import React, { useCallback, useState } from 'react'
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
}

export function Table<T extends { id: string }>({
  data,
  columns,
  isLoading,
  theme,
  redirectToNewPage,
  redirectColumns,
}: SCTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>(true)

  // const handleSortingChange: OnChangeFn<SortingState> = useCallback(
  //   (updater) => {
  //     const state = typeof updater === 'function' ? updater(sorting) : updater
  //     if (state.length) {
  //       setSorting(state)
  //     } else {
  //       setSorting([{ id: 'position', desc: false }])
  //     }
  //   },
  //   [sorting]
  // )

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

  return (
    <div>
      <table className={styles.table}>
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
