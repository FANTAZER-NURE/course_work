import React, { useRef, useState } from 'react'
import styles from './Avatar.module.scss'
import { FaUser } from 'react-icons/fa'
import { Colors } from '@blueprintjs/core'
import cls from 'classnames'
import { useIntersectionOnce } from 'hooks/use-intersection'

interface Props {
  url: string
  width?: number
  height?: number
  rounded?: boolean
  fallbackContent?: React.ReactNode
  darkBackground?: boolean
  imageClassnames?: string
}

const imageBaseUrl: string = process.env.IMAGE_BASE_URL || ''

export const Avatar = ({
  url,
  width,
  height,
  rounded,
  fallbackContent,
  darkBackground = true,
  imageClassnames,
}: Props) => {
  const [loaded, setLoaded] = useState(false)
  const w = width || 100
  const h = height || 100
  const radius = rounded ? w : 0

  const imageUrl = url ? (url.startsWith('http') ? url : `${imageBaseUrl}/${url}`) : ''

  const ref = useRef<HTMLSpanElement | null>(null)

  const isVisible = useIntersectionOnce(ref)

  return (
    <span
      className={styles.wrapper}
      ref={ref}
      style={{
        width: `${w}px`,
        height: `${h}px`,
        borderRadius: radius,
        backgroundColor: darkBackground ? Colors.LIGHT_GRAY1 : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!loaded ? fallbackContent ? fallbackContent : <FaUser color={Colors.DARK_GRAY1} /> : null}
      {isVisible ? (
        <img
          src={imageUrl}
          alt=""
          className={cls(imageClassnames, !loaded ? styles.hidden : '')}
          onLoad={() => setLoaded(true)}
        />
      ) : null}
    </span>
  )
}
