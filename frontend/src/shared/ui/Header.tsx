import React, { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button, Navbar, Alignment, H3 } from '@blueprintjs/core'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { Avatar } from './Avatar'
import { FlexContainer } from './FlexContainer'
import classNames from 'classnames'
import styles from './Header.module.scss'

export const Header = () => {
  const { user, logout } = useContext(AuthContext)

  console.log(user)

  return (
    <Navbar>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>
          <FlexContainer centered gap={5}>
            <Link to={`../user/${user?.id}`}>
              <Avatar url="" rounded width={30} height={30} />
            </Link>
            <H3 style={{ marginBottom: 0 }}>{user?.name}</H3>
          </FlexContainer>
        </Navbar.Heading>
        <Navbar.Divider />
        <FlexContainer between centeredY style={{ width: '100%' }} gap={10}>
          {/* <Link to="/orders" className="bp3-button bp3-minimal">
            Orders
          </Link> */}
          <NavLink
            className={({ isActive }) =>
              classNames('header__link uppercase', { [styles.active]: isActive })
            }
            to="/orders"
          >
            Orders
          </NavLink>
          <Link to="/users" className="bp3-button bp3-minimal">
            Users
          </Link>
          <Link to="/analytics" className="bp3-button bp3-minimal">
            Analytics
          </Link>
        </FlexContainer>
      </Navbar.Group>

      {user && (
        <Navbar.Group align={Alignment.RIGHT}>
          <Button className="bp3-minimal" icon="log-out" onClick={logout}>
            Logout
          </Button>
        </Navbar.Group>
      )}
    </Navbar>
  )
}
