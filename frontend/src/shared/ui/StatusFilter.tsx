import { MultiSelect } from '@blueprintjs/select'
import { TOrder } from '../../../../backend/src/types/order'
import { MenuItem } from '@blueprintjs/core'
import styles from './ManagerFilter.module.scss'
import classNames from 'classnames'

interface StatusFilterProps {
  selectedStatuses: TOrder['status'][]
  setSelectedStatuses: React.Dispatch<React.SetStateAction<TOrder['status'][]>>
  className?: string
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatuses,
  setSelectedStatuses,
  className,
}) => {
  return (
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
      noResults={<MenuItem disabled={true} text="Немає результатів." roleStructure="listoption" />}
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
      className={classNames(styles.multiSelect, className)}
    />
  )
}
