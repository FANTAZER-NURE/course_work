import { ItemPredicate, ItemRenderer, MultiSelect } from '@blueprintjs/select'
import { TUser } from '../../../../backend/src/types/user'
import { useCallback } from 'react'
import { MenuItem } from '@blueprintjs/core'
import styles from './ManagerFilter.module.scss'
import classNames from 'classnames'

interface ManagerFilterProps {
  managers: TUser[]
  selectedManagers: TUser[]
  setSelectedManagers: React.Dispatch<React.SetStateAction<TUser[]>>
  className?: string
}

export const ManagerFilter: React.FC<ManagerFilterProps> = ({
  managers,
  selectedManagers,
  setSelectedManagers,
  className,
}) => {
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

  const filterManager: ItemPredicate<TUser> = useCallback((query, customer, _index, exactMatch) => {
    const normalizedTitle = customer.name.toLowerCase()
    const normalizedQuery = query.toLowerCase()

    if (exactMatch) {
      return normalizedTitle === normalizedQuery
    } else {
      return `${normalizedTitle} ${customer.email}`.indexOf(normalizedQuery) >= 0
    }
  }, [])

  const renderManagerTag = useCallback((manager: TUser) => manager.name, [])

  return (
    <MultiSelect<TUser>
      items={managers || []}
      itemRenderer={renderManager}
      noResults={<MenuItem disabled={true} text="Немає результатів." roleStructure="listoption" />}
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
      className={classNames(styles.multiSelect, className)}
    />
  )
}
