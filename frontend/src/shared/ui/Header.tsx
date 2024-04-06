import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button, Navbar, Alignment, H3, Tag, Intent, H5 } from '@blueprintjs/core'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { Avatar } from './Avatar'
import { FlexContainer } from './FlexContainer'
import classNames from 'classnames'
import styles from './Header.module.scss'
import { ROLE_INTENTS_MAP } from 'constants/role-intent'

export const Header = () => {
  const { user, logout } = useContext(AuthContext)

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT} style={{ width: '80%' }}>
        <Navbar.Heading style={{ width: '30%' }}>
          <Link to={`../users/${user?.id}`}>
            <FlexContainer centered gap={5}>
              <Avatar url="" rounded width={30} height={30} />
              <H5 style={{ marginBottom: 0 }}>{user?.name}</H5>
              <Tag minimal intent={ROLE_INTENTS_MAP[user!.role]}>
                {user?.role}
              </Tag>
            </FlexContainer>
          </Link>
        </Navbar.Heading>
        <Navbar.Divider />
        <FlexContainer between centeredY style={{ width: '100%' }} gap={10}>
          <NavLink
            className={({ isActive }) =>
              classNames('header__link uppercase', { [styles.active]: isActive })
            }
            to="/orders"
          >
            <Button className={styles.button} minimal icon="numbered-list" text="Замовлення" />
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              classNames('header__link uppercase', { [styles.active]: isActive })
            }
            to="/users"
          >
            <Button
              className={styles.button}
              minimal
              icon="user"
              text={user?.role !== 'admin' ? 'Менеджери' : 'Користувачі'}
            />
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              classNames('header__link uppercase', { [styles.active]: isActive })
            }
            to="/analytics"
          >
            <Button className={styles.button} minimal icon="series-search" text="Аналітика" />
          </NavLink>
        </FlexContainer>
      </Navbar.Group>

      {user && (
        <Navbar.Group align={Alignment.RIGHT}>
          <Button className="bp3-minimal" icon="log-out" onClick={logout}>
            Вийти
          </Button>
        </Navbar.Group>
      )}
    </Navbar>
  )
}
