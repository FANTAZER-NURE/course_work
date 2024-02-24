import { Button, Classes } from '@blueprintjs/core'
import React from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

export const Home = () => {
  return (
    <div className={classNames(styles.app, 'bp5-dark')}>
      <Link to="/money">
        <Button className={Classes.BUTTON}>Money</Button>
      </Link>
      <Link to="/gym">
        <Button className={Classes.BUTTON}>Gym</Button>
      </Link>
      <Link to="/calories">
        <Button className={Classes.BUTTON}>Calories</Button>
      </Link>
    </div>
  )
}
