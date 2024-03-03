import React from 'react'
import styles from './VerticalSpacing.module.scss'

interface IProps {
  size?: 'large' | 'small' | 'xlarge' | 'xsmall'
  children?: React.ReactNode
}

const classMap = {
  large: styles.large,
  xlarge: styles.xlarge,
  small: styles.small,
  xsmall: styles.xsmall,
}

export const VerticalSpacing = ({size, children}: IProps) => {
  return <div className={size ? classMap[size] : styles.base}>{children}</div>
}
